import React, { useState } from 'react';
import { Wallet, ArrowUpRight, Clock, CheckCircle2, XCircle, AlertCircle, CreditCard, Building2, Save, X } from 'lucide-react';

export default function WalletTab({ auth, reviewers, participations, campaigns, notify, refreshData }) {
  // ĐỊNH NGHĨA LINK API TỰ ĐỘNG CHUYỂN ĐỔI GIỮA LOCAL VÀ RENDER
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
  // 1. Lấy thông tin reviewer hiện tại
  const reviewer = reviewers.find(r => r.id === auth.entityId) || reviewers[0];
  
  // State cho form rút tiền
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // State cho Modal Cập nhật Ngân hàng
  const [showEditBankModal, setShowEditBankModal] = useState(false);
  const [bankAccount, setBankAccount] = useState(reviewer?.bankAccount || '');
  const [bankLoading, setBankLoading] = useState(false);
  const [bankError, setBankError] = useState('');

  // State danh sách lịch sử rút tiền
  const [payouts, setPayouts] = useState([
    { id: 'PAY001', amount: 2500000, bankInfo: '1903344556677 - Techcombank', status: 'Đã chuyển khoản', requestTime: '2026-10-15 10:30', note: 'Đã chuyển khoản qua STK' },
    { id: 'PAY002', amount: 1000000, bankInfo: '1903344556677 - Techcombank', status: 'Chờ duyệt', requestTime: '2026-11-10 14:20', note: '' }
  ]);

  // 2. Tính toán thu nhập chi tiết của Reviewer
  const calculateEarnings = () => {
    const revParticipations = participations.filter(p => p.reviewerId === reviewer.id && p.status === 'Đã hoàn thành');
    const hasParticipated = participations.some(p => p.reviewerId === reviewer.id);
    
    const baseMonthlyAllowance = hasParticipated ? 3000000 : 0;
    let totalCampaignEarnings = 0;
    let totalBonus = 0;

    revParticipations.forEach(p => {
      const cmp = campaigns.find(c => c.id === p.campaignId);
      if (!cmp) return;

      const baseSalary = cmp.baseSalary;
      const timeBonus = baseSalary * (p.timeBonusRatio || 0);
      const interactionBonus = p.totalInteractions > 10000 ? 200000 : 0;

      totalCampaignEarnings += baseSalary;
      totalBonus += (timeBonus + interactionBonus);
    });

    const totalIncome = baseMonthlyAllowance + totalCampaignEarnings + totalBonus;
    
    const totalWithdrawn = payouts
      .filter(pay => pay.status !== 'Từ chối')
      .reduce((sum, pay) => sum + pay.amount, 0);

    const availableBalance = totalIncome - totalWithdrawn;

    return {
      baseMonthlyAllowance,
      totalCampaignEarnings,
      totalBonus,
      totalIncome,
      totalWithdrawn,
      availableBalance
    };
  };

  const earnings = calculateEarnings();

  // 3. Xử lý gửi yêu cầu rút tiền
  const handleRequestPayout = async (e) => {
    e.preventDefault();
    setError('');
    const withdrawAmount = Number(amount);

    if (!withdrawAmount || withdrawAmount <= 0) {
      setError('Vui lòng nhập số tiền hợp lệ!');
      return;
    }

    if (withdrawAmount > earnings.availableBalance) {
      setError(`Số dư khả dụng không đủ! Bạn chỉ có thể rút tối đa ${earnings.availableBalance.toLocaleString('vi-VN')} đ.`);
      return;
    }

    if (!reviewer.bankAccount) {
      setError('Bạn chưa cập nhật thông tin tài khoản ngân hàng trong hồ sơ cá nhân!');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/payouts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewerId: reviewer.id,
          amount: withdrawAmount
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gửi yêu cầu rút tiền thất bại');

      setPayouts([
        {
          id: data.id || 'PAY' + Date.now().toString().slice(-3),
          amount: withdrawAmount,
          bankInfo: reviewer.bankAccount,
          status: 'Thành công',
          requestTime: new Date().toISOString().slice(0, 16).replace('T', ' '),
          note: 'Tự động giải ngân tức thì'
        },
        ...payouts
      ]);

      setAmount('');
      notify('Rút tiền thành công! Tiền đã được chuyển khoản tự động.');
      if (refreshData) refreshData();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 4. Xử lý cập nhật thông tin ngân hàng
  const handleUpdateBank = async (e) => {
    e.preventDefault();
    setBankError('');

    if (!bankAccount.trim()) {
      setBankError('Vui lòng nhập thông tin tài khoản ngân hàng!');
      return;
    }

    setBankLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/reviewers/${reviewer.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bankAccount: bankAccount.trim()
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Cập nhật thất bại');

      notify('Cập nhật tài khoản ngân hàng thành công!');
      setShowEditBankModal(false);
      if (refreshData) refreshData();
    } catch (err) {
      setBankError(err.message);
    } finally {
      setBankLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Tiêu đề trang & Khu vực hiển thị STK */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Wallet className="w-6 h-6 text-indigo-600" />
            Ví Tiền &amp; Quản Lý Thu Nhập
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Theo dõi số dư, chi tiết thu nhập từ các chiến dịch và tạo yêu cầu rút tiền về ngân hàng.
          </p>
        </div>

        {/* Khung hiển thị STK kèm nút Thay đổi */}
        <div className="bg-indigo-50 border border-indigo-200 px-4 py-3 rounded-2xl flex items-center gap-4">
          <div>
            <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider">NGÂN HÀNG NHẬN TIỀN</p>
            <p className="text-xs font-semibold text-slate-800 flex items-center gap-1.5 mt-0.5">
              <CreditCard className="w-3.5 h-3.5 text-indigo-500" />
              {reviewer.bankAccount || 'Chưa cập nhật STK'}
            </p>
          </div>
          <button
            onClick={() => { setBankAccount(reviewer.bankAccount || ''); setShowEditBankModal(true); }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow transition-all shrink-0"
          >
            Thay đổi
          </button>
        </div>
      </div>

      {/* Grid các thẻ thống kê số dư */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Số dư khả dụng */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
          <div className="absolute right-4 top-4 opacity-10">
            <Wallet className="w-24 h-24" />
          </div>
          <p className="text-xs font-medium text-indigo-200 uppercase tracking-wider">Số dư khả dụng rút</p>
          <p className="text-3xl font-black mt-2">
            {earnings.availableBalance.toLocaleString('vi-VN')} <span className="text-lg font-normal">đ</span>
          </p>
          <div className="mt-4 pt-4 border-t border-indigo-500/30 flex justify-between text-xs text-indigo-100">
            <span>Đã rút: {earnings.totalWithdrawn.toLocaleString('vi-VN')} đ</span>
            <span className="bg-indigo-500/50 px-2 py-0.5 rounded text-[10px] font-bold">Sẵn sàng</span>
          </div>
        </div>

        {/* Tổng thu nhập tháng */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Tổng thu nhập tích lũy</p>
          <p className="text-2xl font-bold text-slate-900 mt-2">
            {earnings.totalIncome.toLocaleString('vi-VN')} <span className="text-sm font-normal text-slate-500">đ</span>
          </p>
          <div className="mt-4 pt-4 border-t border-slate-100 space-y-1 text-[11px] text-slate-500">
            <div className="flex justify-between">
              <span>Trợ cấp cơ bản:</span>
              <span className="font-semibold text-slate-700">{earnings.baseMonthlyAllowance.toLocaleString('vi-VN')} đ</span>
            </div>
            <div className="flex justify-between">
              <span>Thù lao chiến dịch:</span>
              <span className="font-semibold text-slate-700">{earnings.totalCampaignEarnings.toLocaleString('vi-VN')} đ</span>
            </div>
            <div className="flex justify-between">
              <span>Thưởng thêm (KPI/Sớm):</span>
              <span className="font-semibold text-emerald-600">+{earnings.totalBonus.toLocaleString('vi-VN')} đ</span>
            </div>
          </div>
        </div>

        {/* Form Rút tiền nhanh */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <ArrowUpRight className="w-4 h-4 text-emerald-600" />
              Tạo Yêu Cầu Rút Tiền
            </h2>
            <p className="text-[11px] text-slate-500 mb-3">Chuyển tiền về tài khoản ngân hàng liên kết.</p>
          </div>

          <form onSubmit={handleRequestPayout} className="space-y-3">
            <div>
              <div className="relative">
                <input
                  type="number"
                  min={100000}
                  step={50000}
                  placeholder="Nhập số tiền muốn rút..."
                  value={amount}
                  onChange={e => { setAmount(e.target.value); setError(''); }}
                  className="w-full p-2.5 pl-3 pr-8 border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">đ</span>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-1.5 bg-rose-50 border border-rose-200 text-rose-700 text-[11px] p-2 rounded-lg">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || earnings.availableBalance <= 0}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold text-xs rounded-xl shadow transition-all"
            >
              {loading ? 'Đang xử lý...' : 'Xác nhận Rút tiền'}
            </button>
          </form>
        </div>
      </div>

      {/* Lịch sử yêu cầu rút tiền */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Clock className="w-5 h-5 text-indigo-600" />
          Lịch Sử Giao Dịch Rút Tiền
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-200">
              <tr>
                <th className="p-3">Mã GD</th>
                <th className="p-3">Thời gian yêu cầu</th>
                <th className="p-3">Số tiền rút</th>
                <th className="p-3">Tài khoản nhận</th>
                <th className="p-3">Trạng thái</th>
                <th className="p-3">Ghi chú</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payouts.map(pay => (
                <tr key={pay.id} className="hover:bg-slate-50">
                  <td className="p-3 font-semibold text-slate-900">{pay.id}</td>
                  <td className="p-3 text-slate-500">{pay.requestTime}</td>
                  <td className="p-3 font-bold text-indigo-600">{pay.amount.toLocaleString('vi-VN')} đ</td>
                  <td className="p-3">{pay.bankInfo}</td>
                  <td className="p-3">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                      pay.status === 'Đã chuyển khoản' || pay.status === 'Thành công' ? 'bg-emerald-100 text-emerald-800' :
                      pay.status === 'Chờ duyệt' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {pay.status === 'Thành công' && <CheckCircle2 className="w-3 h-3" />}
                      {pay.status}
                    </span>
                  </td>
                  <td className="p-3 text-slate-400 italic">{pay.note || '---'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Cập nhật Ngân hàng */}
      {showEditBankModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-5 border border-slate-200 animate-fadeIn">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-indigo-600" />
                Cập Nhật Tài Khoản Ngân Hàng
              </h3>
              <button onClick={() => setShowEditBankModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Nhập chính xác số tài khoản và tên ngân hàng để hệ thống giải ngân tự động.
            </p>

            <form onSubmit={handleUpdateBank} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Số TK - Tên Ngân Hàng - Chủ TK
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={bankAccount}
                    onChange={e => { setBankAccount(e.target.value); setBankError(''); }}
                    placeholder="VD: 1903344556677 - Techcombank"
                    className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              {bankError && (
                <div className="flex items-start gap-1.5 bg-rose-50 border border-rose-200 text-rose-700 text-[11px] p-2.5 rounded-xl">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{bankError}</span>
                </div>
              )}

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditBankModal(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={bankLoading}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  {bankLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}