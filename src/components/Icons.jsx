export function Logo({ size = 34 }) {
  return (
    <span className="logo-mark" style={{ width: size, height: size }}>
      <svg viewBox="0 0 24 24" width={size * 0.58} height={size * 0.58} aria-hidden="true">
        <path
          d="M15.7 7.6c-1-.8-2.2-1.2-3.7-1.2-2 0-3.5.9-3.5 2.3 0 1.2.9 1.8 2.9 2.3l1.5.4c2.8.7 4.3 1.8 4.3 4.1 0 2.9-2.5 4.7-5.9 4.7-2 0-3.8-.6-5.1-1.6l1.6-2.5c1 .8 2.2 1.2 3.6 1.2 2 0 3.2-.8 3.2-2 0-1.1-.8-1.7-2.7-2.2l-1.6-.4c-2.7-.7-4.2-1.9-4.2-4.1 0-2.8 2.4-4.7 5.9-4.7 1.8 0 3.4.5 4.6 1.4l-1.5 2.3Z"
          fill="currentColor"
        />
        <path d="M12.7 3.1h2.2l-3.5 17.8H9.2l3.5-17.8Z" fill="currentColor" />
      </svg>
    </span>
  )
}

export const ArrowRight = ({ size = 16 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const Check = ({ size = 16 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden="true">
    <path d="M5 12.5 10 17.5 19 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const Zap = ({ size = 18 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden="true">
    <path d="M13 2 4.5 13.2H11l-1 8.8 8.5-11.2H12L13 2Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
  </svg>
)

export const Globe = ({ size = 18 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
    <path d="M3.5 9.5h17M3.5 14.5h17M12 3c2.5 2.6 3.8 5.6 3.8 9S14.5 18.4 12 21c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z" stroke="currentColor" strokeWidth="1.5" />
  </svg>
)

export const Code = ({ size = 18 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden="true">
    <path d="m8.5 8-4 4 4 4M15.5 8l4 4-4 4M13.5 5l-3 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const Lock = ({ size = 18 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden="true">
    <rect x="4.5" y="10" width="15" height="10.5" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
    <path d="M8 10V7.5a4 4 0 1 1 8 0V10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
)

export const Refresh = ({ size = 18 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden="true">
    <path d="M20 11a8 8 0 1 0-.7 4.5M20 5v6h-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const Search = ({ size = 18 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden="true">
    <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
    <path d="m16 16 4.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)

export const Menu = ({ size = 22 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden="true">
    <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)

export const X = ({ size = 18 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden="true">
    <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
  </svg>
)

export const Star = ({ size = 14 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
    <path d="m12 2.6 2.8 5.9 6.4.9-4.7 4.6 1.1 6.4-5.6-3-5.6 3 1.1-6.4L2.8 9.4l6.4-.9L12 2.6Z" />
  </svg>
)

export const Sparkle = ({ size = 18 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden="true">
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)

export const Download = ({ size = 18 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden="true">
    <path d="M12 3v12M7 10l5 5 5-5M4 20h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const Cart = ({ size = 18 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden="true">
    <path d="M3 4h2.2l2 11.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 2-1.6L20.5 8H6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="10" cy="20" r="1.4" fill="currentColor" />
    <circle cx="17" cy="20" r="1.4" fill="currentColor" />
  </svg>
)

export const Users = ({ size = 18 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden="true">
    <circle cx="9" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.7" />
    <path d="M3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5M16 5.2a3.2 3.2 0 0 1 0 5.9M17.5 14.8c2.1.6 3.5 2.4 3.5 5.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
)

export const Card = ({ size = 18 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden="true">
    <rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
    <path d="M3 9.5h18M6.5 15h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
)

export const Terminal = ({ size = 18 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden="true">
    <rect x="3" y="4" width="18" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
    <path d="m7 9 3 3-3 3M12.5 15H17" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const Webhook = ({ size = 18 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden="true">
    <circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="1.7" />
    <circle cx="18" cy="6" r="3" stroke="currentColor" strokeWidth="1.7" />
    <circle cx="18" cy="18" r="3" stroke="currentColor" strokeWidth="1.7" />
    <path d="m8.6 10.5 6.8-3M8.6 13.5l6.8 3" stroke="currentColor" strokeWidth="1.7" />
  </svg>
)

export const Tag = ({ size = 18 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden="true">
    <path d="M3.5 11.2V4.8c0-.7.6-1.3 1.3-1.3h6.4c.3 0 .7.1.9.4l8 8c.5.5.5 1.4 0 1.9l-5.6 5.6c-.5.5-1.4.5-1.9 0l-8-8a1.3 1.3 0 0 1-.4-.9Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    <circle cx="8" cy="8" r="1.4" fill="currentColor" />
  </svg>
)

export const Plus = ({ size = 18 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden="true">
    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

export const Copy = ({ size = 18 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden="true">
    <rect x="8.5" y="8.5" width="11" height="11" rx="2.2" stroke="currentColor" strokeWidth="1.7" />
    <path d="M15.5 8.5V6.3A1.8 1.8 0 0 0 13.7 4.5H6.3A1.8 1.8 0 0 0 4.5 6.3v7.4a1.8 1.8 0 0 0 1.8 1.8h2.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
)

export const Trash = ({ size = 18 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden="true">
    <path d="M4.5 7h15M9 7V4.8c0-.7.5-1.3 1.2-1.3h3.6c.7 0 1.2.6 1.2 1.3V7M6.5 7l.8 12.2c0 .7.6 1.3 1.3 1.3h6.8c.7 0 1.3-.6 1.3-1.3L17.5 7M10 11v6M14 11v6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
