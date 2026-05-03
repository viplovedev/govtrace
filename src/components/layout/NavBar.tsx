'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useStore } from '@/lib/store'
import { t } from '@/lib/i18n'

const NAV_TABS = [
  { id: 'dashboard',     href: '/',                 key: 'nav_dashboard'     },
  { id: 'tax',           href: '/tax',              key: 'nav_tax'           },
  { id: 'spending',      href: '/spending',         key: 'nav_spending'      },
  { id: 'budgetActuals', href: '/budget-actuals',   key: 'nav_budgetActuals' },
  { id: 'reps',          href: '/representatives',  key: 'nav_reps'          },
  { id: 'bills',         href: '/bills',            key: 'nav_bills'         },
  { id: 'agenda',        href: '/agenda',           key: 'nav_agenda'        },
  { id: 'forum',         href: '/forum',            key: 'nav_forum'         },
  { id: 'manifesto',     href: '/manifesto',        key: 'nav_manifesto'     },
  { id: 'trust',         href: '/trust',            key: 'nav_trust'         },
] as const

export function NavBar() {
  const pathname = usePathname()
  const { language } = useStore()

  return (
    <div
      className="nav-scroll"
      style={{
        background: '#000080',
        padding: '0 16px',
        display: 'flex',
        flexShrink: 0,
      }}
    >
      {NAV_TABS.map(({ href, key }) => {
        const isActive = pathname === href
        return (
          <Link
            key={href}
            href={href}
            style={{
              display: 'block',
              padding: '12px 16px',
              fontSize: 13,
              fontWeight: isActive ? 600 : 400,
              color: isActive ? '#ffffff' : 'rgba(255,255,255,0.6)',
              borderBottom: isActive ? '3px solid #FF9933' : '3px solid transparent',
              whiteSpace: 'nowrap',
              textDecoration: 'none',
              transition: 'all 0.15s',
              flexShrink: 0,
            }}
          >
            {t(language, key)}
          </Link>
        )
      })}
    </div>
  )
}
