import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@material-tailwind/react";
import { motion } from "framer-motion";
import { servicesData, whyChooseUs, contactInfo } from "../data";
import { imagePool } from "../data/images";
import { API_ENDPOINTS, SERVICES_BASE_URL, BOOKINGS_BASE_URL } from "../data/api";
import { fetchWithTimeout } from "../utils/api";
import { useLanguage } from "../context/LanguageContext";
import { getTranslation, translations } from "../data/translations";
import ServiceCard from "../components/ServiceCard";
import ContactForm from "../components/ContactForm";
import RegisterModal from "../components/RegisterModal";
import Footer from "../components/Footer";
import { Analytics } from "@vercel/analytics/react";
import ImageLightbox from "../components/ImageLightbox";

function Home() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxImages, setLightboxImages] = useState([]);
  
  // Get translated whyChooseUs
  const translatedWhyChooseUs = translations[language]?.whyChooseUs || whyChooseUs;

  // Fetch comments from API
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoadingComments(true);
        const response = await fetchWithTimeout(
          `${BOOKINGS_BASE_URL}${API_ENDPOINTS.comments}`,
          {
            method: "GET",
            headers: {
              Accept: "*/*",
              "Content-Type": "application/json",
            },
            mode: "cors",
          },
          5000
        );

        if (response.ok) {
          const data = await response.json();
          // Transform API response to match display format
          const transformedComments = Array.isArray(data)
            ? data
                .filter((item) => item.comment && item.comment.trim() !== "")
                .map((item) => ({
                  name: item.client_name || item.client?.name || item.name || "Клиент",
                  text: item.comment || item.message || "",
                  id: item.id || item._id,
                }))
                .slice(0, 6) // Limit to 6 comments
            : [];
          setComments(transformedComments);
        }
      } catch (err) {
        console.error("Error fetching comments:", err);
        // Fallback to empty array on error
        setComments([]);
      } finally {
        setLoadingComments(false);
      }
    };

    fetchComments();
  }, []);

  // Fetch services from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoadingServices(true);
        console.log(
          "Fetching services from:",
          `${SERVICES_BASE_URL}${API_ENDPOINTS.services}`
        );

        const response = await fetchWithTimeout(
          `${SERVICES_BASE_URL}${API_ENDPOINTS.services}`,
          {
            method: "GET",
            headers: {
              Accept: "*/*",
              "Content-Type": "application/json",
            },
            mode: "cors",
          },
          5000
        );

        console.log(
          "Services response status:",
          response.status,
          response.statusText
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Services fetch error:", errorText);
          throw new Error(
            `Failed to fetch services: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();
        console.log("Services data received:", data);
        // Handle both array response and object with data property
        let servicesList = Array.isArray(data)
          ? data
          : data.data || data.services || [];

        // Debug: Log first service to see what fields are available
        if (servicesList.length > 0) {
          console.log("First service from API:", servicesList[0]);
          console.log("Image URL fields:", {
            image_url: servicesList[0].image_url,
            imageUrl: servicesList[0].imageUrl,
            image: servicesList[0].image
          });
        }

        // Map API response to expected format with icon mapping
        const mappedServices = (servicesList || []).map((service, index) => {
          // Map service name to icon type (handles both English and Uzbek)
          const getIconType = (name) => {
            const nameLower = (name || "").toLowerCase();
            // English keywords
            if (
              nameLower.includes("haircut") ||
              nameLower.includes("hair cut") ||
              nameLower.includes("hair") ||
              nameLower.includes("soch")
            ) {
              return "scissors";
            } else if (
              nameLower.includes("beard") ||
              nameLower.includes("soqol") ||
              nameLower.includes("facial") ||
              nameLower.includes("yuz")
            ) {
              return "beard";
            } else if (
              nameLower.includes("shave") ||
              nameLower.includes("razor") ||
              nameLower.includes("qirqish")
            ) {
              return "razor";
            } else if (
              nameLower.includes("kid") ||
              nameLower.includes("child") ||
              nameLower.includes("bola")
            ) {
              return "kid";
            }
            return "scissors"; // default
          };

          // Format price for display
          const formatPrice = (price) => {
            if (!price) return "N/A";
            const numPrice = parseFloat(price);
            if (isNaN(numPrice)) return price;
            // Format as currency (UZS)
            return new Intl.NumberFormat("uz-UZ", {
              style: "currency",
              currency: "UZS",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(numPrice);
          };

          // Get image URL - check multiple possible field names and handle relative URLs
          let imageUrl = service.image_url || service.imageUrl || service.image || null;
          
          // If image URL is relative, make it absolute using the API base URL
          if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('//') && !imageUrl.startsWith('/')) {
            imageUrl = `${SERVICES_BASE_URL}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
          } else if (imageUrl && imageUrl.startsWith('/') && !imageUrl.startsWith('//')) {
            // If it starts with /, prepend the base URL
            imageUrl = `${SERVICES_BASE_URL}${imageUrl}`;
          }

          return {
            id: service.id || service._id || index + 1,
            name: service.name || service.title || "Service",
            icon: service.icon || getIconType(service.name || service.title),
            image_url: imageUrl,
            description:
              service.description ||
              service.desc ||
              service.about ||
              `${
                service.duration
                  ? `${service.duration} min`
                  : "Professional service"
              }`,
            price: service.price ? formatPrice(service.price) : null,
            duration: service.duration || null,
            originalPrice: service.price || null,
          };
        });

        setServices(mappedServices.length > 0 ? mappedServices : servicesData);
      } catch (err) {
        console.error("Error fetching services:", err);
        console.error("Error details:", {
          message: err.message,
          stack: err.stack,
          name: err.name,
        });
        // Use fallback servicesData if API fails
        setServices(servicesData);
      } finally {
        setLoadingServices(false);
      }
    };

    fetchServices();
  }, []);

  // Use API services if available, otherwise fallback to static data
  const displayServices = services.length > 0 ? services : servicesData;
  const homeServices = displayServices.slice(0, 4);

  // Use services from API for pricing (convert to pricing format)
  const homePricing = displayServices.slice(0, 8).map((service) => ({
    id: service.id,
    name: service.name,
    price:
      service.price ||
      (service.originalPrice
        ? `${parseFloat(service.originalPrice).toLocaleString("uz-UZ")} UZS`
        : "N/A"),
  }));

  const handleRegisterModal = () => {
    setRegisterModalOpen(!registerModalOpen);
  };

  const handleImageClick = (index, images) => {
    setLightboxImages(images);
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const handleCloseLightbox = () => {
    setLightboxOpen(false);
  };

  return (
    <div>
      <Analytics />
      {/* Hero Section - Full Page */}
      <section className="w-full h-screen relative overflow-hidden bg-black pb-8 sm:pb-12 md:pb-16 lg:pb-20">
        {/* Content Container */}
        <div className="relative z-10 h-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[126px] flex flex-col lg:flex-row items-center justify-center lg:justify-between pt-20 sm:pt-[104px] md:pt-[124px] lg:pt-0 gap-4 sm:gap-6 md:gap-8 lg:gap-12">
          {/* Video - First on Mobile, Right on Desktop */}
          <div
            className="flex-1 w-full lg:w-auto lg:max-w-[680px] flex items-center justify-center order-1 lg:order-2 mt-[30px] lg:mt-0 mb-4 sm:mb-6 md:mb-8 lg:mb-0"
            data-aos="fade-up">
            <div className="relative w-full h-[300px] xs:h-[400px] sm:h-[450px] md:h-[500px] lg:h-[700px] xl:h-[800px] 2xl:h-[850px]">
              {/* Outer gold border frame with padding */}
              <div className="relative w-full h-full p-2 sm:p-3 md:p-4 lg:p-5">
                <div className="relative w-full h-full border-2 sm:border-[3px] md:border-4 border-gold rounded-2xl sm:rounded-3xl lg:rounded-[35px] overflow-hidden gold-glow">
                  {/* Inner decorative border */}
                  <div className="absolute inset-[2px] sm:inset-[3px] md:inset-[4px] border border-gold border-opacity-40 rounded-2xl sm:rounded-3xl lg:rounded-[35px] pointer-events-none z-10"></div>
                  {/* Video element */}
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  >
                    <source src="/start_video.mp4" type="video/mp4" />
                  </video>
                  {/* Subtle gradient overlay for depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10 pointer-events-none"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Content - Second on Mobile, Left on Desktop */}
          <div
            className="flex-1 flex flex-col justify-center lg:justify-start lg:pt-[100px] z-10 w-full lg:w-auto order-2 lg:order-1 text-center md:text-left"
            data-aos="fade-up">
            <div className="text-xs sm:text-sm font-semibold text-gold mb-3 sm:mb-4 tracking-wider uppercase">
              ДОБРО ПОЖАЛОВАТЬ
            </div>
            <h1
              className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-2 sm:mb-3 md:mb-4 leading-tight"
              data-translate="false">
              {contactInfo.tagline}
            </h1>
            <p className="text-base xs:text-lg sm:text-xl md:text-2xl text-white mb-2 sm:mb-3 opacity-90">
              {contactInfo.description}
            </p>
            <p className="text-sm xs:text-base sm:text-lg md:text-xl text-white mb-4 sm:mb-6 md:mb-8 opacity-80">
              {contactInfo.subtitle}
            </p>
            <div className="space-y-2 sm:space-y-3 md:space-y-4 mb-6 sm:mb-8 md:mb-10 flex flex-col items-center sm:items-center md:items-start">
              <div className="flex items-center gap-2 sm:gap-3 text-white text-sm sm:text-base md:text-lg">
                <MapPinIcon
                  className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 text-white"
                  aria-hidden="true"
                />
                <span className="break-words text-white">{contactInfo.address}</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 text-white text-sm sm:text-base md:text-lg">
                <PhoneIcon
                  className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 text-white"
                  aria-hidden="true"
                />
                <a
                  href={`tel:${contactInfo.phone}`}
                  className="hover:text-gold transition-colors break-all text-white">
                  {contactInfo.phone}
                </a>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 text-white text-sm sm:text-base md:text-lg">
                <EnvelopeIcon
                  className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 text-white"
                  aria-hidden="true"
                />
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="hover:text-gold transition-colors break-all text-white">
                  {contactInfo.email}
                </a>
              </div>
            </div>
            <div className="flex justify-center sm:justify-center md:justify-start">
              <Button
                size="lg"
                variant="outlined"
                onClick={() => navigate("/booking")}
                className="px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 bg-transparent border-2 border-gold rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base md:text-lg text-white hover:bg-gold hover:text-black transition-colors"
                aria-label="Book an appointment online">
                Записаться онлайн
              </Button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce hidden lg:block">
          <div className="w-6 h-10 border-2 border-gold border-opacity-50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gold rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      <div>
        {/* Services Overview Section */}
        <section
          className="w-full bg-[#1A1A1A] py-6 sm:py-16 md:py-20 lg:py-24"
          data-aos="fade-up">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[127px]">
            {loadingServices && (
              <div className="text-center py-8">
                <p className="text-white text-lg">Загрузка услуг...</p>
              </div>
            )}
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
              {homeServices.map((service, i) => (
                <ServiceCard key={service.id} service={service} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us & Working Hours Section */}
        <section
          className="w-full bg-black py-8 sm:py-10 md:py-12 lg:py-20 relative"
          data-aos="fade-up">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[127px] grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
            <div className="text-white relative z-10" data-aos="fade-up">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
                {getTranslation(language, "home.whyChooseUs")}
              </h2>
              <p className="text-sm sm:text-base md:text-lg mb-4 sm:mb-6 opacity-90">
                {(() => {
                  const desc = getTranslation(language, "home.whyChooseUsDesc");
                  const parts = desc.split("{tagline}");
                  if (parts.length === 1) return desc;
                  return (
                    <>
                      {parts[0]}
                      <span data-translate="false">{contactInfo.tagline}</span>
                      {parts.slice(1).join("{tagline}")}
                    </>
                  );
                })()}
              </p>
              <ul className="space-y-2 sm:space-y-3 list-disc list-inside text-sm sm:text-base">
                {translatedWhyChooseUs.map((reason, i) => (
                  <li key={i}>{reason}</li>
                ))}
              </ul>
            </div>
            <div
              className="bg-[#1A1A1A] border border-gold border-opacity-30 rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 relative z-10"
              data-aos="fade-up">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6">
                {getTranslation(language, "home.workingHours")}
              </h2>
              <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6 md:mb-8">
                {contactInfo.workingHours.map((schedule, i) => {
                  // Map Russian day names to translation keys
                  const dayMap = {
                    "ВОСКРЕСЕНЬЕ": "sunday",
                    "ПОНЕДЕЛЬНИК": "monday",
                    "ВТОРНИК": "tuesday",
                    "СРЕДА": "wednesday",
                    "ЧЕТВЕРГ": "thursday",
                    "ПЯТНИЦА": "friday",
                    "СУББОТА": "saturday",
                  };
                  const dayKey = dayMap[schedule.day] || schedule.day.toLowerCase();
                  const translatedDay = getTranslation(language, `workingHours.${dayKey}`) || schedule.day;
                  return (
                    <div
                      key={i}
                      className="text-white font-medium text-sm sm:text-base">
                      {translatedDay} {schedule.hours}
                    </div>
                  );
                })}
              </div>
              <Button
                size="lg"
                variant="outlined"
                onClick={() => navigate("/booking")}
                className="w-full px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 bg-gold border-2 border-gold rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base text-black hover:bg-gold-dark transition-colors"
                aria-label="Book an appointment online">
                {getTranslation(language, "nav.booking")}
              </Button>
            </div>
          </div>
        </section>

        {/* Our Pricing Section */}
        <section
          id="narxlar"
          className="w-full bg-[#1A1A1A] py-8 sm:py-10 md:py-12 lg:py-20"
          data-aos="fade-up">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[127px]">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center mb-6 sm:mb-8 md:mb-12">
              {getTranslation(language, "home.prices")}
            </h2>
            {loadingServices ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold mx-auto mb-4"></div>
                <p className="text-white">{getTranslation(language, "home.loadingPrices")}</p>
              </div>
            ) : homePricing.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-[#CFCFCF]">{getTranslation(language, "home.pricesNotFound")}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 max-w-4xl mx-auto">
                <div className="space-y-3 sm:space-y-4 md:space-y-6">
                  {homePricing.slice(0, 4).map((item, i) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center py-2 sm:py-3 border-b border-gold border-opacity-20"
                      data-aos="fade-up"
                      data-aos-delay={i * 50}>
                      <span className="text-white font-medium text-sm sm:text-base">
                        {item.name}
                      </span>
                      <span className="text-gold font-semibold text-sm sm:text-base">
                        {item.price}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="space-y-3 sm:space-y-4 md:space-y-6">
                  {homePricing.slice(4, 8).map((item, i) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center py-2 sm:py-3 border-b border-gold border-opacity-20"
                      data-aos="fade-up"
                      data-aos-delay={i * 50}>
                      <span className="text-white font-medium text-sm sm:text-base">
                        {item.name}
                      </span>
                      <span className="text-gold font-semibold text-sm sm:text-base">
                        {item.price}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Welcome to the Upscale Barber Studio Section */}
        <section
          className="w-full bg-black py-8 sm:py-10 md:py-12 lg:py-20"
          data-aos="fade-up">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[127px] grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center">
            <div className="relative order-2 lg:order-1" data-aos="fade-up">
              <div className="w-full h-[300px] xs:h-[350px] sm:h-[400px] md:h-[450px] lg:h-[500px] rounded-2xl sm:rounded-3xl relative overflow-hidden">
                <img
                  src={imagePool[1]}
                  alt="Professional barber services at Bro House Barbershop"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {/* Decorative shapes */}
                <div className="absolute -top-8 -left-8 sm:-top-10 sm:-left-10 w-32 h-32 sm:w-40 sm:h-40 bg-gold rounded-full opacity-20"></div>
                <div className="absolute -bottom-8 -right-8 sm:-bottom-10 sm:-right-10 w-24 h-24 sm:w-32 sm:h-32 bg-gold rounded-full opacity-20"></div>
              </div>
            </div>
            <div
              className="bg-[#1A1A1A] border border-gold border-opacity-30 rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 lg:p-12 order-1 lg:order-2"
              data-aos="fade-up">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4 md:mb-6">
                Добро пожаловать в барбершоп премиум-класса
              </h2>
              <p className="text-[#CFCFCF] mb-4 sm:mb-6 md:mb-8 leading-relaxed text-sm sm:text-base">
                В нашем барбершопе вы найдете профессиональные услуги и комфортную
                атмосферу. Наши специалисты предоставляют высококачественные услуги
                с индивидуальным подходом к каждому клиенту.
              </p>
              <Button
                size="lg"
                onClick={() => navigate("/booking")}
                className="w-full sm:w-auto px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 bg-gold text-black rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base hover:bg-gold-dark transition-colors"
                aria-label="Book an appointment online">
                Записаться онлайн
              </Button>
            </div>
          </div>
        </section>

        {/* Free Consultation Section */}
        <section
          className="w-full bg-[#1A1A1A] py-8 sm:py-10 md:py-12 lg:py-20"
          data-aos="fade-up">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[127px] grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center">
            <div className="order-2 lg:order-1" data-aos="fade-up">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6 md:mb-8 leading-tight">
                Свяжитесь с нашими профессиональными барберами
                для бесплатной индивидуальной консультации
              </h2>
              <Button
                size="lg"
                variant="outlined"
                onClick={() => navigate("/booking")}
                className="w-full sm:w-auto px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 bg-transparent border-2 border-gold rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base text-white hover:bg-gold hover:text-black transition-colors"
                aria-label="Book an appointment online">
                Записаться онлайн
              </Button>
            </div>
            <div className="relative order-1 lg:order-2" data-aos="fade-up">
              <div className="w-full h-[300px] xs:h-[350px] sm:h-[400px] md:h-[450px] lg:h-[500px] rounded-2xl sm:rounded-3xl relative overflow-hidden">
                <img
                  src="/3Y4A9847.jpg"
                  alt="Expert barbers at Bro House Barbershop providing consultation"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {/* Decorative shapes */}
                <div className="absolute -top-8 -left-8 sm:-top-10 sm:-left-10 w-32 h-32 sm:w-40 sm:h-40 bg-gold rounded-full opacity-20"></div>
                <div className="absolute -bottom-8 -right-8 sm:-bottom-10 sm:-right-10 w-24 h-24 sm:w-32 sm:h-32 bg-gold rounded-full opacity-20"></div>
              </div>
            </div>
          </div>
        </section>

        {/* 360° BARBER SHOP Section */}
        <section
          className="w-full bg-black py-8 sm:py-10 md:py-12 lg:py-20"
          data-aos="fade-up">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[127px]">
            <h2
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center mb-6 sm:mb-8 md:mb-12"
              data-translate="false">
              BROHOUSE
            </h2>
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
              {(() => {
                const barberShopImages = [
                  "/3Y4A9885.jpg",
                  "/3Y4A9893.jpg",
                  "/3Y4A9898.jpg",
                  "/3Y4A9905.jpg",
                  "/3Y4A9908.jpg",
                  "/3Y4A9923.jpg",
                  "/3Y4A989Y.jpg",
                ];
                return barberShopImages.map((imgSrc, i) => (
                  <motion.div
                    key={i}
                    className="w-full h-[200px] xs:h-[220px] sm:h-[250px] md:h-[280px] lg:h-[300px] rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer"
                    data-aos="zoom-in"
                    data-aos-delay={i * 100}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => handleImageClick(i, barberShopImages)}>
                    <img
                      src={imgSrc}
                      alt={`Bro House Barbershop 360° view ${i + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </motion.div>
                ));
              })()}
            </div>
          </div>
        </section>

        {/* People Comments Section */}
        <section
          className="w-full bg-[#1A1A1A] py-8 sm:py-10 md:py-12 lg:py-20"
          data-aos="fade-up">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[127px]">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center mb-6 sm:mb-8 md:mb-12">
              Отзывы клиентов
            </h2>
            {loadingComments ? (
              <div className="text-center py-8">
                <p className="text-white text-lg">Загрузка отзывов...</p>
              </div>
            ) : comments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                {comments.map((comment, i) => (
                  <motion.div
                    key={comment.id || i}
                    className="bg-[#222222] border border-gold border-opacity-30 rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 relative"
                    data-aos="fade-up"
                    data-aos-delay={i * 200}
                    whileHover={{ y: -5 }}>
                    <svg
                      className="absolute top-4 sm:top-5 md:top-6 left-4 sm:left-5 md:left-6 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-gold"
                      viewBox="0 0 30 30"
                      fill="none"
                      aria-hidden="true">
                      <path
                        d="M6 20h8l-2-8H8c-1.1 0-2 .9-2 2v6zm12 0h8l-2-8h-4c-1.1 0-2 .9-2 2v6z"
                        fill="currentColor"
                      />
                    </svg>
                    <div className="flex items-center gap-3 sm:gap-4 mt-5 sm:mt-6 md:mt-8 mb-3 sm:mb-4">
                      <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 bg-gold rounded-full flex-shrink-0"></div>
                      <h3 className="text-lg sm:text-xl font-bold text-white">
                        {comment.name}
                      </h3>
                    </div>
                    <p className="text-[#CFCFCF] text-sm sm:text-base">
                      {comment.text}
                    </p>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-white text-lg opacity-70">
                  Пока нет отзывов
                </p>
              </div>
            )}
          </div>
        </section>
      </div>

      <Footer />

      {/* Register Modal */}
      <RegisterModal
        open={registerModalOpen}
        handleOpen={handleRegisterModal}
      />
      <ImageLightbox
        images={lightboxImages}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={handleCloseLightbox}
      />
    </div>
  );
}

export default Home;
