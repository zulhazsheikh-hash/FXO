import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Wallet, 
  Users, 
  User, 
  Home, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Copy, 
  Share2, 
  Clock, 
  ShieldCheck, 
  Zap, 
  Gift, 
  ChevronRight, 
  CheckCircle2, 
  Code, 
  Send, 
  TrendingUp,
  AlertTriangle,
  Flame,
  Globe,
  DollarSign
} from 'lucide-react';

export default function App() {
  // --- Bot Credentials Integration ---
  const BOT_TOKEN = "8637007707:AAE4gVCp1Pz0ElVZuQdBhA5OeRcJud3__iQ";
  const BOT_USERNAME = "FindingExtraOrdinarybot";

  // --- Main App State ---
  const [activeTab, setActiveTab] = useState('home');
  const [balanceBDT, setBalanceBDT] = useState(145.50); // Balance in BDT
  const [coins, setCoins] = useState(14550); // 100 Coins = 1 BDT
  const [adsWatchedToday, setAdsWatchedToday] = useState(12);
  const dailyAdLimit = 30; // Strictly 30 Ads/day
  const [claimedDailyReward, setClaimedDailyReward] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Adsgram Financial Logic (Adsgram Yield 50% Share System)
  // Assuming estimated yield per ad view = 1.00 BDT equivalent, user gets 0.50 BDT (50 coins)
  const adUserSharePercent = 50;
  const rewardPerAdCoins = 50; 
  const rewardPerAdBDT = 0.50;

  // Referral System State
  const [copiedLink, setCopiedLink] = useState(false);
  const userTgId = "9982410";
  const referralLink = `https://t.me/${BOT_USERNAME}?start=ref_${userTgId}`;

  // Ad Simulation State
  const [isAdModalOpen, setIsAdModalOpen] = useState(false);
  const [adTimer, setAdTimer] = useState(15);
  const [isAdPlaying, setIsAdPlaying] = useState(false);
  const [canClaimAdReward, setCanClaimAdReward] = useState(false);
  const [captchaTarget, setCaptchaTarget] = useState(null);
  const [captchaSelected, setCaptchaSelected] = useState(null);
  const [captchaVerified, setCaptchaVerified] = useState(false);

  // Withdraw Modal State (bKash & Nagad ONLY)
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('bKash'); // 'bKash' or 'Nagad'
  const [accountNumber, setAccountNumber] = useState('');
  const [withdrawAmountBDT, setWithdrawAmountBDT] = useState('100');
  const [withdrawHistory, setWithdrawHistory] = useState([
    { id: 'FXO-8821', date: '2026-10-24', method: 'bKash', amount: '৳১০০', status: 'সম্পন্ন' },
    { id: 'FXO-7719', date: '2026-10-21', method: 'Nagad', amount: '৳১৫০', status: 'সম্পন্ন' }
  ]);

  // Deployment Guide Drawer State
  const [isGithubGuideOpen, setIsGithubGuideOpen] = useState(false);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState(null);
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // --- Ad Watch Logic ---
  const startAdWatch = () => {
    if (adsWatchedToday >= dailyAdLimit) {
      showToast("❌ আজ ৩০টি অ্যাড দেখার দৈনিক লিমিট শেষ! আগামীকাল আবার দেখুন।");
      return;
    }
    setIsAdModalOpen(true);
    setIsAdPlaying(true);
    setAdTimer(15);
    setCanClaimAdReward(false);
    setCaptchaVerified(false);
    setCaptchaSelected(null);
    
    const options = ['⚡', '💎', '🚀', '🔥'];
    setCaptchaTarget(options[Math.floor(Math.random() * options.length)]);
  };

  useEffect(() => {
    let interval = null;
    if (isAdPlaying && adTimer > 0) {
      interval = setInterval(() => {
        setAdTimer((prev) => prev - 1);
      }, 1000);
    } else if (adTimer === 0 && isAdPlaying) {
      setIsAdPlaying(false);
      setCanClaimAdReward(true);
    }
    return () => clearInterval(interval);
  }, [isAdPlaying, adTimer]);

  const claimAdReward = () => {
    if (!captchaVerified) {
      showToast("⚠️ সঠিক সিম্বলে ক্লিক করে রোবট ভেরিফিকেশন সম্পন্ন করুন!");
      return;
    }
    setCoins((prev) => prev + rewardPerAdCoins);
    setBalanceBDT((prev) => prev + rewardPerAdBDT);
    setAdsWatchedToday((prev) => prev + 1);
    setIsAdModalOpen(false);
    showToast(`🎉 অভিনন্দন! ৳${rewardPerAdBDT.toFixed(2)} টাকা সফলভাবে জমা হয়েছে!`);
  };

  const handleClaimDailyReward = () => {
    if (!claimedDailyReward) {
      setCoins((prev) => prev + 200);
      setBalanceBDT((prev) => prev + 2.00);
      setClaimedDailyReward(true);
      showToast("🎁 দৈনিক ৳২.০০ টাকা ক্লাইম বোনাস যোগ হয়েছে!");
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(referralLink);
    setCopiedLink(true);
    showToast("✅ রেফারেল লিংক কপি করা হয়েছে!");
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleShareTelegram = () => {
    const shareText = encodeURIComponent(`🔥 FXO অ্যাপে প্রতিদিন ভিডিও অ্যাড দেখে বিকাশে ইনকাম করুন! আমার লিংকে জয়েন করুন: ${referralLink}`);
    window.open(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${shareText}`, '_blank');
  };

  const handleWithdrawSubmit = (e) => {
    e.preventDefault();
    const amountNum = parseFloat(withdrawAmountBDT);

    if (amountNum < 50) {
      showToast("⚠️ সর্বনিম্ন ৫০ টাকা উইথড্র করা যাবে!");
      return;
    }
    if (balanceBDT < amountNum) {
      showToast("⚠️ আপনার অ্যাকাউন্টে পর্যাপ্ত ব্যালেন্স নেই!");
      return;
    }
    if (!accountNumber || accountNumber.length < 11) {
      showToast("⚠️ সঠিক বিকাশ/নগদ ১১ ডিজিটের নম্বর লিখুন!");
      return;
    }

    const newTxn = {
      id: `FXO-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
      method: selectedMethod,
      amount: `৳${amountNum}`,
      status: 'প্রসেসিং'
    };

    setWithdrawHistory([newTxn, ...withdrawHistory]);
    setBalanceBDT((prev) => prev - amountNum);
    setCoins((prev) => prev - (amountNum * 100));
    setIsWithdrawModalOpen(false);
    setAccountNumber('');
    showToast("✅ উইথড্র রিকোয়েস্ট জমা হয়েছে! এডমিন শীঘ্রই পেমেন্ট করবে।");
  };

  return (
    <div className="bg-gradient-to-b from-[#0a051b] via-[#0f172a] to-[#040914] text-white min-h-screen font-sans flex flex-col justify-between max-w-md mx-auto relative overflow-hidden select-none shadow-2xl border-x border-fuchsia-500/20">

      {/* Dynamic Background Glowing Spheres */}
      <div className="absolute top-[-50px] left-[-50px] w-64 h-64 bg-fuchsia-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-20 right-[-50px] w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* --- Toast Banner --- */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-gradient-to-r from-fuchsia-600 to-amber-500 text-white text-xs font-bold px-5 py-3 rounded-full shadow-2xl border border-white/30 animate-bounce flex items-center gap-2 max-w-[90%] text-center">
          <Sparkles className="w-4 h-4 shrink-0 text-yellow-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* --- TOP VIBRANT HEADER --- */}
      <div className="bg-white/5 backdrop-blur-xl border-b border-white/10 p-4 rounded-b-3xl relative z-10 shadow-lg">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo & Telegram Profile */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-400 via-fuchsia-500 to-cyan-400 p-0.5 shadow-lg shadow-fuchsia-500/30 animate-pulse">
                <div className="w-full h-full bg-[#0d0722] rounded-[14px] flex items-center justify-center font-black text-base text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-400 to-cyan-300">
                  FXO
                </div>
              </div>
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-[#0a051b] rounded-full"></span>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-sm tracking-wide text-white">FXO EARN BOT</span>
                <span className="bg-gradient-to-r from-amber-500 to-pink-500 text-black text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest shadow">
                  OFFICIAL
                </span>
              </div>
              <p className="text-[11px] text-cyan-300 font-medium">@FindingExtraOrdinarybot</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setIsGithubGuideOpen(true)} 
              className="p-2 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 hover:bg-purple-500/30 transition flex items-center gap-1 text-[11px] font-bold"
              title="GitHub Deployment Guide"
            >
              <Code className="w-3.5 h-3.5" />
              <span>কোড</span>
            </button>
            <button 
              onClick={() => setSoundEnabled(!soundEnabled)} 
              className="p-2 rounded-xl bg-white/10 border border-white/10 text-gray-300 hover:bg-white/20 transition"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4 text-gray-500" />}
            </button>
          </div>
        </div>

        {/* --- Dynamic Balance Display Card --- */}
        <div className="mt-4 bg-gradient-to-r from-fuchsia-950/80 via-purple-900/60 to-slate-900/90 p-4 rounded-2xl border border-fuchsia-500/40 shadow-xl relative overflow-hidden backdrop-blur-md">
          <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-amber-400/10 rounded-full blur-2xl pointer-events-none"></div>
          
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-fuchsia-300 font-bold uppercase tracking-wider">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>বর্তমান ইনকাম ব্যালেন্স</span>
              </div>
              <div className="flex items-baseline space-x-2 mt-1">
                <span className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-emerald-300 to-cyan-300">
                  ৳{balanceBDT.toFixed(2)}
                </span>
                <span className="text-xs font-semibold text-emerald-400">টাকা</span>
              </div>
              <p className="text-[11px] text-gray-400 mt-1">মোট কয়েন: <span className="text-yellow-300 font-bold">{coins.toLocaleString()}</span> Coins</p>
            </div>

            <button 
              onClick={() => setActiveTab('wallet')}
              className="bg-gradient-to-r from-emerald-400 to-cyan-500 hover:from-emerald-500 hover:to-cyan-600 text-slate-950 text-xs font-black px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 active:scale-95 transition"
            >
              <Wallet className="w-4 h-4" />
              উইথড্র
            </button>
          </div>
        </div>
      </div>

      {/* --- MAIN INTERACTIVE CONTENT AREA --- */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 z-10">

        {/* ================= HOME TAB ================= */}
        {activeTab === 'home' && (
          <div className="space-y-4">

            {/* Daily Streak Check-in */}
            <div className="bg-gradient-to-r from-purple-900/40 to-slate-900/60 border border-purple-500/30 p-3.5 rounded-2xl flex items-center justify-between backdrop-blur-sm">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-amber-400/20 text-amber-300 rounded-xl border border-amber-400/30">
                  <Gift className="w-5 h-5 animate-bounce" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">দৈনিক ফ্রি বোনাস</h4>
                  <p className="text-[11px] text-gray-400">প্রতিদিন লগইন করলেই +৳২.০০ টাকা</p>
                </div>
              </div>

              <button
                onClick={handleClaimDailyReward}
                disabled={claimedDailyReward}
                className={`text-xs font-black px-4 py-2 rounded-xl transition ${
                  claimedDailyReward 
                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700' 
                    : 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 shadow-md shadow-yellow-500/20 hover:scale-105 active:scale-95'
                }`}
              >
                {claimedDailyReward ? 'ক্লাইমড' : 'ক্লাইম করুন'}
              </button>
            </div>

            {/* Adsgram Featured Ad Banner */}
            <div className="bg-gradient-to-br from-fuchsia-600/30 via-purple-900/40 to-cyan-900/30 p-5 rounded-3xl border border-fuchsia-400/50 shadow-2xl relative overflow-hidden backdrop-blur-md">
              <div className="absolute top-0 right-0 w-36 h-36 bg-fuchsia-500/20 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="space-y-3 relative z-10">
                <div className="flex items-center justify-between">
                  <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-black text-[10px] font-black px-2.5 py-1 rounded-full tracking-wider uppercase shadow">
                    Adsgram Monetized
                  </span>
                  <span className="text-[11px] font-bold text-cyan-300 flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5" /> High CPM Yield
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-black text-white">ভিডিও অ্যাড দেখে ইনকাম</h3>
                  <p className="text-xs text-gray-300 mt-1">
                    Adsgram নেটওয়ার্কের প্রতিটি অ্যাডে পাবেন <span className="text-amber-300 font-bold">৫০% রিওয়ার্ড শেয়ার (৳০.৫০/অ্যাড)</span>।
                  </p>
                </div>
                
                <button 
                  onClick={startAdWatch}
                  disabled={adsWatchedToday >= dailyAdLimit}
                  className={`w-full py-3.5 rounded-2xl font-black text-sm flex items-center justify-center space-x-2 shadow-xl transition transform active:scale-95 ${
                    adsWatchedToday >= dailyAdLimit
                      ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
                      : 'bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-slate-950 hover:brightness-110 shadow-emerald-400/20'
                  }`}
                >
                  <Play className="w-5 h-5 fill-current" />
                  <span>{adsWatchedToday >= dailyAdLimit ? 'আজকের লিমিট শেষ' : 'অ্যাড প্লে করুন (৳০.৫০)'}</span>
                </button>
              </div>
            </div>

            {/* Daily Ad Limit Progress Tracker (Strict 30 Limit) */}
            <div className="bg-slate-900/70 p-4 rounded-2xl border border-white/10 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-300 font-medium flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" /> আজকের অ্যাড দেখার লিমিট
                </span>
                <span className="font-extrabold text-amber-400">{adsWatchedToday} / {dailyAdLimit} টি</span>
              </div>
              
              <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden p-0.5 border border-white/5">
                <div 
                  className="bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-400 h-full rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${(adsWatchedToday / dailyAdLimit) * 100}%` }}
                ></div>
              </div>
              <p className="text-[10px] text-gray-400 text-right">প্রতিদিন সর্বোচ্চ ৩০টি অ্যাড অনুমোদিত</p>
            </div>

            {/* Viral Referral Teaser Card */}
            <div className="bg-gradient-to-r from-amber-500/20 to-pink-500/20 border border-amber-500/40 p-4 rounded-2xl flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-black text-amber-300 block">🔥 বন্ধুদের ইনভাইট করুন</span>
                <p className="text-[11px] text-gray-200">১০% লাইফটাইম রেফারেল কমিশন পান!</p>
              </div>
              <button
                onClick={() => setActiveTab('referral')}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black px-3.5 py-2 rounded-xl transition shadow"
              >
                শেয়ার করুন
              </button>
            </div>

          </div>
        )}

        {/* ================= ADS TAB ================= */}
        {activeTab === 'ads' && (
          <div className="space-y-4">
            <div className="text-center py-2 space-y-1">
              <h2 className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-fuchsia-400">
                Adsgram ভিডিও অ্যাড সেন্টার
              </h2>
              <p className="text-xs text-gray-300">অ্যাডটি সম্পূর্ণ ১৫ সেকেন্ড দেখুন এবং সঠিক সিম্বলে ক্লিক করুন</p>
            </div>

            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="bg-slate-900/80 p-4 rounded-2xl border border-white/10 flex items-center justify-between hover:border-fuchsia-500/50 transition shadow-md">
                  <div className="flex items-center space-x-3">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-fuchsia-500 to-cyan-400 p-0.5 shadow">
                      <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-cyan-300">
                        <Play className="w-5 h-5 fill-current" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Adsgram ভিডিও অ্যাড #{item}</h4>
                      <p className="text-[11px] text-gray-400">সময়: ১৫ সেকেন্ড • রিওয়ার্ড: ৳০.৫০ (৫০ Coins)</p>
                    </div>
                  </div>

                  <button 
                    onClick={startAdWatch}
                    disabled={adsWatchedToday >= dailyAdLimit}
                    className={`text-xs font-black px-4 py-2.5 rounded-xl transition shadow active:scale-95 ${
                      adsWatchedToday >= dailyAdLimit 
                        ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 hover:brightness-110'
                    }`}
                  >
                    দেখুন
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-fuchsia-950/30 p-4 rounded-2xl border border-fuchsia-500/30 text-[11px] text-gray-300 space-y-1.5 leading-relaxed">
              <div className="font-bold text-amber-300 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Adsgram পেআউট রুলস:
              </div>
              <p>১. প্রতি অ্যাডে Adsgram এর অফিশিয়াল মোট আয়ের ৫০% ইউজার সরাসরি পাবেন।</p>
              <p>২. অটো-বোট বা ভিপিএন ব্যবহার করলে টেলিগ্রাম আইডি স্থায়ীভাবে সাসপেন্ড করা হবে।</p>
            </div>
          </div>
        )}

        {/* ================= REFERRAL TAB ================= */}
        {activeTab === 'referral' && (
          <div className="space-y-4">
            
            {/* Viral Growth Banner */}
            <div className="bg-gradient-to-br from-amber-500/30 via-purple-900/50 to-fuchsia-900/40 p-5 rounded-3xl border border-amber-400/50 text-center space-y-3 shadow-2xl">
              <div className="w-14 h-14 bg-gradient-to-tr from-amber-400 to-orange-500 text-slate-950 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-amber-500/30">
                <Users className="w-7 h-7" />
              </div>

              <div>
                <h3 className="text-xl font-black text-white">বন্ধুদের ইনভাইট করুন!</h3>
                <div className="mt-1 bg-amber-400 text-slate-950 font-black text-xs px-3 py-1 rounded-full inline-block shadow">
                  🔥 ১০% রেফারেল কমিশন পাবেন!
                </div>
              </div>

              <p className="text-xs text-gray-200 leading-relaxed max-w-xs mx-auto">
                আপনার রেফারেল লিংক দিয়ে বন্ধুবান্ধব ও গ্রুপে শেয়ার করুন। আপনার বন্ধুরা অ্যাড দেখলেই আপনি পাবেন ১০% পর্যন্ত ইনস্ট্যান্ট কমিশন!
              </p>
            </div>

            {/* Referral Link Box */}
            <div className="bg-slate-900/80 p-4 rounded-2xl border border-white/10 space-y-2">
              <label className="text-xs text-cyan-300 font-bold block">আপনার ইউনিক রেফারেল লিংক</label>
              
              <div className="flex items-center space-x-2">
                <input 
                  type="text" 
                  readOnly 
                  value={referralLink} 
                  className="bg-slate-950 text-gray-300 text-xs px-3 py-3 rounded-xl border border-white/10 flex-1 outline-none select-all font-mono"
                />
                <button 
                  onClick={handleCopyLink}
                  className="bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 p-3 rounded-xl transition active:scale-95 shadow font-bold"
                  title="Copy Link"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleShareTelegram}
                className="w-full mt-2 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-slate-950 font-black text-xs py-3 rounded-xl flex items-center justify-center space-x-2 shadow-lg transition active:scale-95"
              >
                <Send className="w-4 h-4 fill-current" />
                <span>টেলিগ্রামে বন্ধুদের শেয়ার করুন</span>
              </button>
            </div>

            {/* Invited Members Preview List */}
            <div className="bg-slate-900/80 p-4 rounded-2xl border border-white/10 space-y-3">
              <h4 className="text-xs font-bold text-gray-200">আপনার আমন্ত্রিত টিম (৫ জন)</h4>
              <div className="space-y-2">
                {[
                  { user: '@sakib_55', date: 'আজকে', status: '১০% একটিভ' },
                  { user: '@tariq_bd', date: 'গতকাল', status: '১০% একটিভ' },
                  { user: '@monir_pro', date: '২৩ অক্টোবর', status: '১০% একটিভ' }
                ].map((item, index) => (
                  <div key={index} className="bg-slate-950 p-2.5 rounded-xl flex justify-between items-center text-xs">
                    <span className="text-gray-300 font-medium">{item.user}</span>
                    <span className="text-amber-400 font-bold bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20">
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ================= WALLET TAB (ONLY BKASH & NAGAD) ================= */}
        {activeTab === 'wallet' && (
          <div className="space-y-4">

            {/* Dynamic Withdrawal Box */}
            <div className="bg-gradient-to-br from-slate-900 via-purple-950/40 to-slate-900 p-5 rounded-3xl border border-emerald-500/40 space-y-4 shadow-xl">
              
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <div>
                  <h3 className="text-sm font-black text-white">তাত্ক্ষণিক ক্যাশআউট</h3>
                  <p className="text-[11px] text-gray-400">বিকাশ এবং নগদ এর মাধ্যমে পেমেন্ট নিন</p>
                </div>
                <div className="bg-emerald-400/20 text-emerald-300 text-[10px] font-bold px-2 py-1 rounded-full border border-emerald-400/30">
                  সর্বনিম্ন ৫০ টাকা
                </div>
              </div>

              {/* Progress Bar towards Minimum 50 BDT */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px]">
                  <span className="text-gray-400">উইথড্র টার্গেট (৫০ টাকা)</span>
                  <span className="font-bold text-emerald-400">
                    {Math.min((balanceBDT / 50) * 100, 100).toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden p-0.5 border border-white/5">
                  <div 
                    className="bg-gradient-to-r from-emerald-400 to-cyan-400 h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((balanceBDT / 50) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>

              <button
                onClick={() => setIsWithdrawModalOpen(true)}
                className="w-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:brightness-110 text-slate-950 font-black text-xs py-3.5 rounded-xl shadow-lg shadow-emerald-400/20 active:scale-95 transition"
              >
                টাকা উত্তোলন করুন (bKash / Nagad)
              </button>
            </div>

            {/* Payment Method Badges */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-pink-950/30 border border-pink-500/40 p-3 rounded-2xl flex items-center space-x-3">
                <div className="w-9 h-9 bg-pink-600 rounded-xl flex items-center justify-center font-black text-white text-xs">
                  bK
                </div>
                <div>
                  <h5 className="text-xs font-bold text-white">বিকাশ (bKash)</h5>
                  <p className="text-[10px] text-pink-300">পার্সোনাল নম্বর</p>
                </div>
              </div>

              <div className="bg-orange-950/30 border border-orange-500/40 p-3 rounded-2xl flex items-center space-x-3">
                <div className="w-9 h-9 bg-orange-600 rounded-xl flex items-center justify-center font-black text-white text-xs">
                  NG
                </div>
                <div>
                  <h5 className="text-xs font-bold text-white">নগদ (Nagad)</h5>
                  <p className="text-[10px] text-orange-300">পার্সোনাল নম্বর</p>
                </div>
              </div>
            </div>

            {/* Transaction History */}
            <div className="bg-slate-900/80 p-4 rounded-2xl border border-white/10 space-y-3">
              <h4 className="text-xs font-bold text-gray-200">সাম্প্রতিক উইথড্রয়াল ইতিহাস</h4>
              <div className="space-y-2">
                {withdrawHistory.map((txn) => (
                  <div key={txn.id} className="bg-slate-950 p-3 rounded-xl flex justify-between items-center text-xs">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className={`font-black ${txn.method === 'bKash' ? 'text-pink-400' : 'text-orange-400'}`}>
                          {txn.method}
                        </span>
                        <span className="text-[10px] text-gray-500">• {txn.date}</span>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-0.5">{txn.id}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-extrabold text-white">{txn.amount}</span>
                      <p className="text-[10px] font-bold text-emerald-400">{txn.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ================= PROFILE TAB ================= */}
        {activeTab === 'profile' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-b from-purple-900/40 to-slate-900/80 p-5 rounded-3xl border border-white/10 text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 via-fuchsia-500 to-cyan-400 p-0.5 mx-auto shadow-lg">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-black text-xl text-yellow-300">
                  FX
                </div>
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">Telegram User</h3>
                <p className="text-xs text-cyan-300">ID: {userTgId}</p>
              </div>
            </div>

            {/* Quick Bot Settings & Info */}
            <div className="bg-slate-900/80 rounded-2xl border border-white/10 divide-y divide-white/5">
              <div className="p-3.5 flex justify-between items-center text-xs">
                <span className="text-gray-300">অফিশিয়াল বোট ইউজারনেম</span>
                <span className="font-mono text-amber-400 font-bold">@{BOT_USERNAME}</span>
              </div>
              <div className="p-3.5 flex justify-between items-center text-xs">
                <span className="text-gray-300">অ্যাড নেটওয়ার্ক</span>
                <span className="font-bold text-cyan-400">Adsgram Yield Direct</span>
              </div>
              <div className="p-3.5 flex justify-between items-center text-xs">
                <span className="text-gray-300">দৈনিক লিমিট</span>
                <span className="font-bold text-emerald-400">৩০টি ভিডিও অ্যাড</span>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ================= AD WATCH MODAL (WITH ANTI-BOT CAPTCHA) ================= */}
      {isAdModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-fuchsia-500/50 rounded-3xl w-full max-w-sm p-5 space-y-4 relative shadow-2xl">
            
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Adsgram Sponsored Video
              </span>
              <div className="bg-slate-950 text-cyan-300 font-mono font-bold text-xs px-3 py-1 rounded-lg border border-cyan-400/30 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 animate-spin text-amber-400" />
                {adTimer}s
              </div>
            </div>

            {/* Dynamic Ad Video Player Visual */}
            <div className="bg-gradient-to-tr from-purple-950 via-slate-950 to-cyan-950 rounded-2xl h-44 flex flex-col items-center justify-center relative overflow-hidden border border-white/10">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              
              <div className="z-10 text-center space-y-2 p-3">
                <Sparkles className="w-8 h-8 text-amber-400 mx-auto animate-pulse" />
                <h4 className="text-xs font-black text-white">Adsgram Video Advertisement</h4>
                <p className="text-[10px] text-gray-300">অ্যাডটি পূর্ণ সময় দেখলে আপনার ব্যালেন্সে ৳০.৫০ জমা হবে।</p>
              </div>

              <span className="absolute bottom-2 left-2 text-[9px] text-gray-400 bg-black/60 px-2 py-0.5 rounded-md">
                Adsgram Partner Network
              </span>
            </div>

            {/* Anti-Bot Captcha Verification */}
            {canClaimAdReward ? (
              <div className="space-y-3 bg-slate-950 p-4 rounded-2xl border border-fuchsia-500/40 text-center">
                <p className="text-xs text-gray-200 font-bold">
                  নিশ্চিত করুন আপনি মানুষ: <span className="text-amber-400 font-black text-sm">{captchaTarget}</span> আইকনে ক্লিক করুন
                </p>

                <div className="flex justify-center space-x-3">
                  {['⚡', '💎', '🚀', '🔥'].map((symbol, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setCaptchaSelected(symbol);
                        if (symbol === captchaTarget) {
                          setCaptchaVerified(true);
                        } else {
                          setCaptchaVerified(false);
                          showToast("❌ ভুল সিম্বল ক্লিক করেছেন!");
                        }
                      }}
                      className={`w-11 h-11 text-xl rounded-xl flex items-center justify-center border transition transform active:scale-90 ${
                        captchaSelected === symbol 
                          ? (symbol === captchaTarget ? 'border-emerald-400 bg-emerald-400/20 shadow-lg' : 'border-red-500 bg-red-500/20')
                          : 'border-white/10 bg-slate-900'
                      }`}
                    >
                      {symbol}
                    </button>
                  ))}
                </div>

                <button
                  onClick={claimAdReward}
                  disabled={!captchaVerified}
                  className={`w-full py-3 rounded-xl font-black text-xs transition shadow-lg ${
                    captchaVerified 
                      ? 'bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 hover:brightness-110' 
                      : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  পুরস্কার ক্লাইম করুন (+৳০.৫০)
                </button>
              </div>
            ) : (
              <p className="text-[11px] text-center text-gray-400 italic">
                টাইমার শেষ হওয়া পর্যন্ত অপেক্ষা করুন...
              </p>
            )}

          </div>
        </div>
      )}

      {/* ================= WITHDRAW MODAL (ONLY BKASH & NAGAD) ================= */}
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-emerald-500/50 rounded-3xl w-full max-w-sm p-5 space-y-4 relative shadow-2xl">
            
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-xs font-black text-white flex items-center gap-1.5">
                <Wallet className="w-4 h-4 text-emerald-400" />
                ক্যাশআউট রিকোয়েস্ট (bKash / Nagad)
              </h3>
              <button onClick={() => setIsWithdrawModalOpen(false)} className="text-gray-400 hover:text-white text-xs font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleWithdrawSubmit} className="space-y-3">
              
              {/* Payment Method Selector */}
              <div>
                <label className="text-[11px] text-gray-300 font-bold block mb-1">পেমেন্ট মেথড নির্বাচন করুন</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('bKash')}
                    className={`py-3 text-xs font-black rounded-xl border flex items-center justify-center space-x-2 transition ${
                      selectedMethod === 'bKash' 
                        ? 'border-pink-500 bg-pink-500/20 text-pink-300 shadow' 
                        : 'border-white/10 bg-slate-950 text-gray-400'
                    }`}
                  >
                    <span>বিকাশ (bKash)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('Nagad')}
                    className={`py-3 text-xs font-black rounded-xl border flex items-center justify-center space-x-2 transition ${
                      selectedMethod === 'Nagad' 
                        ? 'border-orange-500 bg-orange-500/20 text-orange-300 shadow' 
                        : 'border-white/10 bg-slate-950 text-gray-400'
                    }`}
                  >
                    <span>নগদ (Nagad)</span>
                  </button>
                </div>
              </div>

              {/* Mobile Number Input */}
              <div>
                <label className="text-[11px] text-gray-300 font-bold block mb-1">
                  আপনার {selectedMethod} পার্সোনাল মোবাইল নম্বর
                </label>
                <input 
                  type="text"
                  required
                  placeholder="017XXXXXXXX"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-emerald-400 font-mono"
                />
              </div>

              {/* Amount Input */}
              <div>
                <label className="text-[11px] text-gray-300 font-bold block mb-1">উইথড্র অ্যামাউন্ট (টাকা)</label>
                <select 
                  value={withdrawAmountBDT}
                  onChange={(e) => setWithdrawAmountBDT(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-emerald-400 font-bold"
                >
                  <option value="50">৳৫০ টাকা (৫,০০০ Coins)</option>
                  <option value="100">৳১০০ টাকা (১০,০০০ Coins)</option>
                  <option value="200">৳২০০ টাকা (২০,০০০ Coins)</option>
                  <option value="500">৳৫০০ টাকা (৫০,০০০ Coins)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 font-black text-xs py-3.5 rounded-xl transition shadow-lg mt-2 hover:brightness-110 active:scale-95"
              >
                পেমেন্ট রিকোয়েস্ট নিশ্চিত করুন
              </button>
            </form>

          </div>
        </div>
      )}

      {/* ================= GITHUB DEPLOYMENT GUIDE DRAWER ================= */}
      {isGithubGuideOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-purple-500/50 rounded-3xl w-full max-w-sm p-5 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                <Code className="w-4 h-4 text-purple-400" />
                GitHub & Backend Setup Guide
              </h3>
              <button onClick={() => setIsGithubGuideOpen(false)} className="text-gray-400 hover:text-white text-xs font-bold">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-gray-300">
              <div className="bg-slate-950 p-3 rounded-xl border border-white/10 space-y-1 font-mono text-[11px]">
                <p className="text-amber-300 font-bold">bot_token:</p>
                <p className="text-gray-400 break-all">{BOT_TOKEN}</p>
                <p className="text-amber-300 font-bold mt-2">bot_username:</p>
                <p className="text-cyan-300">@{BOT_USERNAME}</p>
              </div>

              <h4 className="font-bold text-white text-xs">গিটহাব ডিপ্লয়মেন্ট স্টেপস:</h4>
              <ol className="list-decimal list-inside space-y-1.5 text-[11px] text-gray-300 leading-relaxed">
                <li>এই রিঅ্যাক্ট কোডটি `src/App.jsx` হিসেবে সংরক্ষণ করুন।</li>
                <li>গিটহাবে একটি নতুন পাবলিক রিকপজিটরি (Repository) তৈরি করুন `fxo-telegram-bot` নামে।</li>
                <li>Vercel বা Render-এ repository কানেক্ট করে Deploy করুন।</li>
                <li>Telegram @BotFather-এ গিয়ে `/setwebapp` সিলেক্ট করে আপনার Vercel URL দিন।</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* --- TELEGRAM STYLE BOTTOM NAVIGATION BAR --- */}
      <div className="bg-slate-950/90 border-t border-white/10 px-2 py-2 flex justify-around items-center sticky bottom-0 z-40 backdrop-blur-lg">
        <button 
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center space-y-1 p-1.5 rounded-xl transition ${
            activeTab === 'home' ? 'text-amber-400 scale-105' : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-bold">হোম</span>
        </button>

        <button 
          onClick={() => setActiveTab('ads')}
          className={`flex flex-col items-center space-y-1 p-1.5 rounded-xl transition ${
            activeTab === 'ads' ? 'text-amber-400 scale-105' : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <Play className="w-5 h-5" />
          <span className="text-[10px] font-bold">অ্যাড</span>
        </button>

        <button 
          onClick={() => setActiveTab('referral')}
          className={`flex flex-col items-center space-y-1 p-1.5 rounded-xl transition ${
            activeTab === 'referral' ? 'text-amber-400 scale-105' : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <Users className="w-5 h-5" />
          <span className="text-[10px] font-bold">রেফার</span>
        </button>

        <button 
          onClick={() => setActiveTab('wallet')}
          className={`flex flex-col items-center space-y-1 p-1.5 rounded-xl transition ${
            activeTab === 'wallet' ? 'text-amber-400 scale-105' : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <Wallet className="w-5 h-5" />
          <span className="text-[10px] font-bold">ওয়ালেট</span>
        </button>

        <button 
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center space-y-1 p-1.5 rounded-xl transition ${
            activeTab === 'profile' ? 'text-amber-400 scale-105' : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-bold">প্রোফাইল</span>
        </button>
      </div>

    </div>
  );
}