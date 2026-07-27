import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Home, Package, Cpu, Users, Truck, CheckCircle, Link2, Settings, Bell, Search, Plus, Upload, Eye, ChevronRight, TrendingUp, Recycle, Leaf, Box, Clock, MapPin, Star, AlertCircle, Check, X, Zap, Shield, QrCode, Layers, Filter, MoreVertical, Camera, Play, Pause, RefreshCw, Wallet, ArrowUpRight , Menu , ShieldCheck, Scissors } from 'lucide-react';

const EcoThreadDashboard = () => {
  const [activeView, setActiveView] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Mock data
  const analyticsData = [
    { month: 'Jan', processed: 120, sold: 95, revenue: 37905000 },
    { month: 'Feb', processed: 180, sold: 142, revenue: 56658000 },
    { month: 'Mar', processed: 220, sold: 189, revenue: 75411000 },
    { month: 'Apr', processed: 280, sold: 245, revenue: 97755000 },
    { month: 'May', processed: 350, sold: 312, revenue: 124488000 },
    { month: 'Jun', processed: 420, sold: 385, revenue: 153615000 },
  ];

  const [inventoryData, setInventoryData] = useState([
    { id: 'INV-001', type: 'Denim', weight: '15kg', source: 'PT Tekstil Jaya', status: 'sterilized', date: '2026-04-14', quality: 'A' },
    { id: 'INV-002', type: 'Cotton', weight: '22kg', source: 'CV Kain Makmur', status: 'processing', date: '2026-04-15', quality: 'B' },
    { id: 'INV-003', type: 'Polyester', weight: '18kg', source: 'UD Serat Indah', status: 'received', date: '2026-04-16', quality: 'A' },
    { id: 'INV-004', type: 'Canvas', weight: '12kg', source: 'PT Tekstil Jaya', status: 'sterilized', date: '2026-04-13', quality: 'A' },
    { id: 'INV-005', type: 'Linen', weight: '8kg', source: 'CV Kain Makmur', status: 'sterilized', date: '2026-04-12', quality: 'B' },
  ]);

  const mitraData = [
    { id: 'MTR-001', name: 'Ibu Siti Aminah', location: 'Cigondewah', skill: 'Jaket, Tas', rating: 4.9, completed: 156, capacity: 'available', phone: '0812-xxxx-xxxx' },
    { id: 'MTR-002', name: 'Pak Ahmad Hidayat', location: 'Cimahi', skill: 'Kemeja, Celana', rating: 4.7, completed: 98, capacity: 'busy', phone: '0813-xxxx-xxxx' },
    { id: 'MTR-003', name: 'Ibu Rina Wati', location: 'Bandung Kulon', skill: 'Tas, Aksesori', rating: 4.8, completed: 203, capacity: 'available', phone: '0857-xxxx-xxxx' },
    { id: 'MTR-004', name: 'Pak Dedi Kurnia', location: 'Cibaduyut', skill: 'Jaket, Rompi', rating: 4.6, completed: 87, capacity: 'available', phone: '0878-xxxx-xxxx' },
    { id: 'MTR-005', name: 'Ibu Yanti S.', location: 'Cigondewah', skill: 'Kemeja, Dress', rating: 4.9, completed: 178, capacity: 'busy', phone: '0821-xxxx-xxxx' },
  ];

  const [ordersData, setOrdersData] = useState([
    { id: 'ORD-001', product: 'Upcycled Denim Jacket', mitra: 'Ibu Siti Aminah', status: 'in_progress', deadline: '2026-04-20', progress: 75 },
    { id: 'ORD-002', product: 'Patchwork Tote Bag', mitra: 'Ibu Rina Wati', status: 'qc_pending', deadline: '2026-04-18', progress: 100 },
    { id: 'ORD-003', product: 'Canvas Messenger Bag', mitra: 'Pak Ahmad Hidayat', status: 'assigned', deadline: '2026-04-22', progress: 15 },
    { id: 'ORD-004', product: 'Vintage Quilt Vest', mitra: 'Pak Dedi Kurnia', status: 'in_progress', deadline: '2026-04-21', progress: 45 },
    { id: 'ORD-005', product: 'Eco Cotton Shirt', mitra: 'Ibu Yanti S.', status: 'completed', deadline: '2026-04-15', progress: 100 },
  ]);

  const [qcData, setQcData] = useState([
    { id: 'QC-001', orderId: 'ORD-002', product: 'Patchwork Tote Bag', mitra: 'Ibu Rina Wati', submitted: '2026-04-16', status: 'pending' },
    { id: 'QC-002', orderId: 'ORD-005', product: 'Eco Cotton Shirt', mitra: 'Ibu Yanti S.', submitted: '2026-04-15', status: 'approved' },
  ]);

  const [blockchainData, setBlockchainData] = useState([
    { id: 'DPP-001', productId: 'PRD-089', txHash: '0x7f9a...3c2e', status: 'minted', timestamp: '2026-04-15 14:32', carbon: '2.3kg' },
    { id: 'DPP-002', productId: 'PRD-090', txHash: '0x8e2b...9f1a', status: 'minted', timestamp: '2026-04-15 15:18', carbon: '1.8kg' },
    { id: 'DPP-003', productId: 'PRD-091', txHash: 'pending...', status: 'queued', timestamp: '-', carbon: '2.1kg' },
  ]);

  const pieData = [
    { name: 'Denim', value: 35, color: '#0F6E56' },
    { name: 'Cotton', value: 28, color: '#1D9E75' },
    { name: 'Polyester', value: 20, color: '#5DCAA5' },
    { name: 'Canvas', value: 12, color: '#9FE1CB' },
    { name: 'Others', value: 5, color: '#E1F5EE' },
  ];

  const menuItems = [
    { id: 'overview', icon: Home, label: 'Overview' },
    { id: 'inventory', icon: Package, label: 'Inventory' },
    { id: 'ai-digitization', icon: Cpu, label: 'AI Digitization' },
    { id: 'eco-kit', icon: Box, label: 'Eco-Kit Assembly' },
    { id: 'mitra', icon: Users, label: 'Mitra Management' },
    { id: 'orders', icon: Truck, label: 'Order Distribution' },
    { id: 'qc', icon: CheckCircle, label: 'QC Dashboard' },
    { id: 'finance', icon: Wallet, label: 'Mitra Finance' },
    { id: 'blockchain', icon: Link2, label: 'Blockchain DPP' },
    { id: 'monitor', icon: Search, label: 'Live Tracking & AI' },
    ];

  const StatusBadge = ({ status }) => {
    const styles = {
      sterilized: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      processing: 'bg-amber-100 text-amber-700 border-amber-200',
      received: 'bg-blue-100 text-blue-700 border-blue-200',
      available: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      busy: 'bg-red-100 text-red-700 border-red-200',
      in_progress: 'bg-blue-100 text-blue-700 border-blue-200',
      qc_pending: 'bg-amber-100 text-amber-700 border-amber-200',
      assigned: 'bg-purple-100 text-purple-700 border-purple-200',
      completed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      pending: 'bg-amber-100 text-amber-700 border-amber-200',
      approved: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      rejected: 'bg-red-100 text-red-700 border-red-200',
      minted: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      queued: 'bg-gray-100 text-gray-700 border-gray-200',
    };
    const labels = {
      sterilized: 'Sterilized',
      processing: 'Processing',
      received: 'Received',
      available: 'Available',
      busy: 'Busy',
      in_progress: 'In Progress',
      qc_pending: 'QC Pending',
      assigned: 'Assigned',
      completed: 'Completed',
      pending: 'Pending',
      approved: 'Approved',
      rejected: 'Rejected',
      minted: 'Minted',
      queued: 'Queued',
    };
    return (
      <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const StatCard = ({ icon: Icon, label, value, subtext, trend, color }) => (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon size={22} className="text-white" />
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-emerald-600 text-sm font-medium">
            <TrendingUp size={14} />
            {trend}
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className="text-gray-500 text-sm">{label}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        {subtext && <p className="text-gray-400 text-xs mt-1">{subtext}</p>}
      </div>
    </div>
  );

  // Overview View
  const OverviewView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <StatCard icon={Recycle} label="Limbah Diproses" value="1,570 kg" subtext="Bulan ini" trend="+23%" color="bg-emerald-500" />
        <StatCard icon={Package} label="Unit Terjual" value="1,368" subtext="YTD" trend="+18%" color="bg-teal-500" />
        <StatCard icon={Users} label="Mitra Aktif" value="47" subtext="Penjahit" trend="+5" color="bg-cyan-500" />
        <StatCard icon={Leaf} label="CO₂ Saved" value="3.2 ton" subtext="Total impact" trend="+31%" color="bg-green-500" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Revenue & Production Trend</h3>
            <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600">
              <option>Last 6 months</option>
              <option>Last year</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={analyticsData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0F6E56" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#0F6E56" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(v) => `${(v/1000000).toFixed(0)}M`} />
              <Tooltip 
                formatter={(value) => [`Rp ${(value/1000000).toFixed(1)}M`, 'Revenue']}
                contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb' }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#0F6E56" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Material Composition</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value">
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}%`, '']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {pieData.slice(0, 4).map((item) => (
              <div key={item.name} className="flex items-center gap-2 text-xs">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-gray-600">{item.name}</span>
                <span className="text-gray-400 ml-auto">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Recent Orders</h3>
            <button onClick={() => setActiveView("orders")} className="text-teal-600 text-sm font-medium hover:text-teal-700">View all →</button>
          </div>
          <div className="space-y-3">
            {ordersData.slice(0, 4).map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-medium text-gray-900 text-sm">{order.product}</p>
                  <p className="text-gray-500 text-xs">{order.mitra}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-20">
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-teal-500 rounded-full" style={{ width: `${order.progress}%` }} />
                    </div>
                  </div>
                  <StatusBadge status={order.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Top Performing Mitra</h3>
            <button onClick={() => setActiveView("mitra")} className="text-teal-600 text-sm font-medium hover:text-teal-700">View all →</button>
          </div>
          <div className="space-y-3">
            {mitraData.slice(0, 4).map((mitra, idx) => (
              <div key={mitra.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white font-bold text-sm">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">{mitra.name}</p>
                  <p className="text-gray-500 text-xs">{mitra.location}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star size={12} fill="currentColor" />
                    <span className="text-sm font-medium">{mitra.rating}</span>
                  </div>
                  <p className="text-gray-400 text-xs">{mitra.completed} orders</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Inventory View
  const InventoryView = () => {
    const [showAddModal, setShowAddModal] = useState(false);
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Inventory Management</h2>
            <p className="text-gray-500 text-sm">Manage incoming textile waste and sterilization status</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-teal-700 transition-colors"
          >
            <Plus size={18} />
            Add Inventory
          </button>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <StatCard icon={Package} label="Total Stock" value="75 kg" color="bg-teal-500" />
          <StatCard icon={CheckCircle} label="Sterilized" value="45 kg" color="bg-emerald-500" />
          <StatCard icon={Clock} label="Processing" value="22 kg" color="bg-amber-500" />
          <StatCard icon={Truck} label="Incoming" value="18 kg" color="bg-blue-500" />
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search inventory..." 
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                <Filter size={16} />
                Filter
              </button>
            </div>
            <div className="text-sm text-gray-500">
              Showing {inventoryData.length} items
            </div>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Material Type</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Weight</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Source</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Quality</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {inventoryData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4 text-sm font-mono text-gray-600">{item.id}</td>
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">{item.type}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{item.weight}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{item.source}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-0.5 text-xs font-medium rounded ${item.quality === 'A' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                      Grade {item.quality}
                    </span>
                  </td>
                  <td className="px-4 py-4"><StatusBadge status={item.status} /></td>
                  <td className="px-4 py-4 text-sm text-gray-500">{item.date}</td>
                  <td className="px-4 py-4 flex gap-2">
                    {item.status === 'received' || item.status === 'processing' ? (
                      <button onClick={() => setInventoryData(inventoryData.map(i => i.id === item.id ? {...i, status: 'sterilized'} : i))} className="text-xs bg-amber-100 text-amber-700 px-3 py-1.5 rounded-lg hover:bg-amber-200 transition font-bold">Sterilkan</button>
                    ) : item.status === 'sterilized' ? (
                      <button onClick={() => { setActiveView('ai-digitization'); alert('Limbah sudah siap di scanning.\nSedang mengalihkan Anda ke AI GarmageNet untuk di-Generate menjadi pola/eco-kit...'); }} className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-indigo-200 transition font-bold text-nowrap">Kirim AI <Cpu size={12}/></button>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // AI Digitization View
  const AIDigitizationView = () => {
    const [uploadedImage, setUploadedImage] = useState(null);
    const [processingStage, setProcessingStage] = useState(null);
    const [generatedPattern, setGeneratedPattern] = useState(false);

    const simulateProcessing = () => {
      setProcessingStage('scanning');
      setTimeout(() => setProcessingStage('mapping'), 1500);
      setTimeout(() => setProcessingStage('generating'), 3000);
      setTimeout(() => {
        setProcessingStage('complete');
        setGeneratedPattern(true);
        setOrdersData([{ id: 'ORD-' + Math.floor(Math.random()*1000), product: 'AI Generated Eco-Kit', mitra: 'Available (Target AI)', status: 'pending', deadline: '2026-04-20', progress: 0 }, ...ordersData]);
      }, 4500);
    };

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">AI Digitization</h2>
          <p className="text-gray-500 text-sm">Transform textile waste into precise sewing patterns using GarmageNet AI</p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Upload Section */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Camera size={20} className="text-teal-600" />
              Input Material
            </h3>
            
            {!uploadedImage ? (
              <div 
                className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-teal-400 transition-colors cursor-pointer"
                onClick={() => setUploadedImage('mock')}
              >
                <Upload size={40} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-600 font-medium">Upload Fabric Image</p>
                <p className="text-gray-400 text-sm mt-1">Drag & drop or click to browse</p>
                <p className="text-gray-300 text-xs mt-2">PNG, JPG up to 10MB</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative aspect-video bg-gradient-to-br from-blue-100 to-teal-100 rounded-xl overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Package size={48} className="mx-auto text-teal-600 mb-2" />
                      <p className="text-teal-800 font-medium">Denim Fabric Sample</p>
                      <p className="text-teal-600 text-sm">2.5kg • Grade A</p>
                    </div>
                  </div>
                  {processingStage === 'scanning' && (
                    <div className="absolute inset-0 bg-teal-500/20">
                      <div className="absolute top-0 left-0 right-0 h-1 bg-teal-400 animate-pulse" style={{ animation: 'scan 1.5s ease-in-out infinite' }} />
                    </div>
                  )}
                </div>
                
                {!processingStage && (
                  <button 
                    onClick={simulateProcessing}
                    className="w-full flex items-center justify-center gap-2 bg-teal-600 text-white py-3 rounded-xl font-medium hover:bg-teal-700 transition-colors"
                  >
                    <Zap size={18} />
                    Start AI Processing
                  </button>
                )}

                {processingStage && (
                  <div className="space-y-3">
                    <div className={`flex items-center gap-3 p-3 rounded-lg ${processingStage === 'scanning' ? 'bg-teal-50 border border-teal-200' : 'bg-gray-50'}`}>
                      {processingStage === 'scanning' ? (
                        <RefreshCw size={18} className="text-teal-600 animate-spin" />
                      ) : (
                        <Check size={18} className="text-emerald-600" />
                      )}
                      <span className="text-sm font-medium">SAM: Scanning fabric area</span>
                    </div>
                    <div className={`flex items-center gap-3 p-3 rounded-lg ${processingStage === 'mapping' ? 'bg-teal-50 border border-teal-200' : processingStage === 'scanning' ? 'bg-gray-100' : 'bg-gray-50'}`}>
                      {processingStage === 'mapping' ? (
                        <RefreshCw size={18} className="text-teal-600 animate-spin" />
                      ) : processingStage !== 'scanning' ? (
                        <Check size={18} className="text-emerald-600" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                      )}
                      <span className="text-sm font-medium">SAM: Mapping usable regions</span>
                    </div>
                    <div className={`flex items-center gap-3 p-3 rounded-lg ${processingStage === 'generating' ? 'bg-teal-50 border border-teal-200' : processingStage === 'complete' ? 'bg-gray-50' : 'bg-gray-100'}`}>
                      {processingStage === 'generating' ? (
                        <RefreshCw size={18} className="text-teal-600 animate-spin" />
                      ) : processingStage === 'complete' ? (
                        <Check size={18} className="text-emerald-600" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                      )}
                      <span className="text-sm font-medium">GarmageNet: Generating pattern</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Output Section */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Layers size={20} className="text-teal-600" />
              Generated Output
            </h3>
            
            {!generatedPattern ? (
              <div className="aspect-video bg-gray-50 rounded-xl flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <Cpu size={40} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Pattern will appear here</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 relative overflow-hidden">
                  {/* Mock pattern visualization */}
                  <svg viewBox="0 0 400 250" className="w-full h-full">
                    <defs>
                      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#334155" strokeWidth="0.5"/>
                      </pattern>
                    </defs>
                    <rect width="400" height="250" fill="url(#grid)"/>
                    {/* Front panel */}
                    <path d="M50 30 L150 30 L160 220 L40 220 Z" fill="none" stroke="#5DCAA5" strokeWidth="2"/>
                    <text x="95" y="130" fill="#5DCAA5" fontSize="10" textAnchor="middle">FRONT</text>
                    {/* Back panel */}
                    <path d="M180 30 L280 30 L290 220 L170 220 Z" fill="none" stroke="#5DCAA5" strokeWidth="2"/>
                    <text x="225" y="130" fill="#5DCAA5" fontSize="10" textAnchor="middle">BACK</text>
                    {/* Sleeve */}
                    <path d="M310 50 L380 50 L370 180 L320 180 Z" fill="none" stroke="#9FE1CB" strokeWidth="2"/>
                    <text x="345" y="120" fill="#9FE1CB" fontSize="9" textAnchor="middle">SLEEVE</text>
                    {/* Seam allowance indicators */}
                    <path d="M50 30 L150 30 L160 220 L40 220 Z" fill="none" stroke="#5DCAA5" strokeWidth="0.5" strokeDasharray="4 2" transform="translate(-5, -5)"/>
                  </svg>
                  <div className="absolute bottom-2 right-2 bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded text-xs font-mono">
                    DXF Ready
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">Product Type</p>
                    <p className="font-medium text-gray-900">Denim Jacket</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">Pattern Pieces</p>
                    <p className="font-medium text-gray-900">7 panels</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">Fabric Efficiency</p>
                    <p className="font-medium text-emerald-600">94.2%</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">Est. Carbon Saved</p>
                    <p className="font-medium text-emerald-600">2.3 kg CO₂</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 flex items-center justify-center gap-2 bg-teal-600 text-white py-2.5 rounded-xl font-medium hover:bg-teal-700 transition-colors">
                    <Box size={16} />
                    Create Eco-Kit
                  </button>
                  <button className="flex items-center justify-center gap-2 border border-gray-200 px-4 py-2.5 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                    <Eye size={16} />
                    Preview
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Design Selection */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Select Design Template</h3>
          <div className="grid grid-cols-5 gap-4">
            {['Jacket', 'Tote Bag', 'Messenger Bag', 'Shirt', 'Vest'].map((item, idx) => (
              <div 
                key={item}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${idx === 0 ? 'border-teal-500 bg-teal-50' : 'border-gray-100 hover:border-gray-200'}`}
              >
                <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                  <Package size={32} className={idx === 0 ? 'text-teal-600' : 'text-gray-400'} />
                </div>
                <p className={`text-sm font-medium text-center ${idx === 0 ? 'text-teal-700' : 'text-gray-700'}`}>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Eco-Kit Assembly View
  const EcoKitView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Eco-Kit Assembly</h2>
          <p className="text-gray-500 text-sm">Bundle materials + patterns + accessories for mitra distribution</p>
        </div>
        <button onClick={() => alert("✅ Form Create New Eco-Kit material package terbuka!")} className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-teal-700 transition-colors">
          <Plus size={18} />
          Create New Kit
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatCard icon={Box} label="Active Kits" value="23" color="bg-teal-500" />
        <StatCard icon={Truck} label="Ready to Ship" value="12" color="bg-emerald-500" />
        <StatCard icon={Clock} label="In Assembly" value="8" color="bg-amber-500" />
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4">Kit Builder</h3>
        <div className="grid grid-cols-3 gap-6">
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-700">1. Select Material</h4>
            <select className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm">
              <option>INV-001 - Denim (15kg)</option>
              <option>INV-004 - Canvas (12kg)</option>
              <option>INV-005 - Linen (8kg)</option>
            </select>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-700">2. Select Pattern</h4>
            <select className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm">
              <option>PTN-089 - Denim Jacket M</option>
              <option>PTN-090 - Tote Bag Standard</option>
              <option>PTN-091 - Messenger Bag</option>
            </select>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-700">3. Add Accessories</h4>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" className="rounded" defaultChecked /> Zipper YKK 50cm
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" className="rounded" defaultChecked /> Button Set (6pc)
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" className="rounded" /> NFC Tag
              </label>
            </div>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <QrCode size={40} className="text-gray-300" />
            <div>
              <p className="text-sm text-gray-500">Kit Tracking Code</p>
              <p className="font-mono font-medium">ECO-KIT-2026-0089</p>
            </div>
          </div>
          <button onClick={() => alert("📦 Eco-Kit Berhasil Dibuat dan siap dikirimkan dengan resi pengiriman.")} className="flex items-center gap-2 bg-teal-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-teal-700 transition-colors">
            <Box size={18} />
            Generate Kit
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Recent Eco-Kits</h3>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Kit ID</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Contents</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Assigned Mitra</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <tr className="hover:bg-gray-50">
              <td className="px-4 py-4 font-mono text-sm">ECO-KIT-0089</td>
              <td className="px-4 py-4 text-sm">Denim Jacket + Zipper + Buttons</td>
              <td className="px-4 py-4 text-sm">Ibu Siti Aminah</td>
              <td className="px-4 py-4"><StatusBadge status="completed" /></td>
              <td className="px-4 py-4 text-sm text-gray-500">2026-04-14</td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="px-4 py-4 font-mono text-sm">ECO-KIT-0088</td>
              <td className="px-4 py-4 text-sm">Tote Bag + Handle Set</td>
              <td className="px-4 py-4 text-sm">Ibu Rina Wati</td>
              <td className="px-4 py-4"><StatusBadge status="in_progress" /></td>
              <td className="px-4 py-4 text-sm text-gray-500">2026-04-13</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  // Mitra Management View
  const MitraView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Mitra Management</h2>
          <p className="text-gray-500 text-sm">Manage your network of local tailors and artisans</p>
        </div>
        <button onClick={() => alert("👤 Modal formulir pendaftaran Mitra Baru ditampilkan!")} className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-teal-700 transition-colors">
          <Plus size={18} />
          Add Mitra
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Mitra" value="47" color="bg-teal-500" />
        <StatCard icon={CheckCircle} label="Available" value="32" color="bg-emerald-500" />
        <StatCard icon={Clock} label="Busy" value="15" color="bg-amber-500" />
        <StatCard icon={Star} label="Avg Rating" value="4.8" color="bg-yellow-500" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        {mitraData.map((mitra) => (
          <div key={mitra.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white font-bold">
                  {mitra.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{mitra.name}</h4>
                  <div className="flex items-center gap-1 text-gray-500 text-sm">
                    <MapPin size={12} />
                    {mitra.location}
                  </div>
                </div>
              </div>
              <StatusBadge status={mitra.capacity} />
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Specialization</span>
                <span className="font-medium">{mitra.skill}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Completed Orders</span>
                <span className="font-medium">{mitra.completed}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Rating</span>
                <div className="flex items-center gap-1">
                  <Star size={14} className="text-amber-400" fill="currentColor" />
                  <span className="font-medium">{mitra.rating}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={() => alert("Lihat detail performa, ulasan, & portfolio produksi Mitra.")} className="flex-1 text-sm font-medium text-teal-600 py-2 rounded-lg border border-teal-200 hover:bg-teal-50 transition-colors">
                View Profile
              </button>
              <button onClick={() => alert("🚀 Order Produksi baru berhasil diteruskan ke Dashboard Aplikasi Mitra ini!")} className="flex-1 text-sm font-medium text-white bg-teal-600 py-2 rounded-lg hover:bg-teal-700 transition-colors">
                Assign Order
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Orders View
  const OrdersView = () => {
    const [assigningId, setAssigningId] = React.useState(null);
    const [assignedOrders, setAssignedOrders] = React.useState({});
    const handleAssign = (id) => {
      setAssigningId(id);
      setTimeout(() => {
        setAssigningId(null);
        setAssignedOrders(prev => ({...prev, [id]: true}));
        alert('✅ SUCCESS! Tugas menjahit material (Eco-Kit) dan instruksi Pola 3D berbasis AI telah masuk ke Aplikasi Mitra (iOS/Android).');
      }, 1500);
    };
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h2 className="text-xl font-bold text-gray-900">Order Distribution</h2><p className="text-gray-500 text-sm">Lacak dan kirim bahan baku serta Pola 3D AI ke Mitra App</p></div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"><table className="w-full"><thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">ID</th><th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Product</th><th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Target Mitra</th><th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Action (Simulasi)</th></tr></thead><tbody className="divide-y divide-gray-100">{ordersData.map((order) => (<tr key={order.id} className="hover:bg-gray-50 transition-colors"><td className="px-4 py-4 font-mono text-sm">{order.id}</td><td className="px-4 py-4 text-sm font-medium">{order.product}</td><td className="px-4 py-4 text-sm">{order.mitra}</td><td className="px-4 py-4">{assignedOrders[order.id] ? (<div className="flex items-center gap-2"><span className="text-emerald-700 font-bold text-sm bg-emerald-50 px-4 py-2 rounded-full flex items-center justify-center gap-2 w-max border border-emerald-200"><CheckCircle size={16}/> Dispatched </span>
                      <button onClick={() => {
                        const orderObj = ordersData.find(o => o.id === order.id);
                        setQcData([{ id: 'QC-' + order.id.split('-')[1], orderId: order.id, product: orderObj.product, mitra: orderObj.mitra, submitted: new Date().toISOString().split('T')[0], status: 'pending' }, ...qcData]);
                        setOrdersData(ordersData.filter(o => o.id !== order.id));
                        alert('✅ SIMULASI MITRA:\nIbu/Bapak Mitra telah selesai menjahit dan menekan "Kirim ke QC". Data berhasil masuk antrean QC SuperAdmin.');
                      }} className="ml-2 text-xs bg-violet-100 text-violet-700 px-3 py-1.5 rounded-lg hover:bg-violet-200 transition font-bold w-max border border-violet-200 flex items-center gap-1 text-nowrap"><CheckCircle size={12}/> Selesai Jahit ➔ Masuk QC</button></div>) : (<button onClick={() => handleAssign(order.id)} disabled={assigningId === order.id} className={`text-sm font-medium px-4 py-2 rounded-lg flex items-center justify-center gap-2 w-max transition-all ${assigningId === order.id ? 'bg-gray-100 text-gray-400' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md'}`}>{assigningId === order.id ? 'Dispatching...' : 'Simulasi: Assign ke Mitra'}</button>)}</td></tr>))}</tbody></table></div></div>
    );
  };
  // QC Dashboard View
  const QCView = () => {
    const handleQcApprove = (item) => {
      setQcData(prev => prev.map(q => q.id === item.id ? { ...q, status: 'approved' } : q));
      setOrdersData(prev => prev.map(o => o.id === item.orderId ? { ...o, status: 'completed' } : o));
      setBlockchainData(prev => [{
        id: `DPP-00${Math.floor(Math.random() * 10) + 4}`,
        productId: `PRD-${item.orderId.split('-')[1]}`,
        txHash: 'pending...',
        status: 'queued',
        timestamp: '-',
        carbon: (Math.random() * 2 + 1.5).toFixed(1) + 'kg'
      }, ...prev]);
      alert(`✅ PRODUK LAYAK JUAL (QC Lulus)\nProduk ${item.product} dari Mitra ${item.mitra} lolos.\n1. Otomatis masuk antrean sertifikasi Blockchain DPP.\n2. Dana upah siap dicairkan (Finance Dashboard).`);
    };

    const handleQcReject = (item) => {
      setQcData(prev => prev.map(q => q.id === item.id ? { ...q, status: 'rejected' } : q));
      setOrdersData(prev => prev.map(o => o.id === item.orderId ? { ...o, status: 'in_progress' } : o));
      alert(`❌ PRODUK REJECT\nProduk ${item.product} tidak memenuhi standar. Pesanan dikembalikan kepada Mitra ${item.mitra} untuk diperbaiki.`);
    };

    return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Quality Control Dashboard</h2>
        <p className="text-gray-500 text-sm">Inspect and approve finished products before blockchain tagging</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <StatCard icon={Clock} label="Pending Review" value="8" color="bg-amber-500" />
        <StatCard icon={CheckCircle} label="Approved Today" value="12" color="bg-emerald-500" />
        <StatCard icon={X} label="Rejected" value="2" color="bg-red-500" />
        <StatCard icon={TrendingUp} label="Pass Rate" value="94%" color="bg-teal-500" />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Pending QC Review</h3>
          <div className="space-y-4">
            {qcData.filter(q => q.status === 'pending').map((item) => (
              <div key={item.id} className="p-4 border border-gray-100 rounded-xl">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-medium text-gray-900">{item.product}</p>
                    <p className="text-sm text-gray-500">{item.mitra} • {item.orderId}</p>
                  </div>
                  <StatusBadge status={item.status} />
                </div>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                    <Camera size={24} className="text-gray-400" />
                  </div>
                  <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                    <Camera size={24} className="text-gray-400" />
                  </div>
                  <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                    <Camera size={24} className="text-gray-400" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleQcApprove(item)} className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 text-white py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors shadow-sm">
                      <Check size={16} /> Approve
                    </button>
                  <button onClick={() => handleQcReject(item)} className="flex-1 flex items-center justify-center gap-2 border border-red-200 text-red-600 py-2 rounded-lg font-medium hover:bg-red-50 transition-colors">
                      <X size={16} /> Reject
                    </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">QC Checklist</h3>
          <div className="space-y-3">
            {[
              { label: 'Stitching quality (no loose threads)', checked: true },
              { label: 'Pattern alignment accuracy', checked: true },
              { label: 'Zipper/button functionality', checked: false },
              { label: 'Material cleanliness', checked: true },
              { label: 'Dimensions match specification', checked: false },
              { label: 'No visible defects or stains', checked: true },
              { label: 'NFC tag placement correct', checked: false },
            ].map((item, idx) => (
              <label key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                <input type="checkbox" defaultChecked={item.checked} className="w-5 h-5 rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
                <span className="text-sm text-gray-700">{item.label}</span>
              </label>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <label className="block text-sm font-medium text-gray-700 mb-2">QC Notes</label>
            <textarea 
              className="w-full border border-gray-200 rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-500" 
              rows={3}
              placeholder="Add inspection notes..."
            />
          </div>
        </div>
      </div>
    </div>
  );
  };

  // Blockchain View
  const BlockchainView = () => {
    const handleMintDpp = () => {
        const queuedItems = blockchainData.filter(d => d.status === 'queued');
        if (queuedItems.length === 0) {
            alert('❌ Tidak ada antrean produk di sistem untuk di-minting.');
            return;
        }
        
        const now = new Date().toLocaleString('id-ID', { hour12: false });
        
        setBlockchainData(prev => prev.map(d => 
            d.status === 'queued' ? {
                ...d, 
                status: 'minted', 
                txHash: '0x' + Math.random().toString(16).substr(2, 10) + '...cf',
                timestamp: now
            } : d
        ));
        
        alert(`✅ MINTING BERHASIL!\nSertifikat Digital Product Passport (DPP) ke jaringan Polygon berhasil di-mint.\nKonsumen sekarang bisa scan QRCode yang dijahit di baju untuk melihat riwayat perjalanan "Limbah hingga ke Lemari".`);
    };

    return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Digital Product Passport (DPP)</h2>
        <p className="text-gray-500 text-sm">Mint product certificates to Polygon blockchain for transparent traceability</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <StatCard icon={Shield} label="Total Minted" value="1,247" color="bg-purple-500" />
        <StatCard icon={Clock} label="Queued" value="8" color="bg-amber-500" />
        <StatCard icon={Leaf} label="CO₂ Tracked" value="3.2 ton" color="bg-emerald-500" />
        <StatCard icon={Link2} label="Network" value="Polygon" color="bg-violet-500" />
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Recent DPP Mints</h3>
          <div className="space-y-3">
            {blockchainData.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.status === 'minted' ? 'bg-emerald-100' : 'bg-gray-200'}`}>
                    <Shield size={20} className={item.status === 'minted' ? 'text-emerald-600' : 'text-gray-400'} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{item.productId}</p>
                    <p className="text-sm font-mono text-gray-500">{item.txHash}</p>
                  </div>
                </div>
                <div className="text-right">
                  <StatusBadge status={item.status} />
                  <p className="text-xs text-gray-400 mt-1">{item.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">DPP Preview</h3>
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 text-white">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                <Leaf size={16} />
              </div>
              <span className="font-bold">EcoThread</span>
              <span className="ml-auto text-xs bg-emerald-500/30 px-2 py-0.5 rounded">Verified</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Product</span>
                <span>Upcycled Denim Jacket</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Material Source</span>
                <span>Industrial Waste</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Artisan</span>
                <span>Ibu Siti Aminah</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Location</span>
                <span>Bandung, ID</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">CO₂ Saved</span>
                <span className="text-emerald-400">2.3 kg</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-700">
              <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                <Link2 size={12} />
                Verified on Polygon
              </div>
            </div>
          </div>
          <button onClick={handleMintDpp} className="w-full mt-4 flex flex-col items-center justify-center gap-1 bg-purple-600 text-white py-3 rounded-xl font-medium hover:bg-purple-700 transition-colors shadow-md animate-pulse">
              <div className="flex items-center gap-2"><Zap size={18} /> Mint New DPP to Polygon</div>
            </button>
        </div>
      </div>
    </div>
  );

  };

  const FinanceMitraView = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Mitra Finance & Payouts (EcoPay)</h2>
        <p className="text-gray-500 text-sm">Manage pending payouts, release funds to Mitra wallets, and view transaction history</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatCard icon={Wallet} label="Total Pending Payout" value="Rp 2,450,000" color="bg-amber-500" />
        <StatCard icon={ArrowUpRight} label="Total Released (MTD)" value="Rp 34,500,000" color="bg-emerald-500" />
        <StatCard icon={CheckCircle} label="Success Rate" value="100%" color="bg-teal-500" />
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4">Pending Wallet Transfers to Mitra</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-y border-gray-100">
              <tr>
                <th className="px-4 py-3">Transaction ID</th>
                <th className="px-4 py-3">Mitra Name</th>
                <th className="px-4 py-3">Order Ref</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {qcData.filter(q => q.status === 'pending').map((item, i) => (
                <tr key={'fin-'+i} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">TRX-82{71 + i}</td>
                  <td className="px-4 py-3">{item.mitra}</td>
                  <td className="px-4 py-3 font-mono">{item.orderId}</td>
                  <td className="px-4 py-3 font-bold text-gray-900">Rp 150,000</td>
                  <td className="px-4 py-3"><StatusBadge status="qc_pending" /></td>
                  <td className="px-4 py-3">
                    <button onClick={() => {
                        setQcData(prev => prev.map(q => q.id === item.id ? { ...q, status: 'paid' } : q));
                        alert(`💸 UPAH CAIR
Dana pencairan ke e-Wallet (EcoPay) Mitra sebesar Rp 150.000 atas nama ${item.mitra} berhasil diproses tanpa potongan!`);
                      }} className="text-emerald-600 hover:text-emerald-800 font-medium flex items-center justify-center gap-1 bg-emerald-50 px-2 py-1 rounded border border-emerald-200 hover:bg-emerald-100 transition-colors">
                        <Wallet size={14} /> Release Fund (Pay)
                      </button>
                  </td>
                </tr>
              ))}
               <tr className="hover:bg-gray-50 bg-amber-50/10">
                  <td className="px-4 py-3 font-medium text-gray-900">TRX-8280</td>
                  <td className="px-4 py-3">Pak Ahmad Hidayat</td>
                  <td className="px-4 py-3 font-mono">ORD-003</td>
                  <td className="px-4 py-3 font-bold text-gray-900">Rp 120,000</td>
                  <td className="px-4 py-3"><StatusBadge status="approved" /></td>
                  <td className="px-4 py-3">
                    <button onClick={() => alert("✅ Transaksi telah ditandai Selesai.")} className="text-white hover:text-gray-100 font-medium flex items-center gap-1 bg-emerald-600 px-3 py-1.5 rounded shadow-sm hover:bg-emerald-700 transition-colors">
                        <Wallet size={14} className="text-white" /> Complete Transfer
                      </button>
                  </td>
                </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );


      const MonitorView = () => {
      const [stats, setStats] = useState({ cpu: 45, mem: 60, activeModels: 3 });
      const [logs, setLogs] = useState([]);
      const [trackId, setTrackId] = useState('ORD-0892');

      useEffect(() => {
        const interval = setInterval(() => {
          setStats({
            cpu: Math.floor(Math.random() * 30 + 30),
            mem: Math.floor(Math.random() * 20 + 50),
            activeModels: 3
          });
          const messages = [
            "[AI System] Analisis pola potongan limbah terdeteksi.",
            "[Tracking] Kurir Logistik mengupdate GPS point...",
            "[Node] Verifikasi Block di jaringan Polygon berhasil",
            "[System] Sinkronisasi suhu data center 34C"
          ];
          setLogs(prev => [
            { time: new Date().toLocaleTimeString(), msg: messages[Math.floor(Math.random() * messages.length)] },
            ...prev.slice(0, 4)
          ]);
        }, 3000);
        return () => clearInterval(interval);
      }, []);

      const trackingSteps = [
        {
          status: 'Pesanan Telah Tiba di Lokasi Konsumen',
          desc: 'Paket telah diterima oleh Bpk. Budi di Jakarta Selatan.',
          date: 'Hari ini, 16:30',
          active: true,
          icon: <CheckCircle size={16} className="text-teal-600" />,
          color: 'bg-teal-100 ring-teal-50'
        },
        {
          status: 'Paket sedang dibawa kurir',
          desc: 'Kurir [EcoXpress] sedang menuju alamat tujuan. (Estimasi tiba: 16:45)',
          date: 'Hari ini, 09:12',
          active: false,
          icon: <Truck size={16} className="text-emerald-600" />,
          color: 'bg-emerald-100 ring-emerald-50'
        },
        {
          status: 'Pesanan keluar dari fasilitas (City Hub)',
          desc: 'Paket telah diserahterimakan kepada pihak logistik di Hub Bandung.',
          date: 'Kemarin, 19:20',
          active: false,
          icon: <Box size={16} className="text-emerald-600" />,
          color: 'bg-emerald-100 ring-emerald-50'
        },
        {
          status: 'Blockchain DPP & Sertifikasi (QC Lulus)',
          desc: 'Produk berhasil di-minting ke jaringan Polygon. Digital Product Passport aktif.',
          date: 'Kemarin, 14:05',
          active: false,
          icon: <ShieldCheck size={16} className="text-blue-600" />,
          color: 'bg-blue-100 ring-blue-50'
        },
        {
          status: 'Dikirim dari Rumah Mitra Penjahit',
          desc: 'Ibu Siti Aminah (Cigondewah) telah menyelesaikan rajutan dan mengirimkan produk jadi ke City Hub.',
          date: '15 April 2026, 11:30',
          active: false,
          icon: <Scissors size={16} className="text-amber-600" />,
          color: 'bg-amber-100 ring-amber-50'
        },
        {
          status: 'Eco-Kit Diterima Mitra',
          desc: 'Bahan baku (Limbah Denim + Aksesoris) + Panduan Pola 3D AI telah diterima Mitra.',
          date: '13 April 2026, 08:15',
          active: false,
          icon: <MapPin size={16} className="text-gray-600" />,
          color: 'bg-gray-100 ring-gray-50'
        }
      ];

      return (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Live Logistics & Tracking</h2>
              <p className="text-gray-500 text-sm">Real-time parcel tracker ala E-Commerce & AI System Monitor</p>
            </div>
            <div className="flex gap-2 items-center bg-white border border-gray-200 rounded-lg p-1.5 focus-within:ring-2 ring-teal-500">
              <Package size={18} className="text-gray-400 ml-2" />
              <input type="text" value={trackId} onChange={(e) => setTrackId(e.target.value)} className="bg-transparent border-none focus:outline-none focus:ring-0 text-sm font-mono w-32" />
              <button onClick={() => alert("Mencari resi pengiriman...")} className="bg-teal-600 text-white rounded p-1.5 hover:bg-teal-700">
                <Search size={16} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Shopee-style Tracker */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                <h3 className="font-bold text-gray-900">History Perjalanan Paket</h3>
                <span className="bg-teal-50 text-teal-700 text-xs font-bold px-3 py-1 rounded-full border border-teal-100">Sedang Dikirim</span>
              </div>
              
              <div className="relative pl-6 space-y-6 before:absolute before:inset-y-0 before:left-3 before:-ml-px before:w-0.5 before:bg-gray-200">
                {trackingSteps.map((step, idx) => (
                  <div key={idx} className="relative z-10">
                    <div className={`absolute -left-9 mt-0.5 w-6 h-6 rounded-full flex items-center justify-center ring-4 ${step.color} bg-white`}>
                       {step.active ? (
                         <div className="w-2.5 h-2.5 bg-teal-500 rounded-full animate-bounce"></div>
                       ) : step.icon}
                    </div>
                    <div className={`pt-0.5 ${step.active ? '' : 'opacity-75'}`}>
                      <p className={`text-sm font-bold ${step.active ? 'text-teal-600' : 'text-gray-800'}`}>{step.status}</p>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">{step.desc}</p>
                      <p className="text-[11px] font-medium text-gray-400 mt-1.5">{step.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Monitor & System Logs */}
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-center">
                  <h3 className="text-gray-500 text-sm mb-1">Server CPU Run</h3>
                  <p className="text-2xl font-bold text-teal-600">{stats.cpu}%</p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-center">
                  <h3 className="text-gray-500 text-sm mb-1">Memory Usage</h3>
                  <p className="text-2xl font-bold text-teal-600">{stats.mem}%</p>
                </div>
              </div>
              
              <div className="bg-gray-900 rounded-xl p-5 text-emerald-400 font-mono text-sm max-h-[400px] overflow-y-auto shadow-inner border-2 border-gray-800">
                <div className="mb-3 text-xs text-gray-400 border-b border-gray-700 pb-2 flex items-center justify-between">
                  <span>► EcoThread Node Stream</span>
                  <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div> Live</span>
                </div>
                {logs.map((log, i) => (
                  <div key={i} className="mb-1 opacity-90 hover:opacity-100 transition-opacity">
                    <span className="text-gray-500">[{log.time}]</span> {log.msg}
                  </div>
                ))}
                {logs.length === 0 && <div className="animate-pulse">Waiting for AI socket stream...</div>}
              </div>
            </div>
          </div>
        </div>
      );
    };

    const renderView = () => {
    switch (activeView) {
      case 'overview': return <OverviewView />;
      case 'inventory': return <InventoryView />;
      case 'ai-digitization': return <AIDigitizationView />;
      case 'eco-kit': return <EcoKitView />;
      case 'mitra': return <MitraView />;
      case 'orders': return <OrdersView />;
      case 'qc': return <QCView />;
      case 'finance': return <FinanceMitraView />;
      case 'blockchain': return <BlockchainView />;
      case 'monitor': return <MonitorView />;
      default: return <OverviewView />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`bg-white border-r border-gray-100 flex flex-col transition-all duration-300 ${sidebarCollapsed ? 'w-20' : 'w-64'}`}>
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center">
              <Recycle size={22} className="text-white" />
            </div>
            {!sidebarCollapsed && (
              <div>
                <h1 className="text-lg font-bold text-gray-900 leading-tight">EcoThread</h1>
                <p className="text-xs text-gray-500">Hub Admin</p>
              </div>
            )}
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${activeView === item.id ? 'bg-teal-50 text-teal-700' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <item.icon size={20} className={activeView === item.id ? 'text-teal-600' : 'text-gray-400'} />
              {!sidebarCollapsed && <span className="font-medium text-sm">{item.label}</span>}
              {!sidebarCollapsed && item.badge && (
                <span className="ml-auto bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs font-medium">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-100 h-16 flex items-center justify-between px-6 z-10 sticky top-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
              <Menu size={20} />
            </button>
            <h2 className="text-xl font-bold text-gray-800 capitalize">
              {menuItems.find(n => n.id === activeView)?.label || activeView}
            </h2>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default EcoThreadDashboard;



