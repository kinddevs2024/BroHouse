import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Button } from "@material-tailwind/react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { getTranslation } from "../data/translations";
import { contactInfo } from "../data/contact";
import Logo from "./Logo";

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout, isAdmin, isSuperAdmin } = useAuth();
  const { language } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const controlHeader = () => {
      const currentScrollY = window.scrollY;

      // Update scrolled state for background effect
      setScrolled(currentScrollY > 50);

      // Always show header at the top of the page
      if (currentScrollY < 10) {
        setIsVisible(true);
      }
      // Hide header when scrolling down, show when scrolling up
      else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", controlHeader, { passive: true });

    return () => {
      window.removeEventListener("scroll", controlHeader);
    };
  }, [lastScrollY]);

  return (
    <motion.header
      initial={{ y: 0 }}
      animate={{
        y: isVisible ? 0 : -100,
      }}
      transition={{
        duration: 0.3,
        ease: "easeInOut",
      }}
      className={`fixed top-0 left-0 right-0 z-50 h-16 sm:h-20 md:h-[92px] transition-all duration-300 ${
        scrolled
          ? "bg-black/95 backdrop-blur-md shadow-lg border-b border-gold/30"
          : "bg-black/80 backdrop-blur-sm border-b border-gold/20"
      }`}>
      {/* Animated gradient line at top */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent opacity-50"></div>
      
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[93px] h-full flex justify-between items-center relative">
        <Logo
          onClick={closeMobileMenu}
          linkTo={isAdmin() || isSuperAdmin() ? "/admin" : "/"}
        />

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-4 lg:gap-6 items-center">
          {!isAdmin() && !isSuperAdmin() && (
            <>
              <Link
                to="/"
                className="relative group"
                aria-label="Navigate to Home">
                <span className={`text-sm lg:text-base font-medium transition-all duration-300 relative z-10 ${
                  isActive("/")
                    ? "text-gold"
                    : "text-white group-hover:text-gold"
                }`}>
                  {getTranslation(language, "nav.home")}
                </span>
                {isActive("/") && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gold rounded-full"
                    initial={false}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full"></span>
              </Link>
              <Link
                to="/team"
                className="relative group"
                aria-label="Navigate to Our Team">
                <span className={`text-sm lg:text-base font-medium transition-all duration-300 relative z-10 ${
                  isActive("/team")
                    ? "text-gold"
                    : "text-white group-hover:text-gold"
                }`}>
                  {getTranslation(language, "nav.team")}
                </span>
                {isActive("/team") && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gold rounded-full"
                    initial={false}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full"></span>
              </Link>
              <Link
                to="/gallery"
                className="relative group"
                aria-label="Navigate to Gallery">
                <span className={`text-sm lg:text-base font-medium transition-all duration-300 relative z-10 ${
                  isActive("/gallery")
                    ? "text-gold"
                    : "text-white group-hover:text-gold"
                }`}>
                  {getTranslation(language, "nav.gallery")}
                </span>
                {isActive("/gallery") && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gold rounded-full"
                    initial={false}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full"></span>
              </Link>
              <Link
                to="/delivery"
                className="relative group"
                aria-label="Navigate to Delivery">
                <span className={`text-sm lg:text-base font-medium transition-all duration-300 relative z-10 ${
                  isActive("/delivery")
                    ? "text-gold"
                    : "text-white group-hover:text-gold"
                }`}>
                  {getTranslation(language, "nav.contact")}
                </span>
                {isActive("/delivery") && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gold rounded-full"
                    initial={false}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full"></span>
              </Link>
            </>
          )}
          {!isAdmin() && !isSuperAdmin() && (
            <Link
              to="/booking"
              className="relative group"
              aria-label="Book an appointment">
              <span className={`text-sm lg:text-base font-medium transition-all duration-300 relative z-10 px-4 py-2 rounded-lg ${
                isActive("/booking")
                  ? "text-black bg-gold"
                  : "text-white group-hover:text-gold group-hover:bg-gold/10"
              }`}>
                {getTranslation(language, "nav.booking")}
              </span>
              {!isActive("/booking") && (
                <span className="absolute inset-0 rounded-lg bg-gold/0 group-hover:bg-gold/10 transition-all duration-300 -z-10"></span>
              )}
            </Link>
          )}
          {isAuthenticated() && (
            <>
              {isAdmin() && !isSuperAdmin() && (
                <>
                  <Link
                    to="/admin"
                    className={`text-sm mt-1 lg:text-base font-medium transition-colors ${
                      isActive("/admin")
                        ? "text-gold"
                        : "text-white hover:text-gold"
                    }`}>
                    {getTranslation(language, "nav.admin")}
                  </Link>
                  <Link
                    to="/users"
                    className={`text-sm mt-1 lg:text-base font-medium transition-colors ${
                      isActive("/users")
                        ? "text-gold"
                        : "text-white hover:text-gold"
                    }`}>
                    {getTranslation(language, "nav.users")}
                  </Link>
                  <Link
                    to="/services"
                    className={`text-sm mt-1 lg:text-base font-medium transition-colors ${
                      isActive("/services")
                        ? "text-gold"
                        : "text-white hover:text-gold"
                    }`}>
                    {getTranslation(language, "nav.services")}
                  </Link>
                  <Link
                    to="/analytics"
                    className={`text-sm mt-1 lg:text-base font-medium transition-colors ${
                      isActive("/analytics")
                        ? "text-gold"
                        : "text-white hover:text-gold"
                    }`}>
                    {getTranslation(language, "nav.statistics")}
                  </Link>
                  <Link
                    to="/broadcast"
                    className={`text-sm mt-1 lg:text-base font-medium transition-colors ${
                      isActive("/broadcast")
                        ? "text-gold"
                        : "text-white hover:text-gold"
                    }`}>
                    {getTranslation(language, "nav.broadcast")}
                  </Link>
                </>
              )}
              {isSuperAdmin() && (
                <>
                  <Link
                    to="/admin"
                    className={`text-sm mt-1 lg:text-base font-medium transition-colors ${
                      isActive("/admin")
                        ? "text-gold"
                        : "text-white hover:text-gold"
                    }`}>
                    {getTranslation(language, "nav.admin")}
                  </Link>
                  <Link
                    to="/users"
                    className={`text-sm mt-1 lg:text-base font-medium transition-colors ${
                      isActive("/users")
                        ? "text-gold"
                        : "text-white hover:text-gold"
                    }`}>
                    {getTranslation(language, "nav.users")}
                  </Link>
                  <Link
                    to="/services"
                    className={`text-sm mt-1 lg:text-base font-medium transition-colors ${
                      isActive("/services")
                        ? "text-gold"
                        : "text-white hover:text-gold"
                    }`}>
                    {getTranslation(language, "nav.services")}
                  </Link>
                  <Link
                    to="/analytics"
                    className={`text-sm mt-1 lg:text-base font-medium transition-colors ${
                      isActive("/analytics")
                        ? "text-gold"
                        : "text-white hover:text-gold"
                    }`}>
                    {getTranslation(language, "nav.statistics")}
                  </Link>
                  <Link
                    to="/broadcast"
                    className={`text-sm mt-1 lg:text-base font-medium transition-colors ${
                      isActive("/broadcast")
                        ? "text-gold"
                        : "text-white hover:text-gold"
                    }`}>
                    {getTranslation(language, "nav.broadcast")}
                  </Link>
                </>
              )}
              <Button
                size="sm"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className=" bg-gold hover:bg-gold-dark text-black">
                {getTranslation(language, "nav.logout")}
              </Button>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <motion.button
          className="md:hidden p-2 text-white hover:text-gold transition-colors relative z-50"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle mobile menu"
          whileTap={{ scale: 0.95 }}>
          <motion.div
            animate={mobileMenuOpen ? { rotate: 180 } : { rotate: 0 }}
            transition={{ duration: 0.3 }}>
            {mobileMenuOpen ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </motion.div>
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-black/95 backdrop-blur-md border-t border-gold/30 shadow-2xl relative z-50">
              {/* Gradient line */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gold/50 to-transparent"></div>
              <nav className="flex flex-col px-4 py-6 space-y-2">
              {!isAdmin() && !isSuperAdmin() && (
                <>
                  <motion.button
                    onClick={() => {
                      closeMobileMenu();
                      navigate("/");
                    }}
                    whileTap={{ scale: 0.98 }}
                    className={`text-base font-medium py-3 px-4 text-left transition-all duration-300 rounded-lg relative ${
                      isActive("/")
                        ? "text-black bg-gold"
                        : "text-white hover:text-gold hover:bg-gold/10"
                    }`}>
                    {getTranslation(language, "nav.home")}
                    {isActive("/") && (
                      <motion.div
                        layoutId="mobileActiveTab"
                        className="absolute inset-0 bg-gold rounded-lg -z-10"
                        initial={false}
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </motion.button>
                  <motion.button
                    onClick={() => {
                      closeMobileMenu();
                      navigate("/team");
                    }}
                    whileTap={{ scale: 0.98 }}
                    className={`text-base font-medium py-3 px-4 text-left transition-all duration-300 rounded-lg relative ${
                      isActive("/team")
                        ? "text-black bg-gold"
                        : "text-white hover:text-gold hover:bg-gold/10"
                    }`}>
                    {getTranslation(language, "nav.team")}
                    {isActive("/team") && (
                      <motion.div
                        layoutId="mobileActiveTab"
                        className="absolute inset-0 bg-gold rounded-lg -z-10"
                        initial={false}
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </motion.button>
                  <motion.button
                    onClick={() => {
                      closeMobileMenu();
                      navigate("/gallery");
                    }}
                    whileTap={{ scale: 0.98 }}
                    className={`text-base font-medium py-3 px-4 text-left transition-all duration-300 rounded-lg relative ${
                      isActive("/gallery")
                        ? "text-black bg-gold"
                        : "text-white hover:text-gold hover:bg-gold/10"
                    }`}>
                    {getTranslation(language, "nav.gallery")}
                    {isActive("/gallery") && (
                      <motion.div
                        layoutId="mobileActiveTab"
                        className="absolute inset-0 bg-gold rounded-lg -z-10"
                        initial={false}
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </motion.button>
                  <motion.button
                    onClick={() => {
                      closeMobileMenu();
                      navigate("/delivery");
                    }}
                    whileTap={{ scale: 0.98 }}
                    className={`text-base font-medium py-3 px-4 text-left transition-all duration-300 rounded-lg relative ${
                      isActive("/delivery")
                        ? "text-black bg-gold"
                        : "text-white hover:text-gold hover:bg-gold/10"
                    }`}>
                    {getTranslation(language, "nav.contact")}
                    {isActive("/delivery") && (
                      <motion.div
                        layoutId="mobileActiveTab"
                        className="absolute inset-0 bg-gold rounded-lg -z-10"
                        initial={false}
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </motion.button>
                </>
              )}
              {!isAdmin() && !isSuperAdmin() && (
                <motion.button
                  onClick={() => {
                    closeMobileMenu();
                    navigate("/booking");
                  }}
                  whileTap={{ scale: 0.98 }}
                  className={`text-base font-medium py-3 px-4 text-left transition-all duration-300 rounded-lg relative ${
                    isActive("/booking")
                      ? "text-black bg-gold"
                      : "text-white hover:text-gold hover:bg-gold/10"
                  }`}>
                  {getTranslation(language, "nav.booking")}
                  {isActive("/booking") && (
                    <motion.div
                      layoutId="mobileActiveTab"
                      className="absolute inset-0 bg-gold rounded-lg -z-10"
                      initial={false}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </motion.button>
              )}
              <div className="py-2">
              </div>
              {isAuthenticated() && (
                <>
                  {isAdmin() && !isSuperAdmin() && (
                    <>
                      <button
                        onClick={() => {
                          closeMobileMenu();
                          navigate("/admin");
                        }}
                        className={`text-base font-medium py-2 text-left transition-colors ${
                          isActive("/admin")
                            ? "text-gold"
                            : "text-white hover:text-gold"
                        }`}>
                        {getTranslation(language, "nav.admin")}
                      </button>
                      <button
                        onClick={() => {
                          closeMobileMenu();
                          navigate("/users");
                        }}
                        className={`text-base font-medium py-2 text-left transition-colors ${
                          isActive("/users")
                            ? "text-gold"
                            : "text-white hover:text-gold"
                        }`}>
                        {getTranslation(language, "nav.users")}
                      </button>
                      <button
                        onClick={() => {
                          closeMobileMenu();
                          navigate("/services");
                        }}
                        className={`text-base font-medium py-2 text-left transition-colors ${
                          isActive("/services")
                            ? "text-gold"
                            : "text-white hover:text-gold"
                        }`}>
                        {getTranslation(language, "nav.services")}
                      </button>
                      <button
                        onClick={() => {
                          closeMobileMenu();
                          navigate("/analytics");
                        }}
                        className={`text-base font-medium py-2 text-left transition-colors ${
                          isActive("/analytics")
                            ? "text-gold"
                            : "text-white hover:text-gold"
                        }`}>
                        {getTranslation(language, "nav.statistics")}
                      </button>
                      <button
                        onClick={() => {
                          closeMobileMenu();
                          navigate("/broadcast");
                        }}
                        className={`text-base font-medium py-2 text-left transition-colors ${
                          isActive("/broadcast")
                            ? "text-gold"
                            : "text-white hover:text-gold"
                        }`}>
                        {getTranslation(language, "nav.broadcast")}
                      </button>
                    </>
                  )}
                  {isSuperAdmin() && (
                    <>
                      <button
                        onClick={() => {
                          closeMobileMenu();
                          navigate("/admin");
                        }}
                        className={`text-base font-medium py-2 text-left transition-colors ${
                          isActive("/admin")
                            ? "text-gold"
                            : "text-white hover:text-gold"
                        }`}>
                        {getTranslation(language, "nav.admin")}
                      </button>
                      <button
                        onClick={() => {
                          closeMobileMenu();
                          navigate("/users");
                        }}
                        className={`text-base font-medium py-2 text-left transition-colors ${
                          isActive("/users")
                            ? "text-gold"
                            : "text-white hover:text-gold"
                        }`}>
                        {getTranslation(language, "nav.users")}
                      </button>
                      <button
                        onClick={() => {
                          closeMobileMenu();
                          navigate("/services");
                        }}
                        className={`text-base font-medium py-2 text-left transition-colors ${
                          isActive("/services")
                            ? "text-gold"
                            : "text-white hover:text-gold"
                        }`}>
                        {getTranslation(language, "nav.services")}
                      </button>
                      <button
                        onClick={() => {
                          closeMobileMenu();
                          navigate("/analytics");
                        }}
                        className={`text-base font-medium py-2 text-left transition-colors ${
                          isActive("/analytics")
                            ? "text-gold"
                            : "text-white hover:text-gold"
                        }`}>
                        {getTranslation(language, "nav.statistics")}
                      </button>
                      <button
                        onClick={() => {
                          closeMobileMenu();
                          navigate("/broadcast");
                        }}
                        className={`text-base font-medium py-2 text-left transition-colors ${
                          isActive("/broadcast")
                            ? "text-gold"
                            : "text-white hover:text-gold"
                        }`}>
                        {getTranslation(language, "nav.broadcast")}
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      closeMobileMenu();
                      navigate("/");
                    }}
                    className="text-base font-medium py-2 text-left text-red-600 hover:text-red-700 transition-colors">
                    {getTranslation(language, "nav.logout")}
                  </button>
                </>
              )}
            </nav>
          </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

export default Header;
