import React, { useState } from 'react';
import { UserRole, UserProfile } from '../types';
import { X, KeyRound, Mail, User, Lock, GraduationCap, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode: 'login' | 'signup';
  onLoginSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode,
  onLoginSuccess
}) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (mode === 'forgot') {
      if (!email.includes('@')) {
        setErrorMessage('Please enter a valid university email address.');
        return;
      }
      setSuccessMessage(`Password reset link dispatched to ${email}. Check your campus inbox.`);
      return;
    }

    if (mode === 'signup') {
      if (!fullName.trim()) {
        setErrorMessage('Please enter your full name.');
        return;
      }
      if (!email.includes('@')) {
        setErrorMessage('Please provide a valid email.');
        return;
      }
      if (password.length < 8) {
        setErrorMessage('Password must be at least 8 characters with 1 number and 1 symbol.');
        return;
      }

      const newUser: UserProfile = {
        id: `usr_${Date.now()}`,
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        studentId: studentId.trim() || undefined,
        department: selectedRole === 'student' ? 'Undergraduate Studies' : 'Faculty Affairs',
        role: selectedRole,
        createdAt: new Date().toISOString()
      };

      onLoginSuccess(newUser);
      onClose();
      return;
    }

    // Login mode
    if (!email || !password) {
      setErrorMessage('Please provide both email and password.');
      return;
    }

    // Demo authentication check
    let userRole: UserRole = 'student';
    let userFullName = 'Jane Doe';
    let userStudentId = 'STU-984210';
    let userDept = 'Computer Science & Engineering';

    if (email.includes('thorne') || email.includes('admin') || email.includes('organizer')) {
      userRole = 'organizer_admin';
      userFullName = 'Dr. Aris Thorne';
      userStudentId = 'FAC-10023';
      userDept = 'Dean of Student Affairs & Activities';
    }

    const authenticatedUser: UserProfile = {
      id: userRole === 'organizer_admin' ? 'usr_admin_01' : 'usr_student_01',
      fullName: userFullName,
      email: email.trim().toLowerCase(),
      studentId: userStudentId,
      department: userDept,
      role: userRole,
      createdAt: '2026-09-01T08:00:00Z'
    };

    onLoginSuccess(authenticatedUser);
    onClose();
  };

  const fillQuickDemo = (type: 'student' | 'admin') => {
    if (type === 'student') {
      setEmail('jane.doe@university.edu');
      setPassword('Password123!');
      setSelectedRole('student');
    } else {
      setEmail('aris.thorne@university.edu');
      setPassword('AdminPassword123!');
      setSelectedRole('organizer_admin');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {mode === 'login' && 'Student & Staff Login'}
                {mode === 'signup' && 'Create Hub Account'}
                {mode === 'forgot' && 'Reset Password'}
              </h2>
              <p className="text-xs text-slate-500">Secure University Authentication (JWT/Cookie)</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Quick Demo Pre-fill helper */}
          {mode === 'login' && (
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-2">
              <span className="font-semibold text-slate-700 block">Quick Demo Credentials:</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => fillQuickDemo('student')}
                  className="px-2.5 py-1 rounded bg-white border border-slate-200 hover:bg-slate-100 text-[11px] font-medium text-slate-700"
                >
                  Student (Jane Doe)
                </button>
                <button
                  type="button"
                  onClick={() => fillQuickDemo('admin')}
                  className="px-2.5 py-1 rounded bg-white border border-slate-200 hover:bg-slate-100 text-[11px] font-medium text-purple-700"
                >
                  Organizer (Dr. Thorne)
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            {mode === 'signup' && (
              <>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jane Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Student / Faculty ID (Optional)</label>
                  <div className="relative">
                    <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="e.g. STU-984210"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Account Role</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedRole('student')}
                      className={`p-2 rounded-lg border text-left font-medium transition-colors ${
                        selectedRole === 'student'
                          ? 'border-blue-600 bg-blue-50/70 text-blue-900'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="font-bold">Student</div>
                      <div className="text-[10px] text-slate-500">RSVP & Bookmarks</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedRole('organizer_admin')}
                      className={`p-2 rounded-lg border text-left font-medium transition-colors ${
                        selectedRole === 'organizer_admin'
                          ? 'border-purple-600 bg-purple-50/70 text-purple-900'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="font-bold">Organizer / Admin</div>
                      <div className="text-[10px] text-slate-500">Publish Events & Rosters</div>
                    </button>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block font-semibold text-slate-700 mb-1">University Email Address *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  placeholder="student@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-700">Password *</label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-[11px] text-blue-600 hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors mt-2"
            >
              {mode === 'login' && 'Sign In to Campus Hub'}
              {mode === 'signup' && 'Register New Student Account'}
              {mode === 'forgot' && 'Send Reset Link'}
            </button>
          </form>

          {/* Toggle Modes */}
          <div className="text-center pt-3 border-t border-slate-100 text-xs text-slate-600">
            {mode === 'login' ? (
              <p>
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="font-bold text-blue-600 hover:underline"
                >
                  Register here
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="font-bold text-blue-600 hover:underline"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
