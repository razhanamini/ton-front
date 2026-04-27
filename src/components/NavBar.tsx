// import React from 'react'

// interface NavBarProps {
//   activeTab: string
//   onTabChange: (tab: any) => void
//   isAdmin: boolean
// }

// const NavBar: React.FC<NavBarProps> = ({ activeTab, onTabChange, isAdmin }) => {
//   const tabs = [
//     { id: 'home', label: '🏠 Home' },
//     { id: 'mybets', label: '🎲 My Bets' },
//     { id: 'profile', label: '👤 Profile' },
//     ...(isAdmin ? [{ id: 'admin', label: '⚙️ Admin' }] : []),
//   ]

//   return (
//     <div style={{
//       position: 'sticky',
//       bottom: 0,
//       background: 'rgba(17, 17, 22, 0.95)',
//       backdropFilter: 'blur(10px)',
//       borderTop: `1px solid var(--border)`,
//       display: 'flex',
//       padding: '8px 16px',
//       gap: '8px',
//     }}>
//       {tabs.map(tab => (
//         <button
//           key={tab.id}
//           onClick={() => onTabChange(tab.id)}
//           style={{
//             flex: 1,
//             padding: '10px',
//             background: activeTab === tab.id ? 'var(--gold-glow)' : 'transparent',
//             border: 'none',
//             borderRadius: 'var(--radius-pill)',
//             color: activeTab === tab.id ? 'var(--gold)' : 'var(--text-muted)',
//             fontSize: '13px',
//             fontWeight: 500,
//             fontFamily: 'var(--font-body)',
//             cursor: 'pointer',
//             transition: 'var(--transition)',
//           }}
//         >
//           {tab.label}
//         </button>
//       ))}
//     </div>
//   )
// }

// export default NavBar


// src/components/NavBar.tsx
import React from 'react'

interface NavBarProps {
  activeTab: string
  onTabChange: (tab: string) => void
  isAdmin: boolean
}

const NavBar: React.FC<NavBarProps> = ({ activeTab, onTabChange, isAdmin }) => {
  const tabs = [
    { id: 'home', label: '🏠 Home' },
    { id: 'mybets', label: '🎲 My Bets' },
    { id: 'profile', label: '👤 Profile' },
    ...(isAdmin ? [{ id: 'admin', label: '⚙️ Admin' }] : []),
  ]

  return (
    <div style={{
      background: 'rgba(17, 17, 22, 0.95)',
      backdropFilter: 'blur(10px)',
      borderTop: '1px solid var(--border)',
      display: 'flex',
      padding: '8px 16px',
      gap: '8px',
    }}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          style={{
            flex: 1,
            padding: '10px',
            background: activeTab === tab.id ? 'var(--gold-glow)' : 'transparent',
            border: 'none',
            borderRadius: 'var(--radius-pill)',
            color: activeTab === tab.id ? 'var(--gold)' : 'var(--text-muted)',
            fontSize: '13px',
            fontWeight: 500,
            fontFamily: 'var(--font-body)',
            cursor: 'pointer',
            transition: 'var(--transition)',
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

export default NavBar