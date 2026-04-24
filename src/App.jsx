import { useState } from 'react'
import TopBar from './components/Layout/TopBar'
import Dashboard from './components/Dashboard/Dashboard'
import Transactions from './components/Transactions/Transactions'
import Statements from './components/Statements/Statements'
import { useTransactions } from './hooks/useTransactions'
import './index.css'

export default function App() {
  const [activeTab, setActiveTab] = useState('Dashboard')
  const txnData = useTransactions()

  return (
    <div className="min-h-screen py-4 px-2" style={{ background: '#f3f4f4' }}>
      <div className="max-w-6xl mx-auto shadow-lg overflow-hidden" style={{ borderRadius: '10px', border: '1px solid #e2e2e2' }}>
        <TopBar activeTab={activeTab} setActiveTab={setActiveTab} />
        {activeTab === 'Dashboard'    && <Dashboard    {...txnData} />}
        {activeTab === 'Transactions' && <Transactions {...txnData} />}
        {activeTab === 'Statements'   && <Statements   {...txnData} />}
      </div>
    </div>
  )
}
