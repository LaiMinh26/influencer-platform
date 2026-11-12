import React, { useState } from 'react';
import { Building2, UserCheck, ShieldCheck, Zap, Eye, EyeOff, AlertCircle, UserPlus, LogIn } from 'lucide-react';

// Tài khoản demo (bấm để điền nhanh)
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
  { key: 'BRAND',    label: 'Nhãn hàng',      Icon: Building2,   active: 'bg-indigo-600' },
  { key: 'REVIEWER', label: 'Reviewer',       Icon: UserCheck,   active: 'bg-purple-600' },
  { key: 'ADMIN',    label: 'Quản trị viên',  Icon: ShieldCheck, active: 'bg-amber-600' }
];

export default function LoginScreen({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false); // Chuyển đổi Đăng nhập / Đăng ký
  const [role, setRole] = useState('BRAND');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // State bổ sung cho Form Đăng ký
  const [regData, setRegData] = useState({
    name: '',
    phone: '',
    email: '',
    // Brand
    taxCode: '',
    brandCode: '',
    industry: 'Mỹ phẩm',
    address: '',
    // Reviewer
    idCard: '',
    platform: 'TikTok',
    followers: 10000,
    specialty: 'Mỹ phẩm'
  });

  const switchRole = (key) => {
    setRole(key);
    setUsername('');
    setPassword('');
    setError('');
  };

  // XỬ LÝ ĐĂNG NHẬP QUA BACKEND
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8080/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password, role })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Đăng nhập thất bại');

      onLogin({ role: data.role, entityId: data.entityId || null, username: data.username });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // XỬ LÝ ĐĂNG KÝ TÀI KHOẢN MỚI QUA BACKEND
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8080/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          password,
          role,
          ...regData
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Đăng ký thất bại');

      // Đăng ký thành công -> Tự động đăng nhập vào hệ thống
      onLogin({ role, entityId: data.entityId, username: username.trim() });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const demoAccounts = ACCOUNTS.filter(a => a.role === role);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 my-6">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 text-white">
          <div className="bg-gradient-to-tr from-indigo-500 to-purple-500 p-2.5 rounded-xl shadow-lg">
            <Zap className="w-7 h-7 fill-current" />
          </div>
          <div>
            <p className="font-extrabold text-2xl tracking-wider">REVLINK</p>
            <p className="text-xs text-slate-400 -mt-0.5">Influencer &amp; Review Platform</p>
          </div>
        </div>

        {/* Card chính */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                {isRegister ? 'Đăng ký tài khoản' : 'Đăng nhập'}
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                {isRegister ? 'Tạo hồ sơ mới để tham gia hệ thống.' : 'Chọn vai trò rồi nhập tài khoản của bạn.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
                if (!isRegister && role === 'ADMIN') setRole('REVIEWER'); // Không cho đăng ký Admin
              }}
              className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-2 rounded-xl transition-all"
            >
              {isRegister ? <><LogIn className="w-3.5 h-3.5" /> Đăng nhập</> : <><UserPlus className="w-3.5 h-3.5" /> Đăng ký</>}
            </button>
          </div>

          {/* Chọn vai trò */}
          <div className={`grid ${isRegister ? 'grid-cols-2' : 'grid-cols-3'} gap-2 bg-slate-100 p-1.5 rounded-xl`} role="tablist">
            {ROLES.filter(r => !isRegister || r.key !== 'ADMIN').map(({ key, label, Icon, active }) => (
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

          {/* FORM ĐĂNG NHẬP HOẶC ĐĂNG KÝ */}
          <form onSubmit={isRegister ? handleRegister : handleLogin} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tài khoản (Username) *</label>
              <input
                value={username}
                onChange={e => { setUsername(e.target.value); setError(''); }}
                required
                placeholder="VD: minhtuan_99"
                className="w-full p-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Mật khẩu *</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                  required
                  placeholder="••••••••"
                  className="w-full p-2.5 pr-11 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* CÁC TRƯỜNG NHẬP THÊM KHI ĐĂNG KÝ */}
            {isRegister && (
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {role === 'BRAND' ? 'Tên công ty / Nhãn hàng *' : 'Họ và tên / Nghệ danh *'}
                  </label>
                  <input
                    required
                    value={regData.name}
                    onChange={e => setRegData({ ...regData, name: e.target.value })}
                    placeholder={role === 'BRAND' ? 'VD: Công ty Mỹ phẩm ABC' : 'VD: Nguyễn Văn A'}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Số điện thoại *</label>
                    <input
                      required
                      value={regData.phone}
                      onChange={e => setRegData({ ...regData, phone: e.target.value })}
                      placeholder="0901234567"
                      className="w-full p-2.5 border border-slate-200 rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={regData.email}
                      onChange={e => setRegData({ ...regData, email: e.target.value })}
                      placeholder="email@gmail.com"
                      className="w-full p-2.5 border border-slate-200 rounded-xl text-sm"
                    />
                  </div>
                </div>

                {role === 'BRAND' ? (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Mã số thuế *</label>
                        <input
                          required
                          maxLength={14}
                          value={regData.taxCode}
                          onChange={e => setRegData({ ...regData, taxCode: e.target.value })}
                          placeholder="0109998887"
                          className="w-full p-2.5 border border-slate-200 rounded-xl text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Mã thương hiệu *</label>
                        <input
                          required
                          value={regData.brandCode}
                          onChange={e => setRegData({ ...regData, brandCode: e.target.value })}
                          placeholder="VD: ABC_VN"
                          className="w-full p-2.5 border border-slate-200 rounded-xl text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Lĩnh vực kinh doanh *</label>
                      <input
                        required
                        value={regData.industry}
                        onChange={e => setRegData({ ...regData, industry: e.target.value })}
                        placeholder="VD: Mỹ phẩm, Công nghệ, Ẩm thực"
                        className="w-full p-2.5 border border-slate-200 rounded-xl text-sm"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Số CCCD (12 số) *</label>
                      <input
                        required
                        maxLength={12}
                        value={regData.idCard}
                        onChange={e => setRegData({ ...regData, idCard: e.target.value })}
                        placeholder="001200012345"
                        className="w-full p-2.5 border border-slate-200 rounded-xl text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Nền tảng chính</label>
                        <select
                          value={regData.platform}
                          onChange={e => setRegData({ ...regData, platform: e.target.value })}
                          className="w-full p-2.5 border border-slate-200 rounded-xl text-sm bg-white"
                        >
                          <option value="TikTok">TikTok</option>
                          <option value="YouTube">YouTube</option>
                          <option value="Facebook">Facebook</option>
                          <option value="Instagram">Instagram</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Followers</label>
                        <input
                          type="number"
                          min={0}
                          value={regData.followers}
                          onChange={e => setRegData({ ...regData, followers: e.target.value })}
                          className="w-full p-2.5 border border-slate-200 rounded-xl text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Chuyên môn review</label>
                      <input
                        value={regData.specialty}
                        onChange={e => setRegData({ ...regData, specialty: e.target.value })}
                        placeholder="VD: Mỹ phẩm, Thời trang, Tech"
                        className="w-full p-2.5 border border-slate-200 rounded-xl text-sm"
                      />
                    </div>
                  </>
                )}
              </div>
            )}

            {error && (
              <div role="alert" className="flex items-start gap-2 bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-xl">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-bold rounded-xl text-sm shadow-md transition-all"
            >
              {loading ? 'Đang xử lý...' : (isRegister ? 'Hoàn tất Đăng ký' : 'Đăng nhập')}
            </button>
          </form>

          {/* Danh sách tài khoản demo (chỉ hiện khi ở chế độ Đăng nhập) */}
          {!isRegister && (
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
          )}
        </div>
      </div>
    </div>
  );
}