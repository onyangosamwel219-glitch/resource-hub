import React from 'react';
import { UserRole, UserProfile } from '../types';
import { 
  FileText, 
  Layers, 
  Database, 
  Terminal, 
  CheckSquare, 
  User, 
  LogOut, 
  ShieldCheck, 
  GraduationCap,
  Download
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'spec' | 'live' | 'erd' | 'api' | 'sprint';
  setActiveTab: (tab: 'spec' | 'live' | 'erd' | 'api' | 'sprint') => void;
  currentUser: UserProfile | null;
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onOpenProfile: () => void;
  onExportSpec: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  currentRole,
  onRoleChange,
  onOpenAuth,
  onOpenProfile,
  onExportSpec
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      {/* Top Banner: Role Simulator Banner */}
      <div className="bg-slate-900 text-slate-200 px-4 py-1.5 text-xs border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Architecture Sandbox · Active Session Role:</span>
            <div className="inline-flex rounded bg-slate-800 p-0.5 border border-slate-700">
              <button
                type="button"
                onClick={() => onRoleChange('guest')}
                className={`px-2.5 py-0.5 rounded text-xs font-medium transition-colors ${
                  currentRole === 'guest'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Guest (Unauthenticated)
              </button>
              <button
                type="button"
                onClick={() => onRoleChange('student')}
                className={`px-2.5 py-0.5 rounded text-xs font-medium transition-colors ${
                  currentRole === 'student'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Student (Jane Doe)
              </button>
              <button
                type="button"
                onClick={() => onRoleChange('organizer_admin')}
                className={`px-2.5 py-0.5 rounded text-xs font-medium transition-colors ${
                  currentRole === 'organizer_admin'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Organizer / Admin (Dr. Thorne)
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onExportSpec}
              className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white px-2 py-0.5 rounded bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-colors"
              title="Download Full Technical Spec Markdown"
            >
              <Download className="w-3.5 h-3.5 text-blue-400" />
              <span>Export Tech Spec (.md)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Top Bar Contract: 3 Zones */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <a 
              href="#home" 
              onClick={(e) => { e.preventDefault(); setActiveTab('live'); }}
              className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 hover:text-blue-600 transition-colors"
            >
              Student Resource Hub
            </a>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <button
            onClick={() => setActiveTab('spec')}
            className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'spec'
                ? 'bg-blue-50 text-blue-700'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Process & Data Flows</span>
          </button>

          <button
            onClick={() => setActiveTab('erd')}
            className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'erd'
                ? 'bg-blue-50 text-blue-700'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Database ERD</span>
          </button>

          <button
            onClick={() => setActiveTab('api')}
            className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'api'
                ? 'bg-blue-50 text-blue-700'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>REST API Spec</span>
          </button>

          <button
            onClick={() => setActiveTab('sprint')}
            className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'sprint'
                ? 'bg-blue-50 text-blue-700'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>Sprint Tasks</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action / User Profile */}
        <div className="flex items-center gap-3 shrink-0">
          {currentUser ? (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenProfile}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-left"
              >
                <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                  {currentUser.fullName.charAt(0)}
                </div>
                <div className="hidden sm:block text-xs">
                  <p className="font-semibold text-slate-800 leading-tight">{currentUser.fullName}</p>
                  <p className="text-slate-500 capitalize">{currentUser.role.replace('_', ' ')}</p>
                </div>
              </button>
              <button
                onClick={() => onRoleChange('guest')}
                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                title="Log Out (Switch to Guest)"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuth('login')}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors"
              >
                Log In
              </button>
              <button
                onClick={() => onOpenAuth('signup')}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors whitespace-nowrap"
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
