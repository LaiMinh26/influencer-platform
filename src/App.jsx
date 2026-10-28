import React, { useState, useMemo } from 'react';
import LoginScreen from './LoginScreen';
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

// --- INITIAL MOCK DATA ---

const INITIAL_BRANDS = [
  {
    id: 'BRD001',
    taxCode: '0101234567',
    name: 'Cosmetics Vietnam Corp',
    brandCode: 'COSMO_VN',
    industry: 'Mỹ phẩm',
    address: '72 Lê Thánh Tôn, Q.1, TP.HCM',
    phone: '0901234567',
    email: 'contact@cosmovn.com',
    representative: 'Nguyễn Văn Hải',
    rating: 4.8,
    status: 'Hoạt động'
  },
  {
    id: 'BRD002',
    taxCode: '0309876543',
    name: 'TechGear Digital Ltd',
    brandCode: 'TECH_GEAR',
    industry: 'Công nghệ',
    address: '123 Cầu Giấy, Hà Nội',
    phone: '0912345678',
    email: 'support@techgear.vn',
    representative: 'Trần Thu Hà',
    rating: 4.5,
    status: 'Hoạt động'
  },
  {
    id: 'BRD003',
    taxCode: '0405556667',
    name: 'TastyBites Food & Beverage',
    brandCode: 'TASTY_FOOD',
    industry: 'Ẩm thực',
    address: '45 Nguyễn Huệ, Đà Nẵng',
    phone: '0988776655',
    email: 'info@tastybites.vn',
    representative: 'Lê Hoàng Nam',
    rating: 4.2,
    status: 'Hoạt động'
  }
];

const INITIAL_REVIEWERS = [
  {
    id: 'REV001',
    idCard: '012345678901',
    name: 'Nguyễn Thảo Nhi (Nhi Review)',
    dob: '1998-05-14',
    gender: 'Nữ',
    hometown: 'Hà Nội',
    phone: '0981112223',
    email: 'thaonhi.review@gmail.com',
    bankAccount: '1903344556677 - Techcombank',
    socialLink: 'https://tiktok.com/@nhireview_beauty',
    platform: 'TikTok',
    followers: 250000,
    specialty: 'Mỹ phẩm',
    rank: 'Senior',
    reputationScore: 92,
    status: 'Hoạt động'
  },
  {
    id: 'REV002',
    idCard: '023456789012',
    name: 'Lê Minh Tuấn (Tuấn Tech Unbox)',
    dob: '1995-11-20',
    gender: 'Nam',
    hometown: 'TP.HCM',
    phone: '0972223334',
    email: 'tuantech.youtube@gmail.com',
    bankAccount: '0071000123456 - Vietcombank',
    socialLink: 'https://youtube.com/c/TuanTechUnbox',
    platform: 'YouTube',
    followers: 520000,
    specialty: 'Công nghệ',
    rank: 'Expert',
    reputationScore: 98,
    status: 'Hoạt động'
  },
  {
    id: 'REV003',
    idCard: '034567890123',
    name: 'Phạm Hương Giang (Giang Foodie)',
    dob: '2001-03-08',
    gender: 'Nữ',
    hometown: 'Đà Nẵng',
    phone: '0963334445',
    email: 'giangfoodie.insta@gmail.com',
    bankAccount: '1012233445 - MBBank',
    socialLink: 'https://instagram.com/giang_foodie_review',
    platform: 'Instagram',
    followers: 45000,
    specialty: 'Ẩm thực',
    rank: 'Junior',
    reputationScore: 45, // Under 50 -> Locked status demo
    status: 'Bị khóa'
  },
  {
    id: 'REV004',
    idCard: '045678901234',
    name: 'Hoàng Anh Đức (Đức Lifestyle)',
    dob: '1999-09-12',
    gender: 'Nam',
    hometown: 'Hải Phòng',
    phone: '0954445556',
    email: 'duc.lifestyle@gmail.com',
    bankAccount: '9998887776 - ACB',
    socialLink: 'https://facebook.com/duclifestyle',
    platform: 'Facebook',
    followers: 85000,
    specialty: 'Mỹ phẩm',
    rank: 'Junior',
    reputationScore: 78,
    status: 'Hoạt động'
  }
];

const INITIAL_SAMPLES = [
  {
    id: 'SMP001',
    brandId: 'BRD001',
    name: 'Tinh Chất Dưỡng Sáng SkinGlow Serum 30ml',
    price: 450000,
    stock: 50,
    usageGuide: 'Thoa 2-3 giọt mỗi sáng và tối sau bước toner. Mát-xa nhẹ nhàng.'
  },
  {
    id: 'SMP002',
    brandId: 'BRD001',
    name: 'Kem Chống Nắng UltraProtect SPF50+ 50g',
    price: 320000,
    stock: 100,
    usageGuide: 'Thoa trước khi ra ngoài 20 phút. Thoa lại sau 4 tiếng nếu tiếp xúc ánh nắng nhiều.'
  },
  {
    id: 'SMP003',
    brandId: 'BRD002',
    name: 'Tai Nghe Bluetooth ProBass Wireless ANC',
    price: 1850000,
    stock: 20,
    usageGuide: 'Sạc đầy trước khi dùng. Kết nối Bluetooth 5.2. Tránh dính nước mưa.'
  },
  {
    id: 'SMP004',
    brandId: 'BRD003',
    name: 'Combo 5 Hộp Trà Mật Ong Đông Trùng Hạ Thảo',
    price: 550000,
    stock: 35,
    usageGuide: 'Pha 1 gói với 150ml nước ấm 70 độ C. Dùng mỗi sáng sau ăn.'
  }
];

const INITIAL_CAMPAIGNS = [
  {
    id: 'CMP001',
    brandId: 'BRD001',
    brandName: 'Cosmetics Vietnam Corp',
    title: 'Review Dòng Serum Trắng Da SkinGlow Mới',
    type: 'Review sản phẩm',
    startDate: '2026-10-01',
    endDate: '2026-11-15',
    budget: 30000000,
    baseSalary: 2500000,
    maxReviewers: 10,
    minRankRequired: 'Junior',
    status: 'Đang diễn ra',
    sampleIds: ['SMP001']
  },
  {
    id: 'CMP002',
    brandId: 'BRD002',
    brandName: 'TechGear Digital Ltd',
    title: 'Unboxing & Test Chống Ồn Tai Nghe ProBass ANC',
    type: 'Affiliate',
    startDate: '2026-10-10',
    endDate: '2026-11-20',
    budget: 50000000,
    baseSalary: 5000000,
    maxReviewers: 5,
    minRankRequired: 'Senior',
    status: 'Đang mở đăng ký',
    sampleIds: ['SMP003']
  },
  {
    id: 'CMP003',
    brandId: 'BRD003',
    brandName: 'TastyBites Food & Beverage',
    title: 'Trải Nghiệm Trà Mật Ong Đông Trùng Hạ Thảo',
    type: 'Tăng nhận diện',
    startDate: '2026-09-15',
    endDate: '2026-10-30',
    budget: 20000000,
    baseSalary: 1800000,
    maxReviewers: 8,
    minRankRequired: 'Junior',
    status: 'Đang diễn ra',
    sampleIds: ['SMP004']
  }
];

const INITIAL_PARTICIPATIONS = [
  {
    id: 'PAR001',
    campaignId: 'CMP001',
    reviewerId: 'REV001',
    reviewerName: 'Nguyễn Thảo Nhi (Nhi Review)',
    registerTime: '2026-10-02 09:30',
    submitTime: '2026-11-05 14:20', // Submitted 10 days before end date (Early > 3 days!)
    status: 'Đã hoàn thành',
    submissionLink: 'https://tiktok.com/@nhireview_beauty/video/7388291011',
    views: 18500,
    likes: 2300,
    shares: 410,
    totalInteractions: 21210,
    brandRating: 5,
    cancelReason: '',
    timeBonusRatio: 0.1, // +10% early submission
    samplesReceived: ['SMP001']
  },
  {
    id: 'PAR002',
    campaignId: 'CMP003',
    reviewerId: 'REV004',
    reviewerName: 'Hoàng Anh Đức (Đức Lifestyle)',
    registerTime: '2026-09-16 11:15',
    submitTime: '2026-10-30 22:10', // Submitted last day
    status: 'Đã nộp bài',
    submissionLink: 'https://facebook.com/duclifestyle/posts/pfbid02931203',
    views: 8200,
    likes: 650,
    shares: 80,
    totalInteractions: 8930,
    brandRating: 0,
    cancelReason: '',
    timeBonusRatio: 0,
    samplesReceived: ['SMP004']
  },
  {
    id: 'PAR003',
    campaignId: 'CMP002',
    reviewerId: 'REV002',
    reviewerName: 'Lê Minh Tuấn (Tuấn Tech Unbox)',
    registerTime: '2026-10-12 15:45',
    submitTime: '',
    status: 'Đang thực hiện',
    submissionLink: '',
    views: 0,
    likes: 0,
    shares: 0,
    totalInteractions: 0,
    brandRating: 0,
    cancelReason: '',
    timeBonusRatio: 0,
    samplesReceived: ['SMP003']
  }
];

// --- HELPER RANK COMPARISON ---
const RANK_LEVELS = { 'Junior': 1, 'Senior': 2, 'Expert': 3 };

export default function App() {
  // --- GLOBAL STATES ---
const [auth, setAuth] = useState(null); // { role, entityId, username }
const currentRole = auth?.role;
const selectedBrandId = auth?.role === 'BRAND' ? auth.entityId : 'BRD001';
const selectedReviewerId = auth?.role === 'REVIEWER' ? auth.entityId : 'REV001';

  // Entities Data
  const [brands, setBrands] = useState(INITIAL_BRANDS);
  const [reviewers, setReviewers] = useState(INITIAL_REVIEWERS);
  const [campaigns, setCampaigns] = useState(INITIAL_CAMPAIGNS);
  const [samples, setSamples] = useState(INITIAL_SAMPLES);
  const [participations, setParticipations] = useState(INITIAL_PARTICIPATIONS);

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
  const activeBrand = useMemo(() => brands.find(b => b.id === selectedBrandId) || brands[0], [brands, selectedBrandId]);
  const activeReviewer = useMemo(() => reviewers.find(r => r.id === selectedReviewerId) || reviewers[0], [reviewers, selectedReviewerId]);

  // 1. Reviewer Income Calculator logic
  const calculateReviewerEarnings = (revId) => {
    const revParticipations = participations.filter(p => p.reviewerId === revId && p.status === 'Đã hoàn thành');
    const hasParticipated = participations.some(p => p.reviewerId === revId);
    
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

  // 2. Admin Revenue Calculator
  const adminPlatformRevenue = useMemo(() => {
    const completedParticipations = participations.filter(p => p.status === 'Đã hoàn thành');
    
    // 10% of total campaign salary payouts
    let totalCampaignFees = 0;
    // 5% of sample values issued for completed campaigns
    let totalSampleValue = 0;

    completedParticipations.forEach(p => {
      const cmp = campaigns.find(c => c.id === p.campaignId);
      if (cmp) {
        totalCampaignFees += cmp.baseSalary;
      }
      p.samplesReceived?.forEach(smpId => {
        const smp = samples.find(s => s.id === smpId);
        if (smp) {
          totalSampleValue += smp.price;
        }
      });
    });

    const feeFromCampaigns = totalCampaignFees * 0.10;
    const feeFromSamples = totalSampleValue * 0.05;

    return {
      totalCampaignFees,
      totalSampleValue,
      feeFromCampaigns,
      feeFromSamples,
      totalPlatformRevenue: feeFromCampaigns + feeFromSamples
    };
  }, [participations, campaigns, samples]);

  // 3. Register Campaign Action
  const handleRegisterCampaign = (campaignId) => {
    const cmp = campaigns.find(c => c.id === campaignId);
    if (!cmp) return;

    // Constraint 1: Reputation score check
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
    const previousRegCount = participations.filter(
      p => p.reviewerId === activeReviewer.id && p.campaignId === campaignId
    ).length;

    if (previousRegCount >= 2) {
      notify('Bạn không thể đăng ký 1 chiến dịch quá 2 lần!', 'error');
      return;
    }

    // Check if already active in this campaign
    const currentlyActive = participations.some(
      p => p.reviewerId === activeReviewer.id && p.campaignId === campaignId && p.status !== 'Bị hủy'
    );
    if (currentlyActive) {
      notify('Bạn đang trong quá trình thực hiện chiến dịch này rồi!', 'error');
      return;
    }

    const newParticipation = {
      id: `PAR${String(participations.length + 1).padStart(3, '0')}`,
      campaignId: cmp.id,
      reviewerId: activeReviewer.id,
      reviewerName: activeReviewer.name,
      registerTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
      submitTime: '',
      status: 'Đang thực hiện',
      submissionLink: '',
      views: 0,
      likes: 0,
      shares: 0,
      totalInteractions: 0,
      brandRating: 0,
      cancelReason: '',
      timeBonusRatio: 0,
      samplesReceived: [...cmp.sampleIds]
    };

    setParticipations([newParticipation, ...participations]);
    notify(`Đăng ký chiến dịch "${cmp.title}" thành công!`);
  };

  // 4. Submit Job Review Link
  const handleSubmitLink = (parId, link) => {
    if (!link || !link.startsWith('http')) {
      notify('Vui lòng nhập đường dẫn URL hợp lệ!', 'error');
      return;
    }

    const targetPar = participations.find(p => p.id === parId);
    if (!targetPar) return;

    const cmp = campaigns.find(c => c.id === targetPar.campaignId);
    const now = new Date();
    const endDate = new Date(cmp.endDate);
    
    // Check if submitted >= 3 days before end date
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    let bonusRatio = 0;
    if (diffDays >= 3) {
      bonusRatio = 0.1; // 10% bonus
    }

    // Mock random realistic views/likes/shares for presentation
    const mockViews = Math.floor(Math.random() * 15000) + 2000;
    const mockLikes = Math.floor(mockViews * 0.12);
    const mockShares = Math.floor(mockLikes * 0.15);

    setParticipations(participations.map(p => {
      if (p.id === parId) {
        return {
          ...p,
          submitTime: now.toISOString().replace('T', ' ').substring(0, 16),
          status: 'Đã nộp bài',
          submissionLink: link,
          views: mockViews,
          likes: mockLikes,
          shares: mockShares,
          totalInteractions: mockViews + mockLikes + mockShares,
          timeBonusRatio: bonusRatio
        };
      }
      return p;
    }));

    setShowSubmitLinkModal(null);
    notify('Nộp bài nghiệm thu thành công! Nhãn hàng sẽ kiểm tra và phê duyệt.');
  };

  // 5. Brand Approve & Rate Review
  const handleApproveParticipation = (parId, rating) => {
    setParticipations(participations.map(p => {
      if (p.id === parId) {
        return {
          ...p,
          status: 'Đã hoàn thành',
          brandRating: rating
        };
      }
      return p;
    }));
    setShowApproveModal(null);
    notify(`Đã phê duyệt bài nghiệm thu và đánh giá ${rating} sao!`);
  };

  // 6. Penalty logic (Deduct 10 points & Lock if < 50)
  const handleApplyPenalty = (reviewerId, parId, reason) => {
    // Cancel participation
    setParticipations(participations.map(p => {
      if (p.id === parId) {
        return {
          ...p,
          status: 'Bị hủy',
          cancelReason: reason
        };
      }
      return p;
    }));

    // Deduct 10 points & Update Status
    setReviewers(reviewers.map(r => {
      if (r.id === reviewerId) {
        const newScore = Math.max(0, r.reputationScore - 10);
        const newStatus = newScore < 50 ? 'Bị khóa' : r.status;
        return {
          ...r,
          reputationScore: newScore,
          status: newStatus
        };
      }
      return r;
    }));

    notify(`Đã áp dụng hình phạt: Trừ 10 điểm uy tín cho Reviewer. ${reason}`, 'error');
  };

  // 7. Add New Campaign
  const handleCreateCampaign = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const selectedSamples = formData.getAll('samples');

    const newCmp = {
      id: `CMP${String(campaigns.length + 1).padStart(3, '0')}`,
      brandId: activeBrand.id,
      brandName: activeBrand.name,
      title: formData.get('title'),
      type: formData.get('type'),
      startDate: formData.get('startDate'),
      endDate: formData.get('endDate'),
      budget: Number(formData.get('budget')),
      baseSalary: Number(formData.get('baseSalary')),
      maxReviewers: Number(formData.get('maxReviewers')),
      minRankRequired: formData.get('minRankRequired'),
      status: 'Đang mở đăng ký',
      sampleIds: selectedSamples
    };

    setCampaigns([newCmp, ...campaigns]);
    setShowCreateCampaignModal(false);
    notify('Tạo chiến dịch mới thành công!');
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
          {currentRole === 'BRAND' ? activeBrand.name : currentRole === 'REVIEWER' ? activeReviewer.name : 'Quản trị viên'}
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
                  <p className="text-xs text-slate-500 font-medium">Tổng ngân sách</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {campaigns.filter(c => c.brandId === activeBrand.id)
                      .reduce((sum, c) => sum + c.budget, 0).toLocaleString('vi-VN')} đ
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

                      {/* Associated Submissions / Reviewers table */}
                      {cmpParticipations.length > 0 ? (
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-3">
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Reviewer Tham gia & Nộp bài nghiệm thu
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
                                          Nghiệm thu & Duyệt
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
                      <p className="text-xs text-slate-500 font-medium">Thưởng thêm (Nộp sớm & View cao)</p>
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
                          {p.timeBonusRatio > 0 && (
                            <span className="inline-block mt-1 text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                              ⚡ Đã nộp bài sớm trước 3 ngày (+10% thù lao)
                            </span>
                          )}
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
                  {participations.filter(p => p.status === 'Đang thực hiện').map(p => {
                    const cmp = campaigns.find(c => c.id === p.campaignId);
                    const rev = reviewers.find(r => r.id === p.reviewerId);
                    if (!cmp || !rev) return null;

                    return (
                      <div key={p.id} className="py-3 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-slate-900">{rev.name}</p>
                          <p className="text-slate-500">Chiến dịch: {cmp.title}</p>
                          <p className="text-rose-600 font-semibold">Hạn chót: {cmp.endDate}</p>
                        </div>

                        <button
                          onClick={() => handleApplyPenalty(rev.id, p.id, 'Quá hạn nộp bài nghiệm thu')}
                          className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-3 py-1.5 rounded-lg font-bold text-[11px] transition-all"
                        >
                          Phạt -10 điểm uy tín
                        </button>
                      </div>
                    );
                  })}
                  {participations.filter(p => p.status === 'Đang thực hiện').length === 0 && (
                    <p className="text-xs text-slate-400 italic py-2">Không có tiến độ công việc nào bị vi phạm.</p>
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