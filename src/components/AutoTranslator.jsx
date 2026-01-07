import { useEffect, useRef } from "react";
import { useLanguage } from "../context/LanguageContext";
import { translateText, mapBrowserLangToGoogleLang } from "../utils/translate";

// Languages that don't need translation (already have translations in translations.js)
const TRANSLATED_LANGUAGES = ['uz', 'ru', 'en'];

function AutoTranslator() {
  const { language } = useLanguage();
  const isTranslatingRef = useRef(false);
  const observerRef = useRef(null);

  useEffect(() => {
    // Skip translation if language is already translated or if already translating
    if (TRANSLATED_LANGUAGES.includes(language) || isTranslatingRef.current) {
      return;
    }

    // Skip if language matches document language
    const docLang = document.documentElement.lang || 'uz';
    if (docLang === language) {
      return;
    }

    isTranslatingRef.current = true;

    // Debounce function
    let debounceTimer;
    const debounce = (func, delay) => {
      return (...args) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func(...args), delay);
      };
    };

    // Translate text content
    const translateElement = async (element) => {
      // Skip if element should not be translated
      if (
        element.dataset.translate === 'false' ||
        element.tagName === 'SCRIPT' ||
        element.tagName === 'STYLE' ||
        element.tagName === 'NOSCRIPT'
      ) {
        return;
      }

      // Translate text nodes
      const walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: (node) => {
            // Skip if parent has data-translate="false"
            let parent = node.parentElement;
            while (parent && parent !== element) {
              if (parent.dataset.translate === 'false') {
                return NodeFilter.FILTER_REJECT;
              }
              parent = parent.parentElement;
            }
            return node.textContent.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
          }
        }
      );

      const textNodes = [];
      let node;
      while ((node = walker.nextNode())) {
        const text = node.textContent.trim();
        if (text && text.length > 1) {
          textNodes.push({ node, text });
        }
      }

      // Translate text nodes
      for (const { node, text } of textNodes) {
        try {
          const translated = await translateText(text, language, 'auto');
          if (translated && translated !== text) {
            node.textContent = translated;
          }
        } catch (error) {
          console.error('Translation error:', error);
        }
      }

      // Translate attributes
      const translateAttributes = element.dataset.translateAttr;
      if (translateAttributes) {
        const attrs = translateAttributes.split(',').map(a => a.trim());
        for (const attr of attrs) {
          const value = element.getAttribute(attr);
          if (value) {
            try {
              const translated = await translateText(value, language, 'auto');
              if (translated && translated !== value) {
                element.setAttribute(attr, translated);
              }
            } catch (error) {
              console.error('Attribute translation error:', error);
            }
          }
        }
      }
    };

    // Translate main content
    const translateContent = debounce(async () => {
      try {
        // Translate header navigation
        const header = document.querySelector('header nav');
        if (header) {
          await translateElement(header);
        }

        // Translate main content
        const main = document.querySelector('main') || document.querySelector('[role="main"]') || document.body;
        if (main) {
          // Skip header and footer for now (they use getTranslation)
          const content = main.querySelectorAll('section, article, div[class*="section"]');
          for (const section of content) {
            await translateElement(section);
          }
        }
      } catch (error) {
        console.error('Content translation error:', error);
      } finally {
        isTranslatingRef.current = false;
      }
    }, 500);

    // Initial translation
    translateContent();

    // Watch for DOM changes
    observerRef.current = new MutationObserver((mutations) => {
      let shouldTranslate = false;
      for (const mutation of mutations) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          for (const node of mutation.addedNodes) {
            if (node.nodeType === Node.ELEMENT_NODE) {
              // Check if it's a significant content change
              if (
                node.tagName === 'SECTION' ||
                node.tagName === 'ARTICLE' ||
                node.tagName === 'DIV' ||
                node.textContent?.trim().length > 10
              ) {
                shouldTranslate = true;
                break;
              }
            }
          }
        }
        if (shouldTranslate) break;
      }
      if (shouldTranslate) {
        translateContent();
      }
    });

    // Observe main content area
    const main = document.querySelector('main') || document.querySelector('[role="main"]') || document.body;
    if (main) {
      observerRef.current.observe(main, {
        childList: true,
        subtree: true,
        characterData: false,
      });
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      isTranslatingRef.current = false;
    };
  }, [language]);

  return null; // This component doesn't render anything
}

export default AutoTranslator;
