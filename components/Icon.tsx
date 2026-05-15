import type { SVGProps } from 'react'

type IconName =
  | 'store'
  | 'home'
  | 'news'
  | 'map'
  | 'dashboard'
  | 'users'
  | 'mail'
  | 'edit'
  | 'images'
  | 'gem'
  | 'target'
  | 'plus'
  | 'check-circle'
  | 'x'
  | 'image'
  | 'link'
  | 'sparkles'

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName
}

export default function Icon({ name, className, ...props }: IconProps) {
  const baseProps = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.9,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className,
    'aria-hidden': true,
    ...props,
  }

  switch (name) {
    case 'store':
      return (
        <svg {...baseProps}>
          <path d="M3 9.5 4.5 5h15L21 9.5" />
          <path d="M4 10h16v8.5A1.5 1.5 0 0 1 18.5 20h-13A1.5 1.5 0 0 1 4 18.5Z" />
          <path d="M9 20v-5h6v5" />
          <path d="M3 9.5a2.5 2.5 0 0 0 5 0" />
          <path d="M8 9.5a2.5 2.5 0 0 0 5 0" />
          <path d="M13 9.5a2.5 2.5 0 0 0 5 0" />
          <path d="M18 9.5a2.5 2.5 0 0 0 3 0" />
        </svg>
      )
    case 'home':
      return (
        <svg {...baseProps}>
          <path d="m3 11 9-7 9 7" />
          <path d="M5 10.5V20h14v-9.5" />
          <path d="M9 20v-6h6v6" />
        </svg>
      )
    case 'news':
      return (
        <svg {...baseProps}>
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <path d="M8 8h8" />
          <path d="M8 12h8" />
          <path d="M8 16h5" />
          <path d="M16 16h.01" />
        </svg>
      )
    case 'map':
      return (
        <svg {...baseProps}>
          <path d="M9 18 3.5 20V6L9 4m0 14 6 2m-6-2V4m6 16 5.5-2V4L15 6m0 14V6" />
        </svg>
      )
    case 'dashboard':
      return (
        <svg {...baseProps}>
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="5" rx="1.5" />
          <rect x="14" y="11" width="7" height="10" rx="1.5" />
          <rect x="3" y="13" width="7" height="8" rx="1.5" />
        </svg>
      )
    case 'users':
      return (
        <svg {...baseProps}>
          <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
          <circle cx="9.5" cy="7" r="3" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 4.13a3 3 0 0 1 0 5.74" />
        </svg>
      )
    case 'mail':
      return (
        <svg {...baseProps}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m4 7 8 6 8-6" />
        </svg>
      )
    case 'edit':
      return (
        <svg {...baseProps}>
          <path d="M12 20h9" />
          <path d="m16.5 3.5 4 4L8 20l-5 1 1-5Z" />
        </svg>
      )
    case 'images':
      return (
        <svg {...baseProps}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <circle cx="8.5" cy="10" r="1.5" />
          <path d="m21 15-4.5-4.5L8 19" />
          <path d="m13 19-2.5-2.5" />
        </svg>
      )
    case 'gem':
      return (
        <svg {...baseProps}>
          <path d="M6 8 9 3h6l3 5-6 13Z" />
          <path d="M3 8h18" />
          <path d="m9 3 3 5 3-5" />
        </svg>
      )
    case 'target':
      return (
        <svg {...baseProps}>
          <circle cx="12" cy="12" r="8" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'plus':
      return (
        <svg {...baseProps}>
          <path d="M12 5v14" />
          <path d="M5 12h14" />
        </svg>
      )
    case 'check-circle':
      return (
        <svg {...baseProps}>
          <circle cx="12" cy="12" r="9" />
          <path d="m8.5 12 2.5 2.5 4.5-5" />
        </svg>
      )
    case 'x':
      return (
        <svg {...baseProps}>
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      )
    case 'image':
      return (
        <svg {...baseProps}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <circle cx="8.5" cy="10" r="1.5" />
          <path d="m21 16-5-5-8 8" />
        </svg>
      )
    case 'link':
      return (
        <svg {...baseProps}>
          <path d="M10 13a5 5 0 0 0 7.07 0l2.83-2.83a5 5 0 1 0-7.07-7.07L11 5" />
          <path d="M14 11a5 5 0 0 0-7.07 0L4.1 13.83a5 5 0 0 0 7.07 7.07L13 19" />
        </svg>
      )
    case 'sparkles':
      return (
        <svg {...baseProps}>
          <path d="m12 3 1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8Z" />
          <path d="M5 18h.01" />
          <path d="M19 5h.01" />
          <path d="M19 19h.01" />
        </svg>
      )
  }
}
