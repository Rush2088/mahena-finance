export default function TopBar({ activeTab, setActiveTab, userEmail, onSignOut }) {
  const tabs = ['Dashboard', 'Transactions', 'Statements', 'Operations']

  // Short labels for mobile
  const shortLabel = { Dashboard: 'Dash', Transactions: 'Trans', Statements: 'Stmt', Operations: 'Ops' }

  return (
    <div className="no-print flex flex-col" style={{ background: '#1a3020' }}>

      {/* Top row: brand + sign out */}
      <div className="flex items-center justify-between px-3 py-2">
        <div>
          <div className="text-sm font-medium" style={{ color: '#f5edd8', letterSpacing: '0.2em' }}>
            <span style={{ color: '#c9a84c' }}>Ma'he'na</span> Estate
          </div>
          <div className="text-xs mt-0.5 hidden sm:block" style={{ color: 'rgba(245,237,216,0.4)', letterSpacing: '0.15em' }}>
            Finance &amp; Operations
          </div>
        </div>

        {userEmail && (
          <div className="flex items-center gap-1.5">
            <span className="hidden sm:inline text-xs truncate max-w-[140px]" style={{ color: 'rgba(245,237,216,0.45)' }}>
              {userEmail}
            </span>
            <button onClick={onSignOut}
              className="px-2.5 py-1 text-xs rounded cursor-pointer border whitespace-nowrap"
              style={{ borderColor: 'rgba(245,237,216,0.2)', color: 'rgba(245,237,216,0.5)' }}>
              Sign out
            </button>
          </div>
        )}
      </div>

      {/* Tab row — full width, scrollable on very small screens */}
      <div className="flex overflow-x-auto" style={{ borderTop: '1px solid rgba(245,237,216,0.1)' }}>
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className="flex-1 py-2 text-xs cursor-pointer border-0 transition-colors whitespace-nowrap"
            style={activeTab === tab
              ? { background: 'rgba(201,168,76,0.15)', color: '#c9a84c', borderBottom: '2px solid #c9a84c' }
              : { background: 'transparent', color: 'rgba(245,237,216,0.6)', borderBottom: '2px solid transparent' }
            }>
            {/* Full label on desktop, short on mobile */}
            <span className="hidden sm:inline">{tab}</span>
            <span className="sm:hidden">{shortLabel[tab]}</span>
          </button>
        ))}
      </div>

    </div>
  )
}
