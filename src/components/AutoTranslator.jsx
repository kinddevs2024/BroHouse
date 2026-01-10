"use client";

import { useEffect, useRef } from "react";
import { LANGUAGE_MAP } from "../utils/languages-map";

const TARGET_SELECTORS = ["body"];
const ATTR_KEY = "data-translate-attr";
const CACHE = new Map();

const mapGoogleLocaleToLanguage = (locale) => {
  if (!locale) return "en";
  const lower = locale.toLowerCase();
  const base = lower.split("-")[0];

  if (LANGUAGE_MAP[lower]) {
    return LANGUAGE_MAP[lower];
  }

  return LANGUAGE_MAP[base] ?? "en";
};

const detectUserLanguage = () => {
  if (typeof navigator === "undefined") {
    return "en";
  }

  const navigatorAny = navigator;

  if (navigator.language) {
    const mapped = mapGoogleLocaleToLanguage(navigator.language);
    if (mapped) return mapped;
  }

  if (navigator.languages && navigator.languages.length > 0) {
    for (const lang of navigator.languages) {
      const mapped = mapGoogleLocaleToLanguage(lang);
      if (mapped) {
        return mapped;
      }
    }
  }

  if (navigatorAny.systemLanguage) {
    const mapped = mapGoogleLocaleToLanguage(navigatorAny.systemLanguage);
    if (mapped) return mapped;
  }

  if (navigatorAny.userLanguage) {
    const mapped = mapGoogleLocaleToLanguage(navigatorAny.userLanguage);
    if (mapped) return mapped;
  }

  if (navigatorAny.browserLanguage) {
    const mapped = mapGoogleLocaleToLanguage(navigatorAny.browserLanguage);
    if (mapped) return mapped;
  }

  try {
    const dateLocale = new Intl.DateTimeFormat().resolvedOptions().locale;
    if (dateLocale) {
      const mapped = mapGoogleLocaleToLanguage(dateLocale);
      if (mapped && mapped !== "en") return mapped;
    }

    const numberLocale = new Intl.NumberFormat().resolvedOptions().locale;
    if (numberLocale) {
      const mapped = mapGoogleLocaleToLanguage(numberLocale);
      if (mapped && mapped !== "en") return mapped;
    }

    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (timeZone) {
      const timezoneToLanguage = {
        "Europe/Moscow": "ru",
        "Asia/Tokyo": "ja",
        "Asia/Shanghai": "zh-CN",
        "Asia/Seoul": "ko",
        "Asia/Bangkok": "th",
        "Asia/Jakarta": "id",
        "Asia/Ho_Chi_Minh": "vi",
        "Europe/Berlin": "de",
        "Europe/Paris": "fr",
        "Europe/Madrid": "es",
        "Europe/Rome": "it",
        "Europe/Amsterdam": "nl",
        "Europe/Warsaw": "pl",
        "Europe/Prague": "cs",
        "Europe/Stockholm": "sv",
        "Europe/Oslo": "no",
        "Europe/Copenhagen": "da",
        "Europe/Helsinki": "fi",
        "America/Sao_Paulo": "pt",
        "America/Mexico_City": "es",
        "America/Argentina/Buenos_Aires": "es",
        "Africa/Cairo": "ar",
        "Asia/Dubai": "ar",
        "Asia/Riyadh": "ar",
        "Asia/Tel_Aviv": "he",
        "Europe/Kiev": "uk",
        "Europe/Istanbul": "tr",
      };

      const langFromTimezone = timezoneToLanguage[timeZone];
      if (langFromTimezone) {
        return langFromTimezone;
      }
    }
  } catch (error) {
    console.debug("Intl API detection failed:", error);
  }

  return "en";
};

async function translateText(text, target) {
  const cacheKey = `${target}:${text}`;
  if (CACHE.has(cacheKey)) return CACHE.get(cacheKey);

  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${encodeURIComponent(
    target,
  )}&dt=t&q=${encodeURIComponent(text)}`;

  const response = await fetch(url);
  if (!response.ok) throw new Error(`Translate failed: ${response.status}`);

  const data = await response.json();
  const translated =
    Array.isArray(data) && Array.isArray(data[0])
      ? data[0]
          .map((entry) => (Array.isArray(entry) ? entry[0] : ""))
          .join("")
      : text;

  const resolved = translated || text;
  CACHE.set(cacheKey, resolved);
  return resolved;
}

function collectTextNodes(root) {
  const nodes = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: (node) => {
      const parent = node.parentElement;
      if (!parent) return NodeFilter.FILTER_REJECT;
      if (parent.closest("[data-translate='false']"))
        return NodeFilter.FILTER_REJECT;
      if (["SCRIPT", "STYLE"].includes(parent.tagName))
        return NodeFilter.FILTER_REJECT;
      if (!node.nodeValue || !node.nodeValue.trim())
        return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  let current = walker.nextNode();
  while (current) {
    nodes.push(current);
    current = walker.nextNode();
  }
  return nodes;
}

async function translateElement(root, target) {
  const textNodes = collectTextNodes(root);
  const tasks = [];

  textNodes.forEach((node) => {
    const original = node.nodeValue?.trim() || "";
    if (!original) return;
    const task = translateText(original, target)
      .then((translated) => {
        if (translated && translated !== original) {
          node.nodeValue = node.nodeValue?.replace(original, translated) ?? translated;
        }
      })
      .catch(() => {});
    tasks.push(task);
  });

  const attributeElements = Array.from(
    root.querySelectorAll(`[${ATTR_KEY}]`),
  );
  for (const el of attributeElements) {
    const attrs = el.getAttribute(ATTR_KEY);
    if (!attrs) continue;
    for (const attrName of attrs
      .split(",")
      .map((a) => a.trim())
      .filter(Boolean)) {
      const value = el.getAttribute(attrName);
      if (!value) continue;
      const task = translateText(value, target)
        .then((translated) => {
          if (translated && translated !== value) {
            el.setAttribute(attrName, translated);
          }
        })
        .catch(() => {});
      tasks.push(task);
    }
  }

  if (tasks.length) {
    await Promise.all(tasks);
  }
}

export function AutoTranslator() {
  const observerRef = useRef(null);
  const isTranslating = useRef(false);
  const rafRef = useRef(null);
  const lastLanguageRef = useRef("en");
  const pollRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const targetLanguage = detectUserLanguage();
    lastLanguageRef.current = targetLanguage;

    if (!targetLanguage) return;

    const runTranslation = async () => {
      if (isTranslating.current) return;
      isTranslating.current = true;
      try {
        for (const selector of TARGET_SELECTORS) {
          const el = document.querySelector(selector);
          if (el) {
            await translateElement(el, targetLanguage);
          }
        }
      } finally {
        isTranslating.current = false;
      }
    };

    const scheduleRun = () => {
      if (rafRef.current !== null || isTranslating.current) return;
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null;
        void runTranslation();
      });
    };

    runTranslation();

    observerRef.current = new MutationObserver(() => {
      scheduleRun();
    });
    observerRef.current.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    pollRef.current = window.setInterval(() => {
      const detected = detectUserLanguage();
      if (detected && detected !== lastLanguageRef.current) {
        lastLanguageRef.current = detected;
        scheduleRun();
      }
    }, 2000);

    return () => {
      observerRef.current?.disconnect();
      if (rafRef.current !== null) window.cancelAnimationFrame(rafRef.current);
      if (pollRef.current !== null) window.clearInterval(pollRef.current);
    };
  }, []);

  return null;
}
