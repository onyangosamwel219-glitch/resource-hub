import React, { useState } from 'react';
import { API_ENDPOINTS } from '../data/mockData';
import { ApiEndpointSpec, UserRole } from '../types';
import { 
  Terminal, 
  Send, 
  Check, 
  Copy, 
  Lock, 
  ShieldAlert, 
  Code2, 
  Play,
  Filter
} from 'lucide-react';

interface ApiExplorerProps {
  currentRole: UserRole;
}

export const ApiExplorer: React.FC<ApiExplorerProps> = ({ currentRole }) => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpointSpec>(API_ENDPOINTS[0]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [simulatedResponse, setSimulatedResponse] = useState<{
    status: number;
    body: string;
    allowed: boolean;
    duration: number;
  } | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [copiedResponse, setCopiedResponse] = useState(false);

  const categories = [
    { id: 'all', label: 'All Endpoints' },
    { id: 'auth', label: 'Auth & Session' },
    { id: 'events', label: 'Event Operations' },
    { id: 'rsvp', label: 'RSVP & Bookmarks' },
    { id: 'users', label: 'User Profile' }
  ];

  const filteredEndpoints = API_ENDPOINTS.filter(ep => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'auth') return ep.path.includes('/auth');
    if (activeCategory === 'events') return ep.path.includes('/events') && !ep.path.includes('/rsvp') && !ep.path.includes('/bookmark');
    if (activeCategory === 'rsvp') return ep.path.includes('/rsvp') || ep.path.includes('/bookmark') || ep.path.includes('/attendees');
    if (activeCategory === 'users') return ep.path.includes('/users');
    return true;
  });

  const getMethodBadgeClass = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'POST': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'PUT': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'DELETE': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const handleSimulate = (ep: ApiEndpointSpec) => {
    setIsSimulating(true);
    setSimulatedResponse(null);

    setTimeout(() => {
      // Evaluate role requirement
      const roleReq = ep.roleRequired.toLowerCase();
      let isAllowed = false;

      if (roleReq.includes('guest') || roleReq.includes('public')) {
        isAllowed = true;
      } else if (roleReq.includes('student') && (currentRole === 'student' || currentRole === 'organizer_admin')) {
        isAllowed = true;
      } else if ((roleReq.includes('organizer') || roleReq.includes('admin')) && currentRole === 'organizer_admin') {
        isAllowed = true;
      }

      if (isAllowed) {
        setSimulatedResponse({
          status: ep.statusSuccess,
          body: ep.responseSuccess,
          allowed: true,
          duration: Math.floor(Math.random() * 25) + 12
        });
      } else {
        const isUnauthenticated = currentRole === 'guest';
        setSimulatedResponse({
          status: isUnauthenticated ? 401 : 403,
          body: JSON.stringify({
            statusCode: isUnauthenticated ? 401 : 403,
            error: isUnauthenticated ? 'Unauthorized' : 'Forbidden',
            message: isUnauthenticated 
              ? 'Missing or invalid Bearer authentication token.' 
              : `Role '${currentRole}' has insufficient privileges. Required: ${ep.roleRequired}`,
            timestamp: new Date().toISOString()
          }, null, 2),
          allowed: false,
          duration: 8
        });
      }
      setIsSimulating(false);
    }, 280);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedResponse(true);
    setTimeout(() => setCopiedResponse(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">API Endpoint Architecture & Interactive Tester</h2>
          <p className="text-sm text-slate-600 mt-1">
            Restful HTTP interface contracts with RBAC authorization guards and live request simulator.
          </p>
        </div>

        {/* Filter categories */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-lg">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                activeCategory === cat.id
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Endpoints Table + Test Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Endpoints Table (Deliverable 3 REST API Table) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">
              RESTful Endpoints ({filteredEndpoints.length})
            </h3>
            <span className="text-xs text-slate-400">Click any row to test in console</span>
          </div>

          <div className="overflow-x-auto divide-y divide-slate-100">
            {filteredEndpoints.map((ep, idx) => {
              const isSelected = selectedEndpoint.path === ep.path && selectedEndpoint.method === ep.method;
              return (
                <div
                  key={idx}
                  onClick={() => {
                    setSelectedEndpoint(ep);
                    setSimulatedResponse(null);
                  }}
                  className={`p-4 cursor-pointer transition-colors ${
                    isSelected ? 'bg-blue-50/70 border-l-4 border-blue-600' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2 font-mono text-xs">
                      <span className={`px-2 py-0.5 rounded font-bold border ${getMethodBadgeClass(ep.method)}`}>
                        {ep.method}
                      </span>
                      <span className="font-semibold text-slate-900">{ep.path}</span>
                    </div>

                    <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {ep.roleRequired}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 font-medium">{ep.summary}</p>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{ep.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live API Tester / Simulator Console */}
        <div className="lg:col-span-5 bg-slate-900 rounded-xl border border-slate-800 p-5 text-slate-200 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-mono font-bold text-slate-200">
                  Interactive API Console
                </span>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                Active Role: <span className="text-white font-bold">{currentRole}</span>
              </span>
            </div>

            {/* Selected Route Header */}
            <div>
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className={`px-2 py-0.5 rounded font-bold border ${getMethodBadgeClass(selectedEndpoint.method)}`}>
                  {selectedEndpoint.method}
                </span>
                <span className="text-white font-semibold">{selectedEndpoint.path}</span>
              </div>
              <p className="text-xs text-slate-400 mt-2">{selectedEndpoint.description}</p>
            </div>

            {/* Request Headers Preview */}
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs font-mono text-slate-400 space-y-1">
              <div>Host: api.university.edu</div>
              <div>Accept: application/json</div>
              <div>
                Authorization: {currentRole === 'guest' ? '<none>' : `Bearer eyJhbGciOi...[role: ${currentRole}]`}
              </div>
            </div>

            {/* Request Body (if any) */}
            {selectedEndpoint.requestBody && (
              <div>
                <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                  Sample Request Payload (JSON):
                </label>
                <pre className="text-[11px] font-mono p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-blue-300 overflow-x-auto max-h-36">
                  <code>{selectedEndpoint.requestBody}</code>
                </pre>
              </div>
            )}

            {/* Execute Button */}
            <button
              onClick={() => handleSimulate(selectedEndpoint)}
              disabled={isSimulating}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-xs transition-colors disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5" />
              <span>{isSimulating ? 'Simulating Request...' : 'Simulate API Call with Active Token'}</span>
            </button>

            {/* Response Output */}
            {simulatedResponse && (
              <div className="pt-2">
                <div className="flex items-center justify-between text-xs font-mono mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">HTTP Status:</span>
                    <span className={`font-bold px-2 py-0.5 rounded ${
                      simulatedResponse.status < 300 
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' 
                        : 'bg-rose-950 text-rose-400 border border-rose-800'
                    }`}>
                      {simulatedResponse.status}
                    </span>
                    <span className="text-slate-500 font-mono text-[11px]">({simulatedResponse.duration}ms)</span>
                  </div>

                  <button
                    onClick={() => handleCopy(simulatedResponse.body)}
                    className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
                  >
                    {copiedResponse ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedResponse ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <pre className="text-[11px] font-mono p-3 bg-slate-950 rounded-lg border border-slate-800 text-slate-300 overflow-x-auto max-h-48 leading-relaxed">
                  <code>{simulatedResponse.body}</code>
                </pre>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-500 font-mono flex items-center justify-between">
            <span>Auth Spec: RFC 6749 / RFC 7519</span>
            <span>CORS: Restrictive Origin</span>
          </div>
        </div>
      </div>
    </div>
  );
};
