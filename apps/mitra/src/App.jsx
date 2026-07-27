import React, { useState, useEffect } from 'react';
import { Home, Package, BookOpen, Camera, Wallet, User, Bell, ChevronRight, ChevronLeft, Check, Clock, AlertCircle, Star, MapPin, Phone, CheckCircle, Circle, Upload, X, Play, Pause, RotateCcw, TrendingUp, Calendar, CreditCard, HelpCircle, Settings, LogOut, Award, Heart, Scissors, Eye, Send, Image, Truck, Gift, Info, ArrowLeft, MessageCircle, Smartphone, ShieldCheck, Banknote, Timer, Target, Sparkles, ThumbsUp, Wifi, Signal, BatteryFull } from 'lucide-react';

// ============================================
// ECOTHREAD MITRA - APLIKASI PENJAHIT
// Design untuk Android (Target: Ibu-ibu Penjahit)
// UI: Simple, Font Besar, Navigasi Mudah
// ============================================

const App = () => {
  // ============================================
  // STATE MANAGEMENT
  // ============================================
  const [activeTab, setActiveTab] = useState('home');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [showNotification, setShowNotification] = useState(true);
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const [currentGuideStep, setCurrentGuideStep] = useState(0);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // User Profile Data
  const [userProfile] = useState({
    name: 'Ibu Siti Aminah',
    phone: '0812-3456-7890',
    location: 'Cigondewah, Bandung',
    rating: 4.9,
    totalOrders: 156,
    memberSince: 'Juni 2025',
    skills: ['Jaket', 'Tas', 'Rompi'],
    bankAccount: 'BCA - 1234****90',
    profileComplete: 95
  });

  // Orders Data
  const [orders, setOrders] = useState([
    {
      id: 'ECO-0089',
      product: 'Jaket Denim Upcycle',
      type: 'Jaket',
      status: 'in_progress',
      progress: 60,
      deadline: '20 Apr 2026',
      daysLeft: 3,
      fee: 125000,
      materials: ['Denim biru 2.5m', 'Resleting YKK 50cm', 'Kancing (6)', 'NFC Tag'],
      size: 'M',
      notes: 'Pelanggan minta kantong tambahan di dalam',
      receivedDate: '14 Apr 2026',
      customerCity: 'Jakarta'
    },
    {
      id: 'ECO-0088',
      product: 'Tas Tote Patchwork',
      type: 'Tas',
      status: 'new',
      progress: 0,
      deadline: '22 Apr 2026',
      daysLeft: 5,
      fee: 95000,
      materials: ['Kain perca campuran 1.5m', 'Tali tas', 'NFC Tag'],
      size: 'Standard',
      notes: 'Desain standar',
      receivedDate: '17 Apr 2026',
      customerCity: 'Bandung'
    },
    {
      id: 'ECO-0085',
      product: 'Rompi Vintage',
      type: 'Rompi',
      status: 'qc_review',
      progress: 100,
      deadline: '18 Apr 2026',
      daysLeft: 1,
      fee: 110000,
      materials: ['Kain wool campuran', 'Kancing kayu (5)', 'NFC Tag'],
      size: 'L',
      notes: 'Sudah dikirim foto untuk QC',
      receivedDate: '10 Apr 2026',
      customerCity: 'Surabaya'
    },
    {
      id: 'ECO-0082',
      product: 'Jaket Kanvas',
      type: 'Jaket',
      status: 'completed',
      progress: 100,
      deadline: '15 Apr 2026',
      daysLeft: 0,
      fee: 130000,
      materials: ['Kanvas coklat 3m', 'Resleting', 'Kancing'],
      size: 'L',
      notes: 'Selesai tepat waktu',
      receivedDate: '8 Apr 2026',
      customerCity: 'Medan',
      completedDate: '14 Apr 2026',
      rating: 5
    },
  ]);

  // Earnings Data
  const [earnings] = useState({
    available: 485000,
    pending: 235000,
    thisMonth: 1250000,
    lastMonth: 980000,
    history: [
      { id: 1, type: 'income', desc: 'Jaket Kanvas #ECO-0082', amount: 130000, date: '15 Apr', status: 'completed' },
      { id: 2, type: 'withdraw', desc: 'Tarik ke BCA', amount: -500000, date: '12 Apr', status: 'success' },
      { id: 3, type: 'income', desc: 'Tas Selempang #ECO-0079', amount: 85000, date: '10 Apr', status: 'completed' },
      { id: 4, type: 'income', desc: 'Rompi Denim #ECO-0076', amount: 110000, date: '8 Apr', status: 'completed' },
      { id: 5, type: 'bonus', desc: 'Bonus Rating Bagus', amount: 50000, date: '5 Apr', status: 'completed' },
    ]
  });

  // Sewing Guide Steps (for Jaket)
  const sewingGuide = [
    {
      step: 1,
      title: 'Siapkan Bahan',
      duration: '10 menit',
      description: 'Bentangkan kain denim di meja yang rata. Pastikan tidak ada lipatan.',
      tips: 'Setrika dulu kalau kusut supaya hasil potongan rapi.',
      image: 'fabric-prep'
    },
    {
      step: 2,
      title: 'Letakkan Pola',
      duration: '15 menit',
      description: 'Tempelkan pola yang sudah dicetak di atas kain. Gunakan jarum pentul untuk menahan.',
      tips: 'Perhatikan arah serat kain, harus sama dengan tanda panah di pola.',
      image: 'pattern-place'
    },
    {
      step: 3,
      title: 'Gunting Kain',
      duration: '20 menit',
      description: 'Gunting mengikuti garis pola. Sisakan 1.5cm untuk jahitan.',
      tips: 'Gunakan gunting kain yang tajam, jangan gunting kertas.',
      image: 'cutting'
    },
    {
      step: 4,
      title: 'Jahit Badan Depan & Belakang',
      duration: '30 menit',
      description: 'Satukan bagian depan dan belakang di bagian bahu dan samping.',
      tips: 'Jahit dengan jarak 1cm dari tepi. Cek dulu dengan jarum pentul.',
      image: 'sewing-body'
    },
    {
      step: 5,
      title: 'Pasang Lengan',
      duration: '25 menit',
      description: 'Jahit lengan membentuk tabung, lalu pasang ke lubang lengan.',
      tips: 'Cocokkan tanda jahitan di lengan dengan bahu.',
      image: 'sleeves'
    },
    {
      step: 6,
      title: 'Pasang Resleting',
      duration: '20 menit',
      description: 'Jahit resleting di bagian depan dengan hati-hati.',
      tips: 'Gunakan sepatu resleting di mesin jahit. Jahit pelan-pelan.',
      image: 'zipper'
    },
    {
      step: 7,
      title: 'Finishing & QC',
      duration: '15 menit',
      description: 'Rapikan semua jahitan, potong benang sisa, setrika hasil akhir.',
      tips: 'Cek semua jahitan kuat, tidak ada yang loncat.',
      image: 'finishing'
    },
  ];

  // ============================================
  // HELPER FUNCTIONS
  // ============================================
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID').format(amount);
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      'new': { label: 'Pesanan Baru', color: 'bg-blue-500', textColor: 'text-blue-600', bgLight: 'bg-blue-50', icon: Package },
      'in_progress': { label: 'Dikerjakan', color: 'bg-amber-500', textColor: 'text-amber-600', bgLight: 'bg-amber-50', icon: Scissors },
      'qc_review': { label: 'Menunggu QC', color: 'bg-purple-500', textColor: 'text-purple-600', bgLight: 'bg-purple-50', icon: Eye },
      'completed': { label: 'Selesai', color: 'bg-emerald-500', textColor: 'text-emerald-600', bgLight: 'bg-emerald-50', icon: CheckCircle },
    };
    return statusMap[status] || statusMap['new'];
  };

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setShowSuccessModal(true);
    setTimeout(() => setShowSuccessModal(false), 2500);
  };

  const acceptOrder = (orderId) => {
    setOrders(orders.map(o => 
      o.id === orderId ? { ...o, status: 'in_progress', progress: 10 } : o
    ));
    showSuccess('Pesanan diterima! Semangat ya Bu! 💪');
    setSelectedOrder(null);
  };

  const updateProgress = (orderId, newProgress) => {
    setOrders(orders.map(o => 
      o.id === orderId ? { ...o, progress: newProgress } : o
    ));
  };

  const submitForQC = (orderId) => {
    if (uploadedPhotos.length < 2) {
      alert('Minimal upload 2 foto ya Bu (depan dan belakang)');
      return;
    }
    setOrders(orders.map(o => 
      o.id === orderId ? { ...o, status: 'qc_review', progress: 100 } : o
    ));
    showSuccess('Foto sudah dikirim untuk dicek! 📸');
    setUploadedPhotos([]);
    setActiveTab('home');
    setSelectedOrder(null);
  };

  const simulatePhotoUpload = () => {
    const newPhoto = { id: Date.now(), name: `Foto ${uploadedPhotos.length + 1}` };
    setUploadedPhotos([...uploadedPhotos, newPhoto]);
  };

  // ============================================
  // COMPONENTS
  // ============================================

  // Success Modal
  const SuccessModal = () => (
    showSuccessModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="bg-white rounded-3xl p-8 text-center animate-bounce-in max-w-xs">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={40} className="text-emerald-500" />
          </div>
          <p className="text-xl font-bold text-gray-800">{successMessage}</p>
        </div>
      </div>
    )
  );

  // Header Component
  const Header = ({ title, showBack, onBack, rightAction }) => (
    <div className="bg-emerald-600 text-white px-4 py-4 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-3">
        {showBack && (
          <button onClick={onBack} className="p-2 -ml-2 hover:bg-emerald-700 rounded-full">
            <ArrowLeft size={24} />
          </button>
        )}
        <h1 className="text-xl font-bold">{title}</h1>
      </div>
      {rightAction}
    </div>
  );

  // ============================================
  // TAB VIEWS
  // ============================================

  // HOME TAB
  const HomeView = () => {
    const newOrders = orders.filter(o => o.status === 'new');
    const activeOrders = orders.filter(o => o.status === 'in_progress' || o.status === 'qc_review');
    
    return (
      <div className="pb-24">
        {/* Welcome Header */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-600 text-white px-5 pt-6 pb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-emerald-100 text-base">Assalamualaikum,</p>
              <h1 className="text-2xl font-bold">{userProfile.name}</h1>
            </div>
            <button 
              onClick={() => setShowNotification(!showNotification)}
              className="relative p-3 bg-white/20 rounded-full"
            >
              <Bell size={24} />
              {newOrders.length > 0 && (
                <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full text-xs flex items-center justify-center font-bold">
                  {newOrders.length}
                </span>
              )}
            </button>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/20 rounded-2xl p-3 text-center">
              <p className="text-3xl font-bold">{userProfile.totalOrders}</p>
              <p className="text-emerald-100 text-sm">Total Order</p>
            </div>
            <div className="bg-white/20 rounded-2xl p-3 text-center">
              <div className="flex items-center justify-center gap-1">
                <Star size={20} className="text-yellow-300 fill-yellow-300" />
                <span className="text-3xl font-bold">{userProfile.rating}</span>
              </div>
              <p className="text-emerald-100 text-sm">Rating</p>
            </div>
            <div className="bg-white/20 rounded-2xl p-3 text-center">
              <p className="text-2xl font-bold">Rp{formatCurrency(earnings.available / 1000)}K</p>
              <p className="text-emerald-100 text-sm">Saldo</p>
            </div>
          </div>
        </div>

        {/* New Order Notification */}
        {showNotification && newOrders.length > 0 && (
          <div className="mx-4 -mt-4 mb-4">
            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 relative">
              <button 
                onClick={() => setShowNotification(false)}
                className="absolute top-2 right-2 p-1 text-blue-400"
              >
                <X size={20} />
              </button>
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Gift size={24} className="text-white" />
                </div>
                <div>
                  <p className="font-bold text-blue-800 text-lg">Ada Pesanan Baru! 🎉</p>
                  <p className="text-blue-600 text-base mt-1">
                    {newOrders.length} pesanan menunggu konfirmasi Ibu
                  </p>
                  <button 
                    onClick={() => setActiveTab('orders')}
                    className="mt-2 text-blue-700 font-bold text-base flex items-center gap-1"
                  >
                    Lihat Sekarang <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Active Orders */}
        <div className="px-4 mt-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold text-gray-800">Pesanan Aktif</h2>
            <button 
              onClick={() => setActiveTab('orders')}
              className="text-emerald-600 font-semibold flex items-center text-base"
            >
              Lihat Semua <ChevronRight size={20} />
            </button>
          </div>
          
          {activeOrders.length === 0 ? (
            <div className="bg-gray-50 rounded-2xl p-8 text-center">
              <Package size={48} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-lg">Belum ada pesanan aktif</p>
              <p className="text-gray-400 text-base mt-1">Pesanan baru akan muncul di sini</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeOrders.slice(0, 2).map(order => {
                const statusInfo = getStatusInfo(order.status);
                return (
                  <button
                    key={order.id}
                    onClick={() => { setSelectedOrder(order); setActiveTab('orders'); }}
                    className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-left"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-bold text-gray-800 text-lg">{order.product}</p>
                        <p className="text-gray-500 text-base">#{order.id}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusInfo.bgLight} ${statusInfo.textColor}`}>
                        {statusInfo.label}
                      </span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mb-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-500">Progress</span>
                        <span className="font-bold text-emerald-600">{order.progress}%</span>
                      </div>
                      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500 rounded-full transition-all"
                          style={{ width: `${order.progress}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-base">
                      <div className="flex items-center gap-1 text-gray-500">
                        <Clock size={16} />
                        <span>Deadline: {order.deadline}</span>
                      </div>
                      <span className={`font-bold ${order.daysLeft <= 2 ? 'text-red-500' : 'text-gray-600'}`}>
                        {order.daysLeft} hari lagi
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="px-4 mt-6">
          <h2 className="text-xl font-bold text-gray-800 mb-3">Menu Cepat</h2>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => setActiveTab('guide')}
              className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-5 text-left"
            >
              <BookOpen size={32} className="mb-2" />
              <p className="font-bold text-lg">Panduan Jahit</p>
              <p className="text-purple-100 text-sm mt-1">Lihat cara menjahit</p>
            </button>
            <button 
              onClick={() => setActiveTab('camera')}
              className="bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-2xl p-5 text-left"
            >
              <Camera size={32} className="mb-2" />
              <p className="font-bold text-lg">Kirim Foto</p>
              <p className="text-amber-100 text-sm mt-1">Upload hasil jahitan</p>
            </button>
            <button 
              onClick={() => setActiveTab('wallet')}
              className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-2xl p-5 text-left"
            >
              <Wallet size={32} className="mb-2" />
              <p className="font-bold text-lg">Penghasilan</p>
              <p className="text-emerald-100 text-sm mt-1">Cek & tarik saldo</p>
            </button>
            <button 
              onClick={() => setActiveTab('profile')}
              className="bg-gradient-to-br from-gray-600 to-gray-700 text-white rounded-2xl p-5 text-left"
            >
              <User size={32} className="mb-2" />
              <p className="font-bold text-lg">Profil Saya</p>
              <p className="text-gray-300 text-sm mt-1">Lihat data diri</p>
            </button>
          </div>
        </div>

        {/* Tips */}
        <div className="px-4 mt-6 mb-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Sparkles size={20} className="text-white" />
              </div>
              <div>
                <p className="font-bold text-emerald-800">Tips Hari Ini 💡</p>
                <p className="text-emerald-700 text-base mt-1">
                  Jangan lupa foto hasil jahitan dari berbagai sudut ya Bu, biar lolos QC lebih cepat!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ORDERS TAB
  const OrdersView = () => {
    const [filter, setFilter] = useState('all');
    
    const filteredOrders = filter === 'all' 
      ? orders 
      : orders.filter(o => o.status === filter);

    if (selectedOrder) {
      return <OrderDetailView order={selectedOrder} onBack={() => setSelectedOrder(null)} />;
    }

    return (
      <div className="pb-24">
        <Header title="Pesanan Saya" />
        
        {/* Filter Tabs */}
        <div className="px-4 py-3 bg-white border-b border-gray-100 sticky top-16 z-30">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {[
              { id: 'all', label: 'Semua' },
              { id: 'new', label: 'Baru' },
              { id: 'in_progress', label: 'Dikerjakan' },
              { id: 'qc_review', label: 'Review' },
              { id: 'completed', label: 'Selesai' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-4 py-2 rounded-full text-base font-semibold whitespace-nowrap transition-all ${
                  filter === tab.id 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        <div className="p-4 space-y-3">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <Package size={64} className="text-gray-200 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Tidak ada pesanan</p>
            </div>
          ) : (
            filteredOrders.map(order => {
              const statusInfo = getStatusInfo(order.status);
              const StatusIcon = statusInfo.icon;
              return (
                <button
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-left"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${statusInfo.bgLight}`}>
                      <StatusIcon size={28} className={statusInfo.textColor} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-bold text-gray-800 text-lg">{order.product}</p>
                          <p className="text-gray-500 text-base">#{order.id} • {order.size}</p>
                        </div>
                        <ChevronRight size={24} className="text-gray-300" />
                      </div>
                      
                      <div className="flex items-center justify-between mt-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusInfo.bgLight} ${statusInfo.textColor}`}>
                          {statusInfo.label}
                        </span>
                        <span className="font-bold text-emerald-600 text-lg">
                          Rp{formatCurrency(order.fee)}
                        </span>
                      </div>
                      
                      {order.status !== 'completed' && (
                        <div className="mt-3 flex items-center gap-2 text-base">
                          <Clock size={16} className="text-gray-400" />
                          <span className="text-gray-500">Deadline: {order.deadline}</span>
                          {order.daysLeft <= 2 && (
                            <span className="text-red-500 font-bold">({order.daysLeft} hari!)</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    );
  };

  // ORDER DETAIL VIEW
  const OrderDetailView = ({ order, onBack }) => {
    const statusInfo = getStatusInfo(order.status);
    const [localProgress, setLocalProgress] = useState(order.progress);

    return (
      <div className="pb-24">
        <Header 
          title={`Pesanan #${order.id}`} 
          showBack 
          onBack={onBack}
        />
        
        <div className="p-4 space-y-4">
          {/* Status Card */}
          <div className={`${statusInfo.bgLight} rounded-2xl p-5 border-2 ${statusInfo.textColor.replace('text', 'border')}`}>
            <div className="flex items-center gap-3">
              <div className={`w-14 h-14 rounded-full ${statusInfo.color} flex items-center justify-center`}>
                {React.createElement(statusInfo.icon, { size: 28, className: "text-white" })}
              </div>
              <div>
                <p className={`font-bold text-xl ${statusInfo.textColor}`}>{statusInfo.label}</p>
                <p className="text-gray-600 text-base">
                  {order.status === 'new' && 'Menunggu konfirmasi Ibu'}
                  {order.status === 'in_progress' && `Progress: ${order.progress}%`}
                  {order.status === 'qc_review' && 'Sedang dicek tim EcoThread'}
                  {order.status === 'completed' && 'Pesanan sudah selesai'}
                </p>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 text-lg mb-4">Detail Produk</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500 text-base">Nama Produk</span>
                <span className="font-semibold text-gray-800 text-base">{order.product}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 text-base">Ukuran</span>
                <span className="font-semibold text-gray-800 text-base">{order.size}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 text-base">Tujuan</span>
                <span className="font-semibold text-gray-800 text-base">{order.customerCity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 text-base">Deadline</span>
                <span className={`font-bold text-base ${order.daysLeft <= 2 ? 'text-red-500' : 'text-gray-800'}`}>
                  {order.deadline} ({order.daysLeft} hari)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 text-base">Upah</span>
                <span className="font-bold text-emerald-600 text-xl">Rp{formatCurrency(order.fee)}</span>
              </div>
            </div>
          </div>

          {/* Materials */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 text-lg mb-4">Bahan yang Diterima 📦</h3>
            <div className="space-y-2">
              {order.materials.map((material, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <CheckCircle size={20} className="text-emerald-500" />
                  <span className="text-gray-700 text-base">{material}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="bg-amber-50 rounded-2xl p-5 border border-amber-200">
              <h3 className="font-bold text-amber-800 text-lg mb-2">📝 Catatan Khusus</h3>
              <p className="text-amber-700 text-base">{order.notes}</p>
            </div>
          )}

          {/* Progress Update (for in_progress orders) */}
          {order.status === 'in_progress' && (
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-800 text-lg mb-4">Update Progress</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600 text-base">Progress saat ini</span>
                    <span className="font-bold text-emerald-600 text-xl">{localProgress}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="10"
                    value={localProgress}
                    onChange={(e) => setLocalProgress(parseInt(e.target.value))}
                    className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer accent-emerald-500"
                  />
                  <div className="flex justify-between text-sm text-gray-400 mt-1">
                    <span>Mulai</span>
                    <span>Selesai</span>
                  </div>
                </div>
                
                {localProgress !== order.progress && (
                  <button
                    onClick={() => {
                      updateProgress(order.id, localProgress);
                      showSuccess('Progress berhasil diupdate! 👍');
                    }}
                    className="w-full py-4 bg-emerald-500 text-white rounded-xl font-bold text-lg"
                  >
                    Simpan Progress
                  </button>
                )}

                {localProgress === 100 && (
                  <button
                    onClick={() => setActiveTab('camera')}
                    className="w-full py-4 bg-amber-500 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2"
                  >
                    <Camera size={24} />
                    Foto & Kirim untuk QC
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Accept Button (for new orders) */}
          {order.status === 'new' && (
            <div className="space-y-3">
              <button
                onClick={() => acceptOrder(order.id)}
                className="w-full py-5 bg-emerald-500 hover:bg-emerald-600 transition-colors text-white rounded-2xl font-bold text-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-200"
              >
                <Scissors size={28} />
                Terima & Mulai Menjahit
              </button>
              <button
                onClick={() => setActiveTab('guide')}
                className="w-full py-4 bg-purple-100/80 hover:bg-purple-200 text-purple-700 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-colors"
              >
                <BookOpen size={24} />
                Lihat Panduan 3D Dulu
              </button>
            </div>
          )}

          {/* Completed Rating */}
          {order.status === 'completed' && order.rating && (
            <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-200">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-800 text-lg">Rating Pelanggan</span>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={24} 
                      className={i < order.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} 
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // GUIDE TAB
  const GuideView = () => {
    if (selectedGuide !== null) {
      return <GuideStepView />;
    }

    return (
      <div className="pb-24">
        <Header title="Panduan Jahit" />
        
        <div className="p-4">
          {/* Guide Categories */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { type: 'Jaket', icon: '🧥', color: 'from-blue-500 to-blue-600' },
              { type: 'Tas', icon: '👜', color: 'from-pink-500 to-pink-600' },
              { type: 'Rompi', icon: '🦺', color: 'from-amber-500 to-amber-600' },
              { type: 'Kemeja', icon: '👔', color: 'from-purple-500 to-purple-600' },
            ].map(item => (
              <button
                key={item.type}
                onClick={() => { setSelectedGuide(item.type); setCurrentGuideStep(0); }}
                className={`bg-gradient-to-br ${item.color} text-white rounded-2xl p-5 text-left`}
              >
                <span className="text-4xl">{item.icon}</span>
                <p className="font-bold text-lg mt-2">Cara Jahit {item.type}</p>
                <p className="text-white/80 text-sm">{sewingGuide.length} langkah</p>
              </button>
            ))}
          </div>

          {/* Tips Section */}
          <div className="bg-purple-50 rounded-2xl p-5 border border-purple-200">
            <h3 className="font-bold text-purple-800 text-lg mb-3">💡 Tips Umum</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-purple-700 text-base">
                <CheckCircle size={18} className="text-purple-500 mt-0.5 flex-shrink-0" />
                <span>Selalu cek mesin jahit sebelum mulai</span>
              </li>
              <li className="flex items-start gap-2 text-purple-700 text-base">
                <CheckCircle size={18} className="text-purple-500 mt-0.5 flex-shrink-0" />
                <span>Pastikan benang cukup untuk satu produk</span>
              </li>
              <li className="flex items-start gap-2 text-purple-700 text-base">
                <CheckCircle size={18} className="text-purple-500 mt-0.5 flex-shrink-0" />
                <span>Setrika kain dulu sebelum dipotong</span>
              </li>
              <li className="flex items-start gap-2 text-purple-700 text-base">
                <CheckCircle size={18} className="text-purple-500 mt-0.5 flex-shrink-0" />
                <span>Foto tiap tahap untuk dokumentasi</span>
              </li>
            </ul>
          </div>

          {/* Video Tutorial Placeholder */}
          <div className="mt-4 bg-gray-100 rounded-2xl p-6 text-center">
            <Play size={48} className="text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 text-lg font-medium">Video Tutorial</p>
            <p className="text-gray-400 text-base">Segera hadir</p>
          </div>
        </div>
      </div>
    );
  };

  // GUIDE STEP VIEW
  const GuideStepView = () => {
    const currentStep = sewingGuide[currentGuideStep];
    
    return (
      <div className="pb-24">
        <Header 
          title={`Panduan Jahit ${selectedGuide}`}
          showBack
          onBack={() => setSelectedGuide(null)}
        />
        
        {/* Progress Indicator */}
        <div className="px-4 py-3 bg-white border-b border-gray-100">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600 text-base">Langkah {currentGuideStep + 1} dari {sewingGuide.length}</span>
            <span className="text-emerald-600 font-bold">{Math.round(((currentGuideStep + 1) / sewingGuide.length) * 100)}%</span>
          </div>
          <div className="flex gap-1">
            {sewingGuide.map((_, idx) => (
              <div 
                key={idx}
                className={`h-2 flex-1 rounded-full ${idx <= currentGuideStep ? 'bg-emerald-500' : 'bg-gray-200'}`}
              />
            ))}
          </div>
        </div>

        <div className="p-4">
          {/* Step Card */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            {/* 3D Interactive AI Guide Mockup */}
            <div className="relative h-64 bg-slate-900 overflow-hidden flex items-center justify-center">
              {/* Grid Background */}
              <div 
                className="absolute inset-0 opacity-20" 
                style={{ 
                  backgroundImage: 'linear-gradient(#4f46e5 1px, transparent 1px), linear-gradient(90deg, #4f46e5 1px, transparent 1px)', 
                  backgroundSize: '20px 20px' 
                }}
              ></div>
              
              {/* Animating Asset */}
              <div className="z-10 text-center animate-pulse flex flex-col items-center">
                <span className="text-6xl drop-shadow-[0_0_15px_rgba(167,139,250,0.8)]">
                  {currentGuideStep === 0 && '🧵'}
                  {currentGuideStep === 1 && '📐'}
                  {currentGuideStep === 2 && '✂️'}
                  {currentGuideStep === 3 && '🪡'}
                  {currentGuideStep === 4 && '👕'}
                  {currentGuideStep === 5 && '🔗'}
                  {currentGuideStep === 6 && '✨'}
                </span>
              </div>

              {/* Badges */}
              <div className="absolute top-3 left-3 bg-purple-500/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-purple-400 shadow-md flex items-center gap-1.5">
                <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>
                <p className="text-white text-xs font-bold tracking-wide">
                  GarmageNet 3D
                </p>
              </div>
              <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-gray-600 flex items-center gap-2">
                <span className="text-gray-300 text-xs font-medium">👆 Geser untuk putar 3D</span>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  {currentStep.step}
                </span>
                <div>
                  <h3 className="font-bold text-gray-800 text-xl">{currentStep.title}</h3>
                  <p className="text-gray-500 text-base">⏱️ {currentStep.duration}</p>
                </div>
              </div>
              
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                {currentStep.description}
              </p>
              
              {/* Tips Box */}
              <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                <p className="font-bold text-amber-800 text-base mb-1">💡 Tips:</p>
                <p className="text-amber-700 text-base">{currentStep.tips}</p>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => setCurrentGuideStep(Math.max(0, currentGuideStep - 1))}
              disabled={currentGuideStep === 0}
              className={`flex-1 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 ${
                currentGuideStep === 0 
                  ? 'bg-gray-100 text-gray-400' 
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              <ChevronLeft size={24} />
              Sebelumnya
            </button>
            <button
              onClick={() => {
                if (currentGuideStep < sewingGuide.length - 1) {
                  setCurrentGuideStep(currentGuideStep + 1);
                } else {
                  showSuccess('Selamat! Panduan selesai! 🎉');
                  setSelectedGuide(null);
                }
              }}
              className="flex-1 py-4 bg-emerald-500 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2"
            >
              {currentGuideStep < sewingGuide.length - 1 ? 'Selanjutnya' : 'Selesai'}
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // CAMERA TAB
  const CameraView = () => {
    const activeOrders = orders.filter(o => o.status === 'in_progress');
    const [selectedOrderForPhoto, setSelectedOrderForPhoto] = useState(
      activeOrders.length > 0 ? activeOrders[0] : null
    );

    return (
      <div className="pb-24">
        <Header title="Kirim Foto Hasil" />
        
        <div className="p-4 space-y-4">
          {/* Select Order */}
          {activeOrders.length > 0 ? (
            <>
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <label className="block text-gray-700 font-semibold text-base mb-3">
                  Pilih Pesanan:
                </label>
                <select
                  value={selectedOrderForPhoto?.id || ''}
                  onChange={(e) => setSelectedOrderForPhoto(orders.find(o => o.id === e.target.value))}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl text-lg font-medium"
                >
                  {activeOrders.map(order => (
                    <option key={order.id} value={order.id}>
                      #{order.id} - {order.product}
                    </option>
                  ))}
                </select>
              </div>

              {/* AI QC Scanner Mockup */}
              <div className="bg-emerald-900 rounded-2xl overflow-hidden relative h-56 shadow-md border border-emerald-800 flex items-center justify-center">
                {/* Viewfinder Frame */}
                <div className="absolute inset-4 border-2 border-dashed border-emerald-400/50 rounded-xl"></div>
                <div className="absolute inset-0">
                  {/* Scanning Animation Line */}
                  <div className="w-full h-1 bg-emerald-400 shadow-[0_0_15px_#34d399] animate-[bounce_2s_infinite]"></div>
                </div>
                
                <div className="text-center z-10 flex flex-col items-center">
                  <div className="bg-emerald-500/20 p-4 rounded-full mb-2">
                     <Camera size={40} className="text-emerald-300" />
                  </div>
                  <p className="text-emerald-100 font-semibold text-lg">Arahkan Kamera</p>
                  <p className="text-emerald-300/80 text-sm">Validasi AI & Cetak Digital Passport</p>
                </div>
              </div>

              {/* Upload Instructions */}
              <div className="bg-blue-50 rounded-2xl p-5 border border-blue-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-blue-800 text-lg">📸 Foto yang Dibutuhkan</h3>
                  <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full font-bold">Polygon Blockchain</span>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-blue-700 text-base">
                    <Circle size={8} className="fill-blue-500 text-blue-500" />
                    Foto tampak depan (wajib)
                  </li>
                  <li className="flex items-center gap-2 text-blue-700 text-base">
                    <Circle size={8} className="fill-blue-500 text-blue-500" />
                    Foto tampak belakang (wajib)
                  </li>
                  <li className="flex items-center gap-2 text-blue-700 text-base">
                    <Circle size={8} className="fill-blue-500 text-blue-500" />
                    Foto detail jahitan (opsional)
                  </li>
                  <li className="flex items-center gap-2 text-blue-700 text-base">
                    <Circle size={8} className="fill-blue-500 text-blue-500" />
                    Foto dengan label ukuran (opsional)
                  </li>
                </ul>
              </div>

              {/* Uploaded Photos */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-800 text-lg mb-3">
                  Foto Terupload ({uploadedPhotos.length}/4)
                </h3>
                
                <div className="grid grid-cols-2 gap-3">
                  {/* Uploaded photos */}
                  {uploadedPhotos.map((photo, idx) => (
                    <div key={photo.id} className="relative aspect-square bg-emerald-100 rounded-xl flex items-center justify-center">
                      <div className="text-center">
                        <CheckCircle size={32} className="text-emerald-500 mx-auto" />
                        <p className="text-emerald-700 text-sm mt-1">{photo.name}</p>
                      </div>
                      <button
                        onClick={() => setUploadedPhotos(uploadedPhotos.filter(p => p.id !== photo.id))}
                        className="absolute top-2 right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center"
                      >
                        <X size={16} className="text-white" />
                      </button>
                    </div>
                  ))}
                  
                  {/* Add photo buttons */}
                  {uploadedPhotos.length < 4 && (
                    <button
                      onClick={simulatePhotoUpload}
                      className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:border-emerald-400 hover:text-emerald-500 transition-colors"
                    >
                      <Camera size={32} />
                      <p className="text-sm mt-2">Ambil Foto</p>
                    </button>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={() => selectedOrderForPhoto && submitForQC(selectedOrderForPhoto.id)}
                disabled={uploadedPhotos.length < 2}
                className={`w-full py-5 rounded-2xl font-bold text-xl flex items-center justify-center gap-2 ${
                  uploadedPhotos.length >= 2
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                <Send size={24} />
                Kirim untuk Dicek
              </button>
              
              {uploadedPhotos.length < 2 && (
                <p className="text-center text-gray-500 text-base">
                  Minimal 2 foto (depan & belakang) ya Bu
                </p>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <Camera size={64} className="text-gray-200 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Belum ada pesanan yang dikerjakan</p>
              <p className="text-gray-400 text-base mt-2">
                Terima pesanan dulu ya Bu
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // WALLET TAB
  const WalletView = () => {
    return (
      <div className="pb-24">
        <Header title="Penghasilan Saya" />
        
        <div className="p-4 space-y-4">
          {/* Balance Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <p className="text-emerald-100 text-sm font-medium">Saldo Tersedia</p>
                <p className="text-2xl font-bold mt-1 tracking-tight truncate">Rp{formatCurrency(earnings.available)}</p>
              </div>
              <button
                onClick={() => setShowWithdrawModal(true)}
                className="mt-3 w-full py-2 bg-white/20 hover:bg-white/30 transition-colors rounded-xl font-semibold text-sm"
              >
                Tarik Saldo
              </button>
            </div>
            <div className="bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <p className="text-amber-100 text-sm font-medium">Dalam Proses</p>
                <p className="text-2xl font-bold mt-1 tracking-tight truncate">Rp{formatCurrency(earnings.pending)}</p>
              </div>
              <p className="mt-3 text-amber-50 text-xs font-medium bg-white/20 rounded-lg p-2 flex items-center gap-2">
                ⏳ Menunggu QC
              </p>
            </div>
          </div>

          {/* Monthly Summary */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 text-lg mb-4">Ringkasan Bulan Ini</h3>
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-600 text-base">Total Penghasilan</span>
              <span className="font-bold text-gray-800 text-xl">Rp{formatCurrency(earnings.thisMonth)}</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-600">
              <TrendingUp size={20} />
              <span className="font-semibold">
                +{Math.round(((earnings.thisMonth - earnings.lastMonth) / earnings.lastMonth) * 100)}% dari bulan lalu
              </span>
            </div>
          </div>

          {/* Transaction History */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 text-lg mb-4">Riwayat Transaksi</h3>
            <div className="space-y-3">
              {earnings.history.map(tx => (
                <div key={tx.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      tx.type === 'income' ? 'bg-emerald-100' :
                      tx.type === 'withdraw' ? 'bg-red-100' : 'bg-purple-100'
                    }`}>
                      {tx.type === 'income' && <Banknote size={24} className="text-emerald-600" />}
                      {tx.type === 'withdraw' && <CreditCard size={24} className="text-red-600" />}
                      {tx.type === 'bonus' && <Gift size={24} className="text-purple-600" />}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-base">{tx.desc}</p>
                      <p className="text-gray-500 text-sm">{tx.date}</p>
                    </div>
                  </div>
                  <span className={`font-bold text-lg ${tx.amount >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {tx.amount >= 0 ? '+' : ''}Rp{formatCurrency(Math.abs(tx.amount))}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Withdraw Modal */}
        {showWithdrawModal && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50">
            <div className="bg-white rounded-t-3xl w-full max-w-lg p-6 animate-slide-up">
              <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
              <h3 className="font-bold text-gray-800 text-xl mb-4">Tarik Saldo</h3>
              
              <div className="space-y-4">
                <div className="bg-emerald-50 rounded-xl p-4">
                  <p className="text-emerald-600 text-base">Saldo Tersedia</p>
                  <p className="text-emerald-800 text-2xl font-bold">Rp{formatCurrency(earnings.available)}</p>
                </div>
                
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Rekening Tujuan</label>
                  <div className="p-4 bg-gray-100 rounded-xl">
                    <p className="font-semibold text-gray-800">{userProfile.bankAccount}</p>
                    <p className="text-gray-500 text-sm">a.n. {userProfile.name}</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Jumlah Tarik</label>
                  <input
                    type="text"
                    defaultValue={`Rp${formatCurrency(earnings.available)}`}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl text-lg font-medium"
                  />
                </div>
                
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowWithdrawModal(false)}
                    className="flex-1 py-4 bg-gray-200 text-gray-700 rounded-xl font-bold text-lg"
                  >
                    Batal
                  </button>
                  <button
                    onClick={() => {
                      setShowWithdrawModal(false);
                      showSuccess('Penarikan berhasil diproses! 💰');
                    }}
                    className="flex-1 py-4 bg-emerald-500 text-white rounded-xl font-bold text-lg"
                  >
                    Tarik Sekarang
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // PROFILE TAB
  const ProfileView = () => {
    return (
      <div className="pb-24">
        <Header title="Profil Saya" />
        
        <div className="p-4 space-y-4">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full mx-auto flex items-center justify-center text-white text-3xl font-bold">
              {userProfile.name.split(' ').slice(1).map(n => n[0]).join('')}
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mt-4">{userProfile.name}</h2>
            <p className="text-gray-500 text-base flex items-center justify-center gap-1 mt-1">
              <MapPin size={16} />
              {userProfile.location}
            </p>
            
            <div className="flex items-center justify-center gap-4 mt-4">
              <div className="flex items-center gap-1">
                <Star size={20} className="text-yellow-400 fill-yellow-400" />
                <span className="font-bold text-lg">{userProfile.rating}</span>
              </div>
              <span className="text-gray-300">|</span>
              <span className="text-gray-600">{userProfile.totalOrders} pesanan</span>
            </div>
            
            {/* Skills */}
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {userProfile.skills.map(skill => (
                <span key={skill} className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-base font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Profile Completion */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-gray-800 text-base">Kelengkapan Profil</span>
              <span className="font-bold text-emerald-600">{userProfile.profileComplete}%</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 rounded-full"
                style={{ width: `${userProfile.profileComplete}%` }}
              />
            </div>
          </div>

          {/* Info List */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center gap-4">
              <Phone size={24} className="text-gray-400" />
              <div>
                <p className="text-gray-500 text-sm">Nomor HP</p>
                <p className="font-semibold text-gray-800">{userProfile.phone}</p>
              </div>
            </div>
            <div className="p-4 border-b border-gray-100 flex items-center gap-4">
              <CreditCard size={24} className="text-gray-400" />
              <div>
                <p className="text-gray-500 text-sm">Rekening Bank</p>
                <p className="font-semibold text-gray-800">{userProfile.bankAccount}</p>
              </div>
            </div>
            <div className="p-4 flex items-center gap-4">
              <Calendar size={24} className="text-gray-400" />
              <div>
                <p className="text-gray-500 text-sm">Bergabung Sejak</p>
                <p className="font-semibold text-gray-800">{userProfile.memberSince}</p>
              </div>
            </div>
          </div>

          {/* Achievement */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Award size={32} />
              </div>
              <div>
                <p className="font-bold text-lg">Mitra Bintang ⭐</p>
                <p className="text-purple-100 text-base">Rating di atas 4.8 selama 3 bulan berturut-turut!</p>
              </div>
            </div>
          </div>

          {/* Menu List */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <button className="w-full p-4 border-b border-gray-100 flex items-center justify-between hover:bg-gray-50">
              <div className="flex items-center gap-4">
                <Settings size={24} className="text-gray-400" />
                <span className="font-semibold text-gray-800">Pengaturan</span>
              </div>
              <ChevronRight size={24} className="text-gray-300" />
            </button>
            <button className="w-full p-4 border-b border-gray-100 flex items-center justify-between hover:bg-gray-50">
              <div className="flex items-center gap-4">
                <HelpCircle size={24} className="text-gray-400" />
                <span className="font-semibold text-gray-800">Bantuan</span>
              </div>
              <ChevronRight size={24} className="text-gray-300" />
            </button>
            <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50">
              <div className="flex items-center gap-4">
                <MessageCircle size={24} className="text-gray-400" />
                <span className="font-semibold text-gray-800">Hubungi Admin</span>
              </div>
              <ChevronRight size={24} className="text-gray-300" />
            </button>
          </div>

          {/* Logout */}
          <button className="w-full py-4 bg-red-50 text-red-600 rounded-2xl font-bold text-lg flex items-center justify-center gap-2">
            <LogOut size={24} />
            Keluar
          </button>

          {/* Version */}
          <p className="text-center text-gray-400 text-sm">
            EcoThread Mitra v1.0.0
          </p>
        </div>
      </div>
    );
  };

  // ============================================
  // MAIN RENDER
  // ============================================

  const renderView = () => {
    switch (activeTab) {
      case 'home': return <HomeView />;
      case 'orders': return <OrdersView />;
      case 'guide': return <GuideView />;
      case 'camera': return <CameraView />;
      case 'wallet': return <WalletView />;
      case 'profile': return <ProfileView />;
      default: return <HomeView />;
    }
  };

  // Bottom Navigation
  const BottomNav = () => (
    <div className="bg-white border-t border-gray-200 px-2 pt-2 pb-5 z-50 shrink-0">
      <div className="flex justify-around items-center w-full">
        {[
          { id: 'home', icon: Home, label: 'Beranda' },
          { id: 'orders', icon: Package, label: 'Pesanan' },
          { id: 'guide', icon: BookOpen, label: 'Panduan' },
          { id: 'camera', icon: Camera, label: 'Foto' },
          { id: 'wallet', icon: Wallet, label: 'Saldo' },
        ].map(tab => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          const hasNotif = tab.id === 'orders' && orders.filter(o => o.status === 'new').length > 0;
          
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSelectedOrder(null);
                setSelectedGuide(null);
              }}
              className={`flex flex-col items-center py-2 px-3 rounded-xl transition-all ${
                isActive ? 'bg-emerald-50' : ''
              }`}
            >
              <div className="relative">
                <Icon size={28} className={isActive ? 'text-emerald-600' : 'text-gray-400'} />
                {hasNotif && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
                )}
              </div>
              <span className={`text-xs mt-1 font-medium ${isActive ? 'text-emerald-600' : 'text-gray-400'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-200 py-8 flex items-center justify-center">
      {/* Phone Frame Mockup */}
      <div className="w-full max-w-[400px] h-[850px] bg-white rounded-[3rem] shadow-2xl relative overflow-hidden border-[8px] border-gray-900 flex flex-col">
        
        {/* Camera Hole (Android style punch-hole) */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-gray-900 rounded-full z-50"></div>

        {/* Screen Content Wrapper */}
        <div className="h-full flex flex-col bg-gray-50 relative">
          
          {/* Status Bar */}
          <div className="bg-emerald-600 text-white px-5 pt-3 pb-2 flex justify-between items-center text-xs font-medium sticky top-0 z-50">
            <span>09:41</span>
            <div className="flex items-center gap-1.5">
              <Signal size={14} strokeWidth={3} />
              <Wifi size={14} strokeWidth={3} />
              <div className="flex items-center gap-1 ml-1">
                <span>85%</span>
                <BatteryFull size={16} />
              </div>
            </div>
          </div>
          
          {/* App Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar bg-gray-50 pb-8">
            {renderView()}
          </div>
          
          {/* Bottom Navigation */}
          <BottomNav />
        </div>
      </div>
      
      {/* Success Modal */}
      <SuccessModal />
      
      {/* Animations */}
      <style>{`
        @keyframes bounce-in {
          0% { transform: scale(0.5); opacity: 0; }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-bounce-in {
          animation: bounce-in 0.4s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 4px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};

export default App;