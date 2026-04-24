export default function TopBar({ activeTab, setActiveTab, userEmail, onSignOut }) {
  const tabs = ['Dashboard', 'Transactions', 'Statements']
  return (
    <div className="no-print flex items-center justify-between px-5 py-3" style={{ background: '#1a3020' }}>
      <div>
        <div className="text-sm font-medium tracking-widest" style={{ color: '#f5edd8', letterSpacing: '0.2em' }}>
          <span style={{ color: '#c9a84c' }}>Ma'he'na</span> Estate
        </div>
        <div className="text-xs mt-0.5" style={{ color: 'rgba(245,237,216,0.4)', letterSpacing: '0.15em' }}>
          Finance Tracker
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex gap-2">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-3 py-1.5 text-xs rounded cursor-pointer border transition-colors"
              style={activeTab === tab
                ? { background: 'rgba(201,168,76,0.15)', borderColor: '#c9a84c', color: '#c9a84c' }
                : { background: 'transparent', borderColor: 'rgba(245,237,216,0.2)', color: 'rgba(245,237,216,0.6)' }
              }
            >
              {tab}
            </button>
          ))}
        </div>
        {userEmail && (
          <div className="flex items-center gap-2 pl-3" style={{ borderLeft: '1px solid rgba(245,237,216,0.15)' }}>
            <span className="text-xs" style={{ color: 'rgba(245,237,216,0.45)' }}>{userEmail}</span>
            <button
              onClick={onSignOut}
              className="px-2.5 py-1 text-xs rounded cursor-pointer border"
              style={{ borderColor: 'rgba(245,237,216,0.2)', color: 'rgba(245,237,216,0.5)' }}
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
