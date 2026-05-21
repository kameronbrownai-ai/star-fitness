export default function CompassStar({ size = 30, color = '#FFD700', className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 50 50"
      fill="none"
      className={className}
    >
      {/* 4-pointed compass star matching the Star Mat logo */}
      <path
        d="M25 2 L29.5 20.5 L48 25 L29.5 29.5 L25 48 L20.5 29.5 L2 25 L20.5 20.5 Z"
        fill={color}
      />
      {/* Small circle at center */}
      <circle cx="25" cy="25" r="3" fill={color === '#FFD700' ? '#1a1a1a' : 'rgba(0,0,0,0.4)'} />
    </svg>
  )
}
