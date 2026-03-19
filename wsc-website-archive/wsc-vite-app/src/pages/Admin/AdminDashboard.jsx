import React, { useState } from 'react';
import { useAdminAuth } from '../../contexts/AdminAuthProvider';
import AdminSection from './AdminSection';
import { CONTENT_CONFIG } from '../../lib/constants';
import './AdminDashboard.css';

const TABS = [
  { key: 'events', label: 'Events' },
  { key: 'sponsors', label: 'Sponsors' },
  { key: 'executives', label: 'Executives' },
  { key: 'gallery_photos', label: 'Gallery' },
];

function AdminDashboard() {
  const { signOut } = useAdminAuth();
  const [activeTab, setActiveTab] = useState('events');
  const config = CONTENT_CONFIG[activeTab];

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2 className="admin-sidebar-title">WSC Admin</h2>
        </div>
        <nav className="admin-nav">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`admin-nav-btn ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <a href="/" className="admin-back-link">&larr; Back to site</a>
          <button onClick={signOut} className="admin-signout-btn">
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="admin-main">
        <AdminSection key={activeTab} configKey={activeTab} config={config} />
      </main>
    </div>
  );
}

export default AdminDashboard;
