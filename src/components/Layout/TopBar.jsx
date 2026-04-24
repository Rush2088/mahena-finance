export default function TopBar({ activeTab, setActiveTab }) {
  const tabs = ['Dashboard', 'Transactions', 'Statements']
  return (
    <div style={{ background: '#1a3020' }} className="flex items-center justify-between px-5 py-3">
      <div>
        <div className="text-sm font-medium tracking-widest" style={{ color: '#f5edd8', letterSpacing: '0.2em' }}>
          <span style={{ color: '#c9a84c' }}>Ma'he'na</span> Estate
        </div>
        <div className="text-xs mt-0.5" style={{ color: 'rgba(245,237,216,0.4)', letterSpacing: '0.15em' }}>
          Finance Tracker
        </div>
      </div>
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
    </div>
  )
}
