import React, { useState } from 'react';
import { Building2, UserCheck, ShieldCheck, Zap, Eye, EyeOff, AlertCircle } from 'lucide-react';

// Tài khoản demo. Khi làm thật: kiểm tra ở backend, mật khẩu phải được băm (bcrypt/argon2).
export const ACCOUNTS = [
  { username: 'cosmo',    password: '123456',   role: 'BRAND',    entityId: 'BRD001', label: 'Cosmetics Vietnam Corp' },
  { username: 'techgear', password: '123456',   role: 'BRAND',    entityId: 'BRD002', label: 'TechGear Digital Ltd' },
  { username: 'tasty',    password: '123456',   role: 'BRAND',    entityId: 'BRD003', label: 'TastyBites Food & Beverage' },
  { username: 'nhi',      password: '123456',   role: 'REVIEWER', entityId: 'REV001', label: 'Nguyễn Thảo Nhi (Senior)' },
  { username: 'tuan',     password: '123456',   role: 'REVIEWER', entityId: 'REV002', label: 'Lê Minh Tuấn (Expert)' },
  { username: 'giang',    password: '123456',   role: 'REVIEWER', entityId: 'REV003', label: 'Phạm Hương Giang (bị khóa)' },
  { username: 'duc',      password: '123456',   role: 'REVIEWER', entityId: 'REV004', label: 'Hoàng Anh Đức (Junior)' },
  { username: 'admin',    password: 'admin123', role: 'ADMIN',    entityId: null,     label: 'Quản trị viên hệ thống' }
];

const ROLES = [
  { key: 'BRAND',    label: 'Nhãn hàng',      Icon: Building2,  active: 'bg-indigo-600' },
  { key: 'REVIEWER', label: 'Reviewer',       Icon: UserCheck,  active: 'bg-purple-600' },
  { key: 'ADMIN',    label: 'Quản trị viên',  Icon: ShieldCheck, active: 'bg-amber-600' }
];

export default function LoginScreen({ onLogin }) {
  const [role, setRole] = useState('BRAND');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');

  const switchRole = (key) => {
    setRole(key);
    setUsername('');
    setPassword('');
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const acc = ACCOUNTS.find(
      a => a.username === username.trim() && a.password === password && a.role === role
    );
    if (!acc) {
      setError('Sai tài khoản, mật khẩu hoặc vai trò đã chọn. Kiểm tra lại và thử lần nữa.');
      return;
    }
    onLogin({ role: acc.role, entityId: acc.entityId, username: acc.username });
  };

  const demoAccounts = ACCOUNTS.filter(a => a.role === role);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex items-center justify-center gap-3 text-white">
          <div className="bg-gradient-to-tr from-indigo-500 to-purple-500 p-2.5 rounded-xl shadow-lg">
            <Zap className="w-7 h-7 fill-current" />
          </div>
          <div>
            <p className="font-extrabold text-2xl tracking-wider">REVLINK</p>
            <p className="text-xs text-slate-400 -mt-0.5">Influencer &amp; Review Platform</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-6 space-y-5">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Đăng nhập</h1>
            <p className="text-xs text-slate-500 mt-1">Chọn vai trò rồi nhập tài khoản của bạn.</p>
          </div>

          <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1.5 rounded-xl" role="tablist">
            {ROLES.map(({ key, label, Icon, active }) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={role === key}
                onClick={() => switchRole(key)}
                className={`flex flex-col items-center gap-1 py-2 rounded-lg text-xs font-bold transition-all ${
                  role === key ? `${active} text-white shadow` : 'text-slate-600 hover:bg-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                {label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-xs font-semibold text-slate-700 mb-1">Tài khoản</label>
              <input
                id="username"
                value={username}
                onChange={e => { setUsername(e.target.value); setError(''); }}
                autoComplete="username"
                required
                className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-slate-700 mb-1">Mật khẩu</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                  autoComplete="current-password"
                  required
                  className="w-full p-3 pr-11 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  aria-label={showPass ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div role="alert" className="flex items-start gap-2 bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-xl">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button type="submit" className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-sm shadow-md transition-all">
              Đăng nhập
            </button>
          </form>

          <div className="border-t border-slate-100 pt-4">
            <p className="text-xs font-semibold text-slate-500 mb-2">Tài khoản demo (bấm để điền sẵn)</p>
            <div className="space-y-1">
              {demoAccounts.map(a => (
                <button
                  key={a.username}
                  type="button"
                  onClick={() => { setUsername(a.username); setPassword(a.password); setError(''); }}
                  className="w-full flex justify-between items-center text-left text-xs px-3 py-2 rounded-lg bg-slate-50 hover:bg-slate-100"
                >
                  <span className="text-slate-700">{a.label}</span>
                  <span className="text-slate-400">{a.username} / {a.password}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
