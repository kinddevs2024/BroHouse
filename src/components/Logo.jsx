import { Link } from 'react-router-dom'

function Logo({ className = '', linkTo = '/', onClick, variant = 'light' }) {
  // Determine colors based on variant
  const isDark = variant === 'dark'
  const textColor = isDark ? 'text-white' : 'text-black'
  const borderColor = isDark ? 'border-white' : 'border-black'

  const logoContent = (
    <div className={`flex  md:p-0 md:m-0 flex-row  items-center  gap-4  ${className}`}>
      {/* 001 with rectangular outline */}
      <div className="relative inline-block">
        <div className={`border-2 ${borderColor} px-2 `}>
          <span className={`text-[24px] sm:text-[40px] md:text-[32px] lg:text-[32px] xl:text-[36px] font-black tracking-tight m-0 p-0 ${textColor}`}>
            001
          </span>
        </div>
      </div>
      {/* BARBERSHOP text to the right on mobile, below on desktop */}
      <span className={`text-3xl sm:text5xl  font-semibold tracking-wider ${textColor} `}>
        BARBERSHOP
      </span>
    </div>
  )

  if (linkTo) {
    return (
      <Link 
        to={linkTo} 
        className="hover:opacity-80 transition-opacity"
        onClick={onClick}
        aria-label="001 Barbershop Home"
      >
        {logoContent}
      </Link>
    )
  }

  return logoContent
}

export default Logo
