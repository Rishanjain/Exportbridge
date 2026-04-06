import { useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import ExportChatbot from '../../chatbox';

export default function AppLayout({ currentPage, setCurrentPage, children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="flex h-screen bg-surface-900 overflow-hidden">
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />
      <div
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
          collapsed ? 'ml-[70px]' : 'ml-[240px]'
        }`}
      >
        <TopBar currentPage={currentPage} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="animate-fade-in">
            {children}
          </div>
        </main>
      </div>

      {/* Floating Chatbot FAB */}
      <button
        onClick={() => setChatOpen(!chatOpen)}
        title="ExportAI Assistant"
        style={{
          position: 'fixed',
          bottom: 28,
          right: 28,
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: chatOpen
            ? 'linear-gradient(135deg, #e74c3c, #c0392b)'
            : 'linear-gradient(135deg, #00d4aa, #0099cc)',
          border: 'none',
          boxShadow: chatOpen
            ? '0 4px 24px rgba(231,76,60,0.35)'
            : '0 4px 24px rgba(0,212,170,0.4)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: chatOpen ? 22 : 26,
          zIndex: 9999,
          transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
          transform: chatOpen ? 'rotate(45deg) scale(1.05)' : 'rotate(0deg) scale(1)',
        }}
      >
        {chatOpen ? '✕' : '🚢'}
      </button>

      {/* Tooltip label when closed */}
      {!chatOpen && (
        <div style={{
          position: 'fixed',
          bottom: 36,
          right: 92,
          background: '#0f2a3a',
          color: '#00d4aa',
          fontSize: 12,
          fontWeight: 600,
          padding: '6px 12px',
          borderRadius: 8,
          border: '1px solid #00d4aa30',
          whiteSpace: 'nowrap',
          zIndex: 9998,
          pointerEvents: 'none',
          opacity: 0.9,
          letterSpacing: 0.3,
        }}>
          ExportAI Assistant
        </div>
      )}

      {/* Chatbot Panel */}
      <div
        style={{
          position: 'fixed',
          bottom: 96,
          right: 28,
          width: 400,
          height: 580,
          borderRadius: 20,
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,212,170,0.15)',
          border: '1px solid rgba(0,212,170,0.2)',
          zIndex: 9998,
          transition: 'all 0.35s cubic-bezier(0.34,1.56,0.64,1)',
          transform: chatOpen ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)',
          opacity: chatOpen ? 1 : 0,
          pointerEvents: chatOpen ? 'all' : 'none',
        }}
      >
        <ExportChatbot />
      </div>
    </div>
  );
}
