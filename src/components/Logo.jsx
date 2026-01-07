import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

function Logo({ className = '', linkTo = '/', onClick, variant = 'light' }) {
  const logoContent = (
    <motion.div 
      className={`flex items-center ${className} relative group`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}>
      <img 
        src="/240827659_171220688419301_3088276471368360933_n-Photoroom.png" 
        alt="BROHOUSE Barbershop Logo" 
        className="h-8 sm:h-10 md:h-12 lg:h-14 xl:h-16 w-auto object-contain relative z-10 transition-all duration-300 group-hover:brightness-110"
      />
      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-gold/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
    </motion.div>
  )

  if (linkTo) {
    return (
      <Link 
        to={linkTo} 
        className="block"
        onClick={onClick}
        aria-label="BROHOUSE Home"
      >
        {logoContent}
      </Link>
    )
  }

  return logoContent
}

export default Logo
