import React, { useState, useMemo, useEffect } from 'react';
import LoginScreen from './LoginScreen';
import WalletTab from './WalletTab';
import { 
  Building2, 
  UserCheck, 
  ShieldCheck, 
  PlusCircle, 
  Search, 
  Filter, 
  Award, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  Star, 
  ExternalLink, 
  Package, 
  TrendingUp, 
  Users, 
  Briefcase, 
  Eye, 
  ThumbsUp, 
  Share2, 
  Lock, 
  Unlock, 
  X, 
  Calendar,
  Layers,
  ChevronRight,
  Zap,
  BarChart3,
  FileText,
  AlertCircle,
  LogOut
} from 'lucide-react';



// --- HELPER RANK COMPARISON ---
const RANK_LEVELS = { 'Junior': 1, 'Senior': 2, 'Expert': 3 };

export default function App() {
const [activeTab, setActiveTab] = useState('campaigns');

// ĐỊNH NGHĨA LINK API TỰ ĐỘNG CHUYỂN ĐỔI
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// State quản lý Modal thêm sản phẩm mẫu cho Brand
const [showAddSampleModal, setShowAddSampleModal] = useState(false);
const [sampleForm, setSampleForm] = useState({ name: '', price: '', stock: '', usageGuide: '' });

  // --- GLOBAL STATES ---
const [auth, setAuth] = useState(null); // { role, entityId, username }
const currentRole = auth?.role;
const selectedBrandId = auth?.role === 'BRAND' ? auth.entityId : 'BRD001';
const selectedReviewerId = auth?.role === 'REVIEWER' ? auth.entityId : 'REV001';

  // Entities Data
  const [brands, setBrands] = useState([]);
  const [reviewers, setReviewers] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [samples, setSamples] = useState([]);
  const [participations, setParticipations] = useState([]);

  const fetchFreshData = async () => {
    try {
      const res = await fetch(`${API_URL}/api/data`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Server trả về lỗi');
      setBrands(data.brands || []);
      setReviewers(data.reviewers || []);
      setCampaigns(data.campaigns || []);
      setSamples(data.samples || []);
      setParticipations(data.participations || []);
    } catch (err) {
      console.error('Lỗi đồng bộ dữ liệu:', err.message);
    }
  };

  // Tự động gọi API lấy dữ liệu từ MySQL ngay khi mở trang web
  useEffect(() => {
    if (auth) fetchFreshData();
  }, [auth]);

  // UI States & Modals
  const [toastMessage, setToastMessage] = useState(null);
  const [showCreateCampaignModal, setShowCreateCampaignModal] = useState(false);
  const [showSubmitLinkModal, setShowSubmitLinkModal] = useState(null); // par object
  const [showReviewerDetailModal, setShowReviewerDetailModal] = useState(null); // reviewer object
  const [showApproveModal, setShowApproveModal] = useState(null); // par object

  // Filters
  const [brandIndustryFilter, setBrandIndustryFilter] = useState('ALL');
  const [campaignSearchText, setCampaignSearchText] = useState('');
  const [reviewerPlatformFilter, setReviewerPlatformFilter] = useState('ALL');
  const [reviewerRankFilter, setReviewerRankFilter] = useState('ALL');
  const [reviewerSearchText, setReviewerSearchText] = useState('');

  // Toast Notifier Helper
  const notify = (msg, type = 'success') => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // --- LOGIC CALCULATIONS & ACTIONS ---

  // Current Active Entity Objects
  const activeBrand = useMemo(() => {
    return Array.isArray(brands) && brands.length > 0 
      ? (brands.find(b => b.id === selectedBrandId) || brands[0]) 
      : { id: '', name: '', industry: '', brandCode: '', taxCode: '', rating: 0 };
  }, [brands, selectedBrandId]);

  const activeReviewer = useMemo(() => {
    return Array.isArray(reviewers) && reviewers.length > 0 
      ? (reviewers.find(r => r.id === selectedReviewerId) || reviewers[0]) 
      : { id: '', name: '', rank: 'Junior', reputationScore: 0, status: '', followers: 0, platform: '', specialty: '' };
  }, [reviewers, selectedReviewerId]);

  // Tính tổng ngân sách gốc của nhãn hàng hiện tại
  const initialBudget = (campaigns || [])
    .filter(c => c.brandId === activeBrand.id)
    .reduce((sum, c) => sum + (c.budget || 0), 0);

  // Tính tổng số tiền Nhãn hàng đã thực sự chi trả (Bao gồm: Lương thực tế Reviewer + 10% phí sàn Admin + Giá trị sản phẩm mẫu cấp phát)
  const spentBudget = useMemo(() => {
    let totalSpent = 0;

    (participations || []).forEach(p => {
      if (p.status !== 'Đã hoàn thành') return;
      const cmp = (campaigns || []).find(c => c.id === p.campaignId);
      if (!cmp || cmp.brandId !== activeBrand.id) return;

      // 1. Thù lao thực tế của Reviewer (Lương cơ bản + thưởng nộp sớm + thưởng tương tác)
      const baseSalary = cmp.baseSalary || 0;
      const timeBonus = baseSalary * (p.timeBonusRatio || 0);
      const interactionBonus = p.totalInteractions > 10000 ? 200000 : 0;
      const reviewerActualPay = baseSalary + timeBonus + interactionBonus;

      // 2. Phí sàn Admin thu từ thù lao (10%)
      const adminCampaignFee = reviewerActualPay * 0.10;

      // 3. Giá trị sản phẩm mẫu cấp phát cho participation này (5% phí mẫu hoặc tính toàn bộ giá trị mẫu tùy bạn chọn, ở đây tính tổng giá trị sản phẩm mẫu cấp phát)
      let sampleValues = 0;
      // Nếu bạn có lưu danh sách sample trong participation (ví dụ p.samplesReceived hoặc qua bảng participation_samples)
      p.samplesReceived?.forEach(smpId => {
        const smp = samples.find(s => s.id === smpId);
        if (smp) sampleValues += smp.price;
      });
      const adminSampleFee = sampleValues * 0.05; // 5% phí quản lý mẫu cho Admin

      // Tổng chi phí cho 1 participation hoàn thành mà Nhãn hàng phải gánh
      totalSpent += (reviewerActualPay + adminCampaignFee + sampleValues + adminSampleFee);
    });

    return totalSpent;
  }, [participations, campaigns, samples, activeBrand.id]);

  // Ngân sách còn lại thực tế
  const remainingBudget = initialBudget - spentBudget;

  // 1. Reviewer Income Calculator logic
  const calculateReviewerEarnings = (revId) => {
    const revParticipations = (participations || []).filter(p => p.reviewerId === revId && p.status === 'Đã hoàn thành');
    const hasParticipated = (participations || []).some(p => p.reviewerId === revId);
    
    // Base allowance = 3M if participated in at least 1 campaign
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

    return {
      baseMonthlyAllowance,
      totalCampaignEarnings,
      totalBonus,
      grandTotal: baseMonthlyAllowance + totalCampaignEarnings + totalBonus
    };
  };


  // 2. Admin Revenue Calculator (Đã đồng bộ chuẩn với thực tế chi trả của Brand)
  const adminPlatformRevenue = useMemo(() => {
    const completedParticipations = (participations || []).filter(p => p.status === 'Đã hoàn thành');
    
    let totalCampaignPayouts = 0; // Tổng thực tế chi trả cho Reviewer
    let totalSampleValue = 0;

    completedParticipations.forEach(p => {
      const cmp = campaigns.find(c => c.id === p.campaignId);
      if (cmp) {
        const baseSalary = cmp.baseSalary || 0;
        const timeBonus = baseSalary * (p.timeBonusRatio || 0);
        const interactionBonus = p.totalInteractions > 10000 ? 200000 : 0;
        
        // Cộng tổng thực tế reviewer nhận để tính phí sàn chuẩn xác
        totalCampaignPayouts += (baseSalary + timeBonus + interactionBonus);
      }
      
      p.samplesReceived?.forEach(smpId => {
        const smp = samples.find(s => s.id === smpId);
        if (smp) {
          totalSampleValue += smp.price;
        }
      });
    });

    const feeFromCampaigns = totalCampaignPayouts * 0.10; // 10% trên tổng thực tế
    const feeFromSamples = totalSampleValue * 0.05;       // 5% trên giá trị mẫu

    return {
      totalCampaignFees: totalCampaignPayouts,
      totalSampleValue,
      feeFromCampaigns,
      feeFromSamples,
      totalPlatformRevenue: feeFromCampaigns + feeFromSamples
    };
  }, [participations, campaigns, samples]);

  // 3. Register Campaign Action
  const handleRegisterCampaign = async (campaignId) => {
    const cmp = campaigns.find(c => c.id === campaignId);
    if (!cmp) return;

    // Constraint 1: Reputation score check (Giữ nguyên logic kiểm tra phía frontend trước khi gọi API)
    if (activeReviewer.reputationScore < 50 || activeReviewer.status === 'Bị khóa') {
      notify('Tài khoản bị khóa hoặc điểm uy tín < 50, không thể đăng ký!', 'error');
      return;
    }

    // Constraint 2: Rank requirement
    if (RANK_LEVELS[activeReviewer.rank] < RANK_LEVELS[cmp.minRankRequired]) {
      notify(`Yêu cầu cấp bậc tối thiểu là ${cmp.minRankRequired}. Bạn là ${activeReviewer.rank}!`, 'error');
      return;
    }

    // Constraint 3: Maximum 2 registrations limit
    const previousRegCount = (participations || []).filter(
      p => p.reviewerId === activeReviewer.id && p.campaignId === campaignId
    ).length;

    if (previousRegCount >= 2) {
      notify('Bạn không thể đăng ký 1 chiến dịch quá 2 lần!', 'error');
      return;
    }

    // Check if already active in this campaign
    const currentlyActive = (participations || []).some(
      p => p.reviewerId === activeReviewer.id && p.campaignId === campaignId && p.status !== 'Bị hủy'
    );
    if (currentlyActive) {
      notify('Bạn đang trong quá trình thực hiện chiến dịch này rồi!', 'error');
      return;
    }

    try {
      // GỌI API XUỐNG NODE.JS SERVER (Cổng 8080)
      const response = await fetch(`${API_URL}/api/participations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignId: cmp.id,
          reviewerId: activeReviewer.id
        })
      });

      const data = await response.json();

      if (!response.ok) {
        // Nếu vi phạm ràng buộc Trigger trong SQL, nó sẽ trả về lỗi ở đây
        throw new Error(data.error || 'Đăng ký thất bại');
      }

      // Nếu thành công, tải lại toàn bộ dữ liệu mới nhất từ MySQL vào giao diện
      const resData = await fetch(`${API_URL}/api/data`);
      const freshData = await resData.json();
      setParticipations(freshData.participations);

      notify(`Đăng ký chiến dịch "${cmp.title}" thành công!`);
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  // 4. Submit Job Review Link
  const handleSubmitLink = async (parId, link) => {
      if (!link || !link.startsWith('http')) {
        notify('Vui lòng nhập đường dẫn URL hợp lệ!', 'error');
        return;
      }

      const targetPar = participations.find(p => p.id === parId);
      if (!targetPar) return;
      const cmp = campaigns.find(c => c.id === targetPar.campaignId);
      const now = new Date();
      const endDate = new Date(cmp.endDate);
      const diffTime = endDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      let bonusRatio = diffDays >= 3 ? 0.1 : 0; // 10% bonus nếu nộp trước 3 ngày

      // Giả lập tương tác thực tế khi nộp bài demo
      const mockViews = Math.floor(Math.random() * 15000) + 2000;
      const mockLikes = Math.floor(mockViews * 0.12);
      const mockShares = Math.floor(mockLikes * 0.15);
      const totalInteractions = mockViews + mockLikes + mockShares;

      try {
        const response = await fetch(`${API_URL}/api/participations/${parId}/submit`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            submissionLink: link,
            views: mockViews,
            likes: mockLikes,
            shares: mockShares,
            totalInteractions: totalInteractions,
            timeBonusRatio: bonusRatio
          })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Nộp bài thất bại');

        // Tải lại dữ liệu mới
        const resData = await fetch(`${API_URL}/api/data`);
        const freshData = await resData.json();
        setParticipations(freshData.participations);

        setShowSubmitLinkModal(null);
        notify('Nộp bài nghiệm thu thành công! Nhãn hàng sẽ kiểm tra và phê duyệt.');
      } catch (err) {
        notify(err.message, 'error');
      }
    };

  // 5. Brand Approve & Rate Review
  const handleApproveParticipation = async (parId, rating) => {
    try {
      const response = await fetch(`${API_URL}/api/participations/${parId}/approve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brandRating: rating })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Nộp bài thất bại');

      // Tải lại dữ liệu mới từ Database
      const resData = await fetch(`${API_URL}/api/data`);
      const freshData = await resData.json();
      setParticipations(freshData.participations);
      setReviewers(freshData.reviewers);
      
      setShowApproveModal(null);
      notify(`Đã phê duyệt bài nghiệm thu và đánh giá ${rating} sao!`);
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  // 6. Admin Unlock Reviewer
  const handleUnlockReviewer = async (reviewerId) => {
    try {
      const response = await fetch(`${API_URL}/api/reviewers/${reviewerId}/unlock`, {
        method: 'PUT'
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Gỡ khóa thất bại');

      // Tải lại dữ liệu mới từ MySQL
      const resData = await fetch(`${API_URL}/api/data`);
      const freshData = await resData.json();
      setReviewers(freshData.reviewers);

      notify('Đã mở khóa tài khoản và khôi phục điểm uy tín thành công!');
    } catch (err) {
      notify(err.message, 'error');
    }
  };


  // 7. Add New Campaign
  const handleCreateCampaign = async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      
      try {
        const response = await fetch(`${API_URL}/api/campaigns`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            brandId: activeBrand.id,
            title: formData.get('title'),
            type: formData.get('type'),
            startDate: formData.get('startDate'),
            endDate: formData.get('endDate'),
            budget: Number(formData.get('budget')),
            baseSalary: Number(formData.get('baseSalary')),
            maxReviewers: Number(formData.get('maxReviewers')),
            minRankRequired: formData.get('minRankRequired'),
            sampleIds: formData.getAll('samples')
          })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Tạo chiến dịch thất bại');

        // Tải lại dữ liệu mới từ MySQL
        const resData = await fetch(`${API_URL}/api/data`);
        const freshData = await resData.json();
        setCampaigns(freshData.campaigns);

        setShowCreateCampaignModal(false);
        notify('Tạo chiến dịch mới thành công!');
      } catch (err) {
        notify(err.message, 'error');
      }
    };
  // Hàm gọi API sản phẩm mẫu
  const handleAddSampleProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/sample-products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brandId: auth.entityId,
          name: sampleForm.name,
          price: Number(sampleForm.price),
          stock: Number(sampleForm.stock) || 10,
          usageGuide: sampleForm.usageGuide
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Thêm sản phẩm thất bại');

      notify('Thêm sản phẩm mẫu thành công!');
      setSampleForm({ name: '', price: '', stock: '', usageGuide: '' });
      setShowAddSampleModal(false);
      if (fetchFreshData) fetchFreshData();
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  if (!auth) return <LoginScreen onLogin={setAuth} />;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased flex flex-col">
      {/* --- TOAST NOTIFICATION --- */}
      {toastMessage && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-2xl text-white font-medium transition-all duration-300 animate-bounce ${
          toastMessage.type === 'error' ? 'bg-rose-600' : 'bg-emerald-600'
        }`}>
          {toastMessage.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
          <span>{toastMessage.msg}</span>
        </div>
      )}

    <header className="bg-slate-900 text-white sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-indigo-500 to-purple-500 p-2 rounded-xl shadow-lg">
            <Zap className="w-6 h-6 fill-current" />
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-wider">REVLINK</span>
            <span className="text-xs text-slate-400 block -mt-1">Influencer & Review Platform</span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
      <div className="text-right">
        <p className="font-bold text-white">
          {currentRole === 'BRAND' ? activeBrand?.name : currentRole === 'REVIEWER' ? activeReviewer?.name : 'Quản trị viên'}
        </p>
        <p className="text-slate-400">
          {currentRole === 'BRAND' ? 'Nhãn hàng' : currentRole === 'REVIEWER' ? 'Reviewer / KOC' : 'Quản trị viên'} · {auth.username}
        </p>
      </div>
      <button
        onClick={() => setAuth(null)}
        className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white px-3 py-1.5 rounded-xl font-bold"
      >
        <LogOut className="w-4 h-4" />
        Đăng xuất
      </button>
    </div>
  </div>
</header>

      {/* --- MAIN DASHBOARD BODY --- */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* ========================================================================= */}
        {/* VIEW 1: BRAND PORTAL                                                      */}
        {/* ========================================================================= */}
        {currentRole === 'BRAND' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Top Info Header */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-slate-900">{activeBrand.name}</h1>
                  <span className="bg-indigo-100 text-indigo-700 text-xs px-2.5 py-1 rounded-full font-bold">
                    {activeBrand.industry}
                  </span>
                </div>
                <p className="text-sm text-slate-500 mt-1 flex items-center gap-4 flex-wrap">
                  <span>Mã nhãn hàng: <strong>{activeBrand.brandCode}</strong></span>
                  <span>| MST: {activeBrand.taxCode}</span>
                  <span>| Đánh giá uy tín: <strong>⭐ {activeBrand.rating}/5.0</strong></span>
                </p>
              </div>

              <button
                onClick={() => setShowCreateCampaignModal(true)}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md transition-all text-sm shrink-0"
              >
                <PlusCircle className="w-5 h-5" />
                Tạo Chiến dịch mới
              </button>
            </div>

            {/* KHU VỰC QUẢN LÝ KHO SẢN PHẨM MẪU (SAMPLES) CHO BRAND */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    📦 Kho Sản Phẩm Mẫu (Samples) Của Công Ty
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Thêm và quản lý sản phẩm mẫu để đưa vào các chiến dịch gửi cho Reviewer trải nghiệm.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddSampleModal(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow transition-all flex items-center gap-1.5"
                >
                  ➕ Thêm sản phẩm mẫu
                </button>
              </div>

              {/* Danh sách sản phẩm mẫu thuộc về Brand đang đăng nhập */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {samples.filter(s => s.brandId === auth.entityId).length > 0 ? (
                  samples
                    .filter(s => s.brandId === auth.entityId)
                    .map(sample => (
                      <div key={sample.id} className="border border-slate-200 rounded-xl p-4 space-y-2 bg-slate-50/50">
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">
                            {sample.id}
                          </span>
                          <span className="text-xs font-extrabold text-emerald-600">
                            {sample.price.toLocaleString('vi-VN')} đ
                          </span>
                        </div>
                        <h3 className="font-bold text-slate-900 text-sm line-clamp-1">{sample.name}</h3>
                        <p className="text-xs text-slate-500">Tồn kho: <strong className="text-slate-800">{sample.stock}</strong> sản phẩm</p>
                        <p className="text-[11px] text-slate-400 italic line-clamp-1">HDSD: {sample.usageGuide || '---'}</p>
                      </div>
                    ))
                ) : (
                  <p className="text-xs text-slate-400 italic col-span-3 py-4">
                    Chưa có sản phẩm mẫu nào trong kho. Hãy bấm nút "Thêm sản phẩm mẫu" ở góc trên bên phải để bắt đầu!
                  </p>
                )}
              </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Tổng chiến dịch</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {campaigns.filter(c => c.brandId === activeBrand.id).length}
                  </p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Ngân sách còn lại</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {(() => {
                      const brandCampaigns = campaigns.filter(c => c.brandId === activeBrand.id);
                      const initialBudget = brandCampaigns.reduce((sum, c) => sum + (c.budget || 0), 0);
                      const spentBudget = participations
                        .filter(p => p.status === 'Đã hoàn thành')
                        .reduce((sum, p) => {
                          const cmp = brandCampaigns.find(c => c.id === p.campaignId);
                          return sum + (cmp ? (cmp.baseSalary || 0) * (1 + (p.timeBonusRatio || 0)) + (p.totalInteractions > 10000 ? 200000 : 0) : 0);
                        }, 0);
                      return (initialBudget - spentBudget).toLocaleString('vi-VN');
                    })()} đ
                  </p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Reviewer đang chạy</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {participations.filter(p => {
                      const cmp = campaigns.find(c => c.id === p.campaignId);
                      return cmp && cmp.brandId === activeBrand.id && p.status !== 'Bị hủy';
                    }).length}
                  </p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Tổng tương tác thu về</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {participations.filter(p => {
                      const cmp = campaigns.find(c => c.id === p.campaignId);
                      return cmp && cmp.brandId === activeBrand.id;
                    }).reduce((sum, p) => sum + p.totalInteractions, 0).toLocaleString('vi-VN')}
                  </p>
                </div>
              </div>
            </div>

            {/* Campaign Management List */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-indigo-600" />
                  Danh sách Chiến dịch của tôi
                </h2>
              </div>

              <div className="divide-y divide-slate-100">
                {campaigns.filter(c => c.brandId === activeBrand.id).map(cmp => {
                  const cmpParticipations = participations.filter(p => p.campaignId === cmp.id);

                  return (
                    <div key={cmp.id} className="p-6 space-y-4 hover:bg-slate-50/50 transition-colors">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-3">
                            <h3 className="font-bold text-lg text-slate-900">{cmp.title}</h3>
                            <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                              cmp.status === 'Đang mở đăng ký' ? 'bg-blue-100 text-blue-700' :
                              cmp.status === 'Đang diễn ra' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {cmp.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1 flex items-center gap-4">
                            <span>Mã: {cmp.id}</span>
                            <span>Loại: <strong>{cmp.type}</strong></span>
                            <span>Thời gian: {cmp.startDate} đến {cmp.endDate}</span>
                          </p>
                        </div>

                        <div className="flex items-center gap-6 text-sm">
                          <div>
                            <p className="text-xs text-slate-400">Thù lao cơ bản</p>
                            <p className="font-bold text-slate-800">{cmp.baseSalary.toLocaleString('vi-VN')} đ</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-400">Yêu cầu Rank</p>
                            <p className="font-bold text-purple-600">{cmp.minRankRequired}+</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-400">Số lượng</p>
                            <p className="font-bold text-slate-800">{cmpParticipations.length} / {cmp.maxReviewers}</p>
                          </div>
                        </div>
                      </div>

                      {cmpParticipations.length > 0 ? (
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-3">
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Reviewer Tham gia &amp; Nộp bài nghiệm thu
                          </p>
                          <div className="overflow-x-auto">
                            <table className="w-full text-xs text-left">
                              <thead className="text-slate-500 uppercase font-bold border-b border-slate-200">
                                <tr>
                                  <th className="pb-2">Reviewer</th>
                                  <th className="pb-2">Ngày đăng ký</th>
                                  <th className="pb-2">Trạng thái</th>
                                  <th className="pb-2">Link Bài Đăng</th>
                                  <th className="pb-2">Tương tác</th>
                                  <th className="pb-2 text-right">Thao tác / Đánh giá</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-200/60 text-slate-700">
                                {cmpParticipations.map(p => (
                                  <tr key={p.id} className="hover:bg-slate-100/50">
                                    <td className="py-2.5 font-semibold text-slate-900">{p.reviewerName}</td>
                                    <td className="py-2.5">{p.registerTime}</td>
                                    <td className="py-2.5">
                                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                                        p.status === 'Đã hoàn thành' ? 'bg-emerald-100 text-emerald-800' :
                                        p.status === 'Đã nộp bài' ? 'bg-amber-100 text-amber-800' :
                                        p.status === 'Bị hủy' ? 'bg-rose-100 text-rose-800' : 'bg-slate-200 text-slate-700'
                                      }`}>
                                        {p.status}
                                      </span>
                                    </td>
                                    <td className="py-2.5">
                                      {p.submissionLink ? (
                                        <a 
                                          href={p.submissionLink} 
                                          target="_blank" 
                                          rel="noreferrer" 
                                          className="text-indigo-600 hover:underline flex items-center gap-1 font-medium"
                                        >
                                          Xem bài viết <ExternalLink className="w-3 h-3" />
                                        </a>
                                      ) : (
                                        <span className="text-slate-400 italic">Chưa nộp</span>
                                      )}
                                    </td>
                                    <td className="py-2.5">
                                      {p.totalInteractions > 0 ? (
                                        <span className="font-bold text-slate-900">
                                          {p.totalInteractions.toLocaleString('vi-VN')}
                                        </span>
                                      ) : '-'}
                                    </td>
                                    <td className="py-2.5 text-right">
                                      {p.status === 'Đã nộp bài' && (
                                        <button
                                          onClick={() => setShowApproveModal(p)}
                                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded-lg font-bold text-[11px] shadow-sm transition-all"
                                        >
                                          Nghiệm thu &amp; Duyệt
                                        </button>
                                      )}

                                      {p.status === 'Đã hoàn thành' && (
                                        <div className="flex items-center justify-end gap-1 text-amber-500">
                                          {[...Array(p.brandRating)].map((_, i) => (
                                            <Star key={i} className="w-3.5 h-3.5 fill-current" />
                                          ))}
                                          <span className="text-xs font-bold text-slate-700 ml-1">({p.brandRating} sao)</span>
                                        </div>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 italic">Chưa có Reviewer nào đăng ký chiến dịch này.</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* MODAL THÊM SẢN PHẨM MẪU CHO BRAND (Đặt bên ngoài khối brand portal chính) */}
        {showAddSampleModal && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4 border border-slate-200 animate-fadeIn">
              <h3 className="text-base font-bold text-slate-900">Thêm Sản Phẩm Mẫu Mới</h3>

              <form onSubmit={handleAddSampleProduct} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tên sản phẩm mẫu</label>
                  <input
                    type="text"
                    placeholder="VD: Serum dưỡng ẩm sâu 30ml"
                    value={sampleForm.name}
                    onChange={e => setSampleForm({ ...sampleForm, name: e.target.value })}
                    className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Giá trị (VNĐ)</label>
                    <input
                      type="number"
                      placeholder="VD: 350000"
                      value={sampleForm.price}
                      onChange={e => setSampleForm({ ...sampleForm, price: e.target.value })}
                      className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Số lượng trong kho</label>
                    <input
                      type="number"
                      placeholder="VD: 50"
                      value={sampleForm.stock}
                      onChange={e => setSampleForm({ ...sampleForm, stock: e.target.value })}
                      className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Hướng dẫn sử dụng</label>
                  <textarea
                    placeholder="Nhập hướng dẫn sử dụng sản phẩm cho Reviewer..."
                    value={sampleForm.usageGuide}
                    onChange={e => setSampleForm({ ...sampleForm, usageGuide: e.target.value })}
                    rows="3"
                    className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  ></textarea>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddSampleModal(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow"
                  >
                    Lưu sản phẩm
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: REVIEWER PORTAL                                                   */}
        {/* ========================================================================= */}
        {currentRole === 'REVIEWER' && (
          <div className="space-y-8 animate-fadeIn">

            {/* Reviewer Header Profile Summary */}
            <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white p-6 rounded-2xl shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center text-2xl font-black">
                  {activeReviewer.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold">{activeReviewer.name}</h1>
                    <span className="bg-purple-500/30 text-purple-200 border border-purple-400/30 text-xs px-2.5 py-0.5 rounded-full font-bold">
                      {activeReviewer.rank}
                    </span>
                  </div>
                  <p className="text-xs text-purple-200 mt-1 flex items-center gap-3 flex-wrap">
                    <span>Mã: {activeReviewer.id}</span>
                    <span>| Nền tảng: {activeReviewer.platform} ({activeReviewer.followers.toLocaleString('vi-VN')} Followers)</span>
                    <span>| Chuyên môn: {activeReviewer.specialty}</span>
                  </p>
                </div>
              </div>

              {/* Reputation & Status Box */}
              <div className="bg-white/10 backdrop-blur p-4 rounded-xl border border-white/20 flex items-center gap-6">
                <div>
                  <p className="text-xs text-purple-200">Điểm Uy Tín</p>
                  <p className={`text-2xl font-black ${
                    activeReviewer.reputationScore >= 80 ? 'text-emerald-400' :
                    activeReviewer.reputationScore >= 50 ? 'text-amber-400' : 'text-rose-400'
                  }`}>
                    {activeReviewer.reputationScore} / 100
                  </p>
                </div>
                
                <div className="border-l border-white/20 pl-6">
                  <p className="text-xs text-purple-200">Trạng thái tài khoản</p>
                  <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full mt-1 ${
                    activeReviewer.status === 'Hoạt động' ? 'bg-emerald-500/30 text-emerald-300' : 'bg-rose-500/30 text-rose-300'
                  }`}>
                    {activeReviewer.status}
                  </span>
                </div>
              </div>
            </div>

            {/* THANH ĐIỀU HƯỚNG TAB (MENU CHUYỂN TRANG) */}
            <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm w-fit">
              <button 
                onClick={() => setActiveTab('campaigns')} 
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'campaigns' 
                    ? 'bg-indigo-600 text-white shadow' 
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Danh sách Chiến dịch
              </button>

              <button 
                onClick={() => setActiveTab('wallet')} 
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'wallet' 
                    ? 'bg-indigo-600 text-white shadow' 
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Ví tiền &amp; Rút tiền
              </button>
            </div>

            {/* 3. NỘI DUNG HIỂN THỊ THEO TAB ĐƯỢC CHỌN */}
            {activeTab === 'wallet' ? (
              /* HIỂN THỊ TRANG VÍ TIỀN */
              <WalletTab 
                auth={auth} 
                reviewers={reviewers} 
                participations={participations} 
                campaigns={campaigns} 
                notify={notify} 
                refreshData={fetchFreshData} 
              />
            ) : (
              /* HIỂN THỊ TRANG CHÍNH (CHIẾN DỊCH & THU NHẬP) */
              <div className="space-y-8">
                
                {/* Warning logic if Reputation < 50 */}
                {activeReviewer.reputationScore < 50 && (
                  <div className="bg-rose-50 border-2 border-rose-300 text-rose-800 p-4 rounded-2xl flex items-center gap-3">
                    <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0" />
                    <div>
                      <h4 className="font-bold text-sm">Tài khoản bị khóa chức năng đăng ký chiến dịch mới!</h4>
                      <p className="text-xs mt-0.5">
                        Điểm uy tín của bạn hiện tại là <strong>{activeReviewer.reputationScore} điểm</strong> (dưới mốc tối thiểu 50 điểm). Vui lòng liên hệ Admin để giải quyết vi phạm.
                      </p>
                    </div>
                  </div>
                )}

                {/* Income Calculator Breakdown Box */}
                {(() => {
                  const earnings = calculateReviewerEarnings(activeReviewer.id);
                  return (
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                      <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-emerald-600" />
                        Bảng Thu Nhập Tháng Tạm Tính
                      </h2>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                          <p className="text-xs text-slate-500 font-medium">Thù lao định mức cấp bậc</p>
                          <p className="text-lg font-bold text-slate-800 mt-1">
                            {earnings.baseMonthlyAllowance.toLocaleString('vi-VN')} đ
                          </p>
                          <span className="text-[10px] text-slate-400">Có tham gia ít nhất 1 chiến dịch</span>
                        </div>

                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                          <p className="text-xs text-slate-500 font-medium">Thù lao chiến dịch hoàn thành</p>
                          <p className="text-lg font-bold text-slate-800 mt-1">
                            {earnings.totalCampaignEarnings.toLocaleString('vi-VN')} đ
                          </p>
                          <span className="text-[10px] text-slate-400">Tổng thù lao cơ bản các chiến dịch</span>
                        </div>

                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                          <p className="text-xs text-slate-500 font-medium">Thưởng thêm (Nộp sớm &amp; View cao)</p>
                          <p className="text-lg font-bold text-emerald-600 mt-1">
                            +{earnings.totalBonus.toLocaleString('vi-VN')} đ
                          </p>
                          <span className="text-[10px] text-slate-400">+10% nộp sớm trước 3 ngày, +200k nếu interaction &gt; 10k</span>
                        </div>

                        <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                          <p className="text-xs text-emerald-700 font-bold uppercase tracking-wider">Tổng Thu Nhập Thực Nhận</p>
                          <p className="text-2xl font-black text-emerald-800 mt-1">
                            {earnings.grandTotal.toLocaleString('vi-VN')} đ
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* WORKFLOW: MY ACTIVE PARTICIPATIONS */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-purple-600" />
                    Công việc đang thực hiện
                  </h2>

                  <div className="divide-y divide-slate-100">
                    {participations.filter(p => p.reviewerId === activeReviewer.id).length > 0 ? (
                      participations.filter(p => p.reviewerId === activeReviewer.id).map(p => {
                        const cmp = campaigns.find(c => c.id === p.campaignId);
                        if (!cmp) return null;

                        return (
                          <div key={p.id} className="py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-bold text-slate-900 text-base">{cmp.title}</h3>
                                <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold ${
                                  p.status === 'Đã hoàn thành' ? 'bg-emerald-100 text-emerald-800' :
                                  p.status === 'Đã nộp bài' ? 'bg-amber-100 text-amber-800' :
                                  p.status === 'Bị hủy' ? 'bg-rose-100 text-rose-800' : 'bg-blue-100 text-blue-800'
                                }`}>
                                  {p.status}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 mt-1">
                                Nhãn hàng: <strong>{cmp.brandName}</strong> | Hạn nộp bài: <strong className="text-rose-600">{cmp.endDate}</strong>
                              </p>
                            </div>

                            <div className="flex items-center gap-3">
                              {p.status === 'Đang thực hiện' && (
                                <button
                                  onClick={() => setShowSubmitLinkModal(p)}
                                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2"
                                >
                                  <FileText className="w-4 h-4" />
                                  Nộp link nghiệm thu
                                </button>
                              )}

                              {p.submissionLink && (
                                <a
                                  href={p.submissionLink}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-xl text-xs font-semibold hover:bg-indigo-100 transition-all flex items-center gap-1"
                                >
                                  Xem link <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-sm text-slate-400 italic py-4">Bạn chưa đăng ký tham gia chiến dịch nào.</p>
                    )}
                  </div>
                </div>

                {/* CAMPAIGN MARKETPLACE */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <Search className="w-5 h-5 text-indigo-600" />
                      Chợ Chiến dịch (Marketplace)
                    </h2>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                      <div className="relative flex-1 md:w-64">
                        <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                        <input 
                          type="text" 
                          placeholder="Tìm tên chiến dịch..." 
                          value={campaignSearchText}
                          onChange={e => setCampaignSearchText(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Campaign Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {campaigns
                      .filter(c => c.title.toLowerCase().includes(campaignSearchText.toLowerCase()))
                      .map(cmp => {
                        const isEligibleRank = RANK_LEVELS[activeReviewer.rank] >= RANK_LEVELS[cmp.minRankRequired];
                        const isReputationOK = activeReviewer.reputationScore >= 50 && activeReviewer.status === 'Hoạt động';

                        return (
                          <div key={cmp.id} className="border border-slate-200 rounded-2xl p-5 hover:shadow-md transition-all flex flex-col justify-between bg-white">
                            <div className="space-y-3">
                              <div className="flex justify-between items-start">
                                <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                  {cmp.type}
                                </span>
                                <span className="text-xs text-slate-400">Hạn: {cmp.endDate}</span>
                              </div>

                              <h3 className="font-bold text-slate-900 text-base line-clamp-2">{cmp.title}</h3>
                              <p className="text-xs text-slate-500">Nhãn hàng: <strong>{cmp.brandName}</strong></p>

                              <div className="bg-slate-50 p-3 rounded-xl space-y-1 text-xs">
                                <div className="flex justify-between">
                                  <span className="text-slate-500">Thù lao cơ bản:</span>
                                  <span className="font-extrabold text-emerald-600">{cmp.baseSalary.toLocaleString('vi-VN')} đ</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-500">Yêu cầu Cấp bậc:</span>
                                  <span className={`font-bold ${isEligibleRank ? 'text-purple-600' : 'text-rose-600'}`}>
                                    {cmp.minRankRequired}+
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="pt-4 mt-4 border-t border-slate-100">
                              <button
                                onClick={() => handleRegisterCampaign(cmp.id)}
                                disabled={!isEligibleRank || !isReputationOK}
                                className={`w-full py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-2 ${
                                  isEligibleRank && isReputationOK
                                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                }`}
                              >
                                {!isReputationOK ? (
                                  <>
                                    <Lock className="w-4 h-4" /> Bị khóa (Điểm uy tín &lt; 50)
                                  </>
                                ) : !isEligibleRank ? (
                                  <>
                                    <Lock className="w-4 h-4" /> Yêu cầu {cmp.minRankRequired}
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle2 className="w-4 h-4" /> Đăng ký ngay
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

              </div>
            )}

          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 3: SUPER ADMIN PORTAL                                                */}
        {/* ========================================================================= */}
        {currentRole === 'ADMIN' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Top Admin Summary Banner */}
            <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <ShieldCheck className="w-7 h-7 text-amber-400" />
                  Trung tâm Quản trị Nền tảng (Super Admin)
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Giám sát doanh thu, danh sách Nhãn hàng, Reviewers và áp dụng hình phạt tự động.
                </p>
              </div>
            </div>

            {/* Platform Revenue Calculation Engine Box */}
            <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-2 border-amber-500/30 p-6 rounded-2xl">
              <h2 className="text-lg font-bold text-amber-900 mb-2 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-amber-600" />
                Thống Kê Doanh Thu Nền Tảng Trong Tháng
              </h2>
              <p className="text-xs text-amber-800/80 mb-4">
                Công thức: <strong>10% Tổng thù lao chiến dịch hoàn thành + 5% Giá trị sản phẩm mẫu cấp phát.</strong>
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-sm">
                  <p className="text-xs text-slate-500 font-medium">10% Phí Dịch Vụ Chiến Dịch</p>
                  <p className="text-xl font-bold text-slate-900 mt-1">
                    {adminPlatformRevenue.feeFromCampaigns.toLocaleString('vi-VN')} đ
                  </p>
                  <span className="text-[10px] text-slate-400">
                    Trích từ tổng {adminPlatformRevenue.totalCampaignFees.toLocaleString('vi-VN')} đ thù lao
                  </span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-sm">
                  <p className="text-xs text-slate-500 font-medium">5% Giá Trị Sản Phẩm Mẫu</p>
                  <p className="text-xl font-bold text-slate-900 mt-1">
                    {adminPlatformRevenue.feeFromSamples.toLocaleString('vi-VN')} đ
                  </p>
                  <span className="text-[10px] text-slate-400">
                    Trích từ tổng {adminPlatformRevenue.totalSampleValue.toLocaleString('vi-VN')} đ sample
                  </span>
                </div>

                <div className="bg-amber-600 text-white p-4 rounded-xl shadow-md">
                  <p className="text-xs text-amber-100 font-bold uppercase tracking-wider">TỔNG DOANH THU SÀN</p>
                  <p className="text-2xl font-black mt-1">
                    {adminPlatformRevenue.totalPlatformRevenue.toLocaleString('vi-VN')} đ
                  </p>
                </div>
              </div>
            </div>

            {/* TOP PERFORMERS & VIOLATION WARNINGS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* TOP REVIEWERS BY INTERACTIONS */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  Top Reviewer Tương Tác Tốt Nhất Tháng
                </h2>

                <div className="divide-y divide-slate-100">
                  {reviewers
                    .map(r => {
                      const totalInteractions = participations
                        .filter(p => p.reviewerId === r.id)
                        .reduce((sum, p) => sum + p.totalInteractions, 0);
                      return { ...r, totalInteractions };
                    })
                    .sort((a, b) => b.totalInteractions - a.totalInteractions)
                    .map((r, index) => (
                      <div key={r.id} className="py-3 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-white ${
                            index === 0 ? 'bg-amber-500' : index === 1 ? 'bg-slate-400' : 'bg-amber-700'
                          }`}>
                            {index + 1}
                          </span>
                          <div>
                            <p className="font-bold text-slate-900">{r.name}</p>
                            <p className="text-slate-400">{r.platform} | {r.rank}</p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="font-extrabold text-indigo-600">{r.totalInteractions.toLocaleString('vi-VN')} tương tác</p>
                          <p className="text-[10px] text-slate-400">Điểm uy tín: {r.reputationScore}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* OVERDUE & VIOLATION MANAGEMENT */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-rose-600" />
                  Cảnh Báo Quá Hạn & Xử Lý Vi Phạm
                </h2>

                <div className="divide-y divide-slate-100">
                  {participations.filter(p => p.cancelReason?.startsWith('Quá hạn')).map(p => {
                    const cmp = campaigns.find(c => c.id === p.campaignId);
                    const rev = reviewers.find(r => r.id === p.reviewerId);
                    if (!cmp || !rev) return null;
                    return (
                      <div key={p.id} className="py-3 text-xs">
                        <p className="font-bold text-slate-900">{rev.name}</p>
                        <p className="text-slate-500">Chiến dịch: {cmp.title}</p>
                        <p className="text-rose-600 font-semibold">Hết hạn {cmp.endDate}: đã hủy lượt và trừ 10 điểm uy tín</p>
                      </div>
                    );
                  })}
                  {participations.filter(p => p.cancelReason?.startsWith('Quá hạn')).length === 0 && (
                    <p className="text-xs text-slate-400 italic py-2">Chưa có lượt nào bị phạt quá hạn.</p>
                  )}
                </div>
              </div>

            </div>

            {/* FULL REVIEWERS MANAGEMENT TABLE */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                Danh Sách Tất Cả Reviewer Của Hệ Thống
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Reviewer</th>
                      <th className="p-3">CCCD/CMND</th>
                      <th className="p-3">Nền tảng / Rank</th>
                      <th className="p-3">Chuyên môn</th>
                      <th className="p-3">Điểm Uy Tín</th>
                      <th className="p-3">Trạng Thái</th>
                      <th className="p-3 text-right">Thao tác</th> {/* Thêm cột thao tác */}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {reviewers.map(r => (
                      <tr key={r.id} className="hover:bg-slate-50">
                        <td className="p-3 font-semibold text-slate-900">{r.name}</td>
                        <td className="p-3">{r.idCard}</td>
                        <td className="p-3">{r.platform} ({r.rank})</td>
                        <td className="p-3">{r.specialty}</td>
                        <td className="p-3">
                          <span className={`font-bold ${r.reputationScore < 50 ? 'text-rose-600' : 'text-emerald-600'}`}>
                            {r.reputationScore} / 100
                          </span>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            r.status === 'Hoạt động' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {r.status}
                          </span>
                        </td>
                        {/* THÊM NÚT GỠ KHÓA VÀO ĐÂY */}
                        <td className="p-3 text-right">
                          {r.status === 'Bị khóa' && (
                            <button
                              onClick={() => handleUnlockReviewer(r.id)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all shadow-sm"
                            >
                              Gỡ khóa
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* ========================================================================= */}
      {/* MODAL DIALOGS                                                             */}
      {/* ========================================================================= */}

      {/* 1. Modal Create Campaign */}
      {showCreateCampaignModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setShowCreateCampaignModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900">Tạo Chiến Dịch Mới</h3>

            <form onSubmit={handleCreateCampaign} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tên Chiến Dịch / Sản Phẩm</label>
                <input required name="title" type="text" placeholder="VD: Review Tai Nghe Bluetooth ANC..." className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Loại Chiến Dịch</label>
                  <select name="type" className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                    <option value="Review sản phẩm">Review sản phẩm</option>
                    <option value="Tăng nhận diện">Tăng nhận diện</option>
                    <option value="Affiliate">Affiliate</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Cấp bậc tối thiểu</label>
                  <select name="minRankRequired" className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                    <option value="Junior">Junior</option>
                    <option value="Senior">Senior</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Ngày Bắt Đầu</label>
                  <input required name="startDate" type="date" className="w-full p-2.5 border border-slate-200 rounded-xl" />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Ngày Kết Thúc</label>
                  <input required name="endDate" type="date" className="w-full p-2.5 border border-slate-200 rounded-xl" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Ngân sách tối đa (VNĐ)</label>
                  <input required name="budget" type="number" defaultValue="20000000" className="w-full p-2.5 border border-slate-200 rounded-xl" />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Thù lao cơ bản / bài</label>
                  <input required name="baseSalary" type="number" defaultValue="2000000" className="w-full p-2.5 border border-slate-200 rounded-xl" />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Số lượng Reviewer tối đa</label>
                <input required name="maxReviewers" type="number" defaultValue="10" className="w-full p-2.5 border border-slate-200 rounded-xl" />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Chọn Sản Phẩm Mẫu Kèm Theo</label>
                <div className="space-y-1 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  {samples.filter(s => s.brandId === activeBrand.id).map(s => (
                    <label key={s.id} className="flex items-center gap-2 cursor-pointer text-slate-700">
                      <input type="checkbox" name="samples" value={s.id} className="rounded text-indigo-600" />
                      <span>{s.name} ({s.price.toLocaleString('vi-VN')} đ)</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setShowCreateCampaignModal(false)} className="px-4 py-2 text-slate-500 font-bold">Hủy</button>
                <button type="submit" className="px-5 py-2 bg-indigo-600 text-white font-bold rounded-xl shadow-md hover:bg-indigo-700">Tạo Ngay</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Modal Submit Link Review */}
      {showSubmitLinkModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative space-y-4">
            <button onClick={() => setShowSubmitLinkModal(null)} className="absolute right-4 top-4 text-slate-400">
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900">Nộp Link Bài Đăng Nghiệm Thu</h3>
            <p className="text-xs text-slate-500">
              Dán liên kết bài đăng (TikTok, Facebook, YouTube) của bạn để Nhãn hàng nghiệm thu và duyệt chi trả thù lao.
            </p>

            <form onSubmit={e => {
              e.preventDefault();
              handleSubmitLink(showSubmitLinkModal.id, e.target.link.value);
            }} className="space-y-4">
              <input 
                name="link" 
                type="url" 
                required 
                placeholder="https://tiktok.com/@username/video/123..." 
                className="w-full p-3 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />

              <div className="flex justify-end gap-2 text-xs">
                <button type="button" onClick={() => setShowSubmitLinkModal(null)} className="px-4 py-2 text-slate-500 font-bold">Hủy</button>
                <button type="submit" className="px-5 py-2 bg-purple-600 text-white font-bold rounded-xl shadow-md">Gửi Bài</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Modal Approve Submission & Rating */}
      {showApproveModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative space-y-4">
            <button onClick={() => setShowApproveModal(null)} className="absolute right-4 top-4 text-slate-400">
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900">Duyệt & Đánh Giá Bài Review</h3>
            <p className="text-xs text-slate-500">
              Chấm điểm chất lượng nội dung của Reviewer <strong>{showApproveModal.reviewerName}</strong> (1 đến 5 sao).
            </p>

            <div className="flex justify-center gap-2 py-4 text-amber-400">
              {[1, 2, 3, 4, 5].map(star => (
                <button 
                  key={star}
                  type="button"
                  onClick={() => handleApproveParticipation(showApproveModal.id, star)}
                  className="p-2 hover:scale-125 transition-transform"
                >
                  <Star className="w-8 h-8 fill-current" />
                </button>
              ))}
            </div>

            <p className="text-[11px] text-center text-slate-400">Bấm vào số sao tương ứng để hoàn tất phê duyệt</p>
          </div>
        </div>
      )}

    </div>
  );
}