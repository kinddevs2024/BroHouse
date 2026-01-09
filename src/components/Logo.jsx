import { Link } from 'react-router-dom'

function Logo({ className = '', linkTo = '/', onClick, variant = 'light' }) {
  const logoContent = (
    <div className={`flex items-center ${className}`}>
      <img 
        src="/240827659_171220688419301_3088276471368360933_n-Photoroom.png" 
        alt="BROHOUSE Barbershop Logo" 
        className="h-8 sm:h-10 md:h-12 lg:h-14 xl:h-16 w-auto object-contain"
      />
    </div>
  )

  if (linkTo) {
    return (
      <Link 
        to={linkTo} 
        className="hover:opacity-80 transition-opacity"
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
