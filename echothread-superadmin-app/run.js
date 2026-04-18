const fs = require('fs');

const content = `import React, { useState, useEffect } from 'react';
import { Home, Package, Cpu, Users, Truck, CheckCircle, Link2, Settings, Bell, Search, Plus, Upload, Eye, ChevronRight, TrendingUp, Recycle, Leaf, Box, Clock, MapPin, Star, Check, X, Shield, ArrowUpRight, Scissors, Camera, RefreshCw, Wallet, QrCode, Smartphone, User } from 'lucide-react';

export default function EcoThreadDashboard() {
  const [activeTab, setActiveTab] = useState('inventory');
  
  // State Models
  const [inventory, setInventory] = useState([
    { id: 'INV-001', type: 'Denim Bekas', weight: '5 kg', status: 'Sterilized', date: '2026-04-10' },
    { id: 'INV-002', type: 'Kemeja Katun', weight: '3 kg', status: 'Raw', date: '2026-04-12' }
  ]);
  const [generatedPatterns, setGeneratedPatterns] = useState([
    { id: 'PAT-001', source: 'INV-001', name: 'Upcycled Denim Jacket', status: 'Ready' }
  ]);
  const [dispatchedOrders, setDispatchedOrders] = useState([
    { id: 'ORD-001', pattern: 'PAT-001', mitra: 'Ibu Siti (Bandung)', status: 'In Production' }
  ]);
  const [qcItems, setQcItems] = useState([
    { id: 'QC-001', order: 'ORD-001', mitra: 'Ibu Siti', status: 'Pending Review' }
  ]);
  const [blockchainMints, setBlockchainMints] = useState([
    { dppId: 'DPP-8842', item: 'QC-001', txHash: '0x3a4...9f2', ecopay: 'Rp 150.000', timestamp: '2026-04-15 10:30' }
  ]);

  const navItems = [
    { id: 'inventory', label: '1. Inventory Sourcing', icon: Package },
    { id: 'garmagenet', label: '2. AI GarmageNet', icon: Cpu },
    { id: 'dispatch', label: '3. Order Dispatch', icon: Truck },
    { id: 'qc', label: '4. QC & Blockchain', icon: Shield }
  ];

  /* --- 1. INVENTORY --- */
  const renderInventory = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between">
        <div><h2 className="text-2xl font-black text-gray-900">Inventory & Sourcing</h2><p className="text-gray-500">Pusat penerimaan limbah tekstil</p></div>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b"><tr><th className="p-4">ID</th><th className="p-4">Material</th><th className="p-4">Berat</th><th className="p-4">Status</th><th className="p-4">Aksi</th></tr></thead>
          <tbody>
            {inventory.map(item => (
              <tr key={item.id} className="border-b">
                <td className="p-4 font-mono">{item.id}</td><td className="p-4">{item.type}</td><td className="p-4">{item.weight}</td>
                <td className="p-4">
                  <span className={item.status === 'Sterilized' ? "bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-bold" : "bg-amber-100 text-amber-700 px-3 py-1 rounded-full font-bold"}>{item.status}</span>
                </td>
                <td className="p-4">
                  {item.status === 'Raw' ? (
                    <button onClick={() => setInventory(inventory.map(i => i.id === item.id ? {...i, status: 'Sterilized'} : i))} className="text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg font-bold">Proses Steril</button>
                  ) : (
                    <button onClick={() => setActiveTab('garmagenet')} className="text-blue-600 font-bold flex gap-1 items-center">Kirim AI <ArrowUpRight size={16}/></button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  /* --- 2. GARMAGENET AI --- */
  const renderGarmageNet = () => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [selectedInv, setSelectedInv] = useState('INV-001');

    const handleGenerate = () => {
      setIsGenerating(true);
      setTimeout(() => {
        setIsGenerating(false);
        setGeneratedPatterns([...generatedPatterns, { id: "PAT-00" + (generatedPatterns.length + 2), source: selectedInv, name: "Upcycled Patchwork Bag", status: "Ready" }]);
      }, 2500);
    };

    return (
      <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
        <div><h2 className="text-2xl font-black text-gray-900 flex gap-2 items-center"><Cpu className="text-blue-600"/> GarmageNet AI</h2><p className="text-gray-500">Generate pola jahitan 3D otomatis</p></div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white border rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold mb-4">1. Masukkan Material</h3>
            <select value={selectedInv} onChange={e => setSelectedInv(e.target.value)} className="w-full p-3 border rounded-xl mb-6 bg-gray-50 block outline-blue-500">
              {inventory.filter(i => i.status === 'Sterilized').map(i => <option key={i.id} value={i.id}>{i.id} - {i.type}</option>)}
            </select>
            <div className="border-2 border-dashed border-blue-200 p-8 text-center text-blue-500 rounded-xl mb-6 bg-blue-50"><Upload className="mx-auto mb-2" size={32}/><p className="font-bold">Upload Foto Material</p></div>
            <button onClick={handleGenerate} disabled={isGenerating} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-blue-700 disabled:opacity-50">
              {isGenerating ? <RefreshCw className="animate-spin" size={20}/> : <Cpu size={20}/>} {isGenerating ? 'AI Sedang Memproses...' : 'Generate Pola 3D'}
            </button>
          </div>
          <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl">
            <h3 className="font-bold text-blue-400 mb-4">Output (Eco-Kit)</h3>
            <div className="space-y-3">
              {generatedPatterns.map(pat => (
                <div key={pat.id} className="bg-slate-800 border border-slate-700 p-4 rounded-xl flex justify-between items-center">
                  <div className="flex gap-3 items-center"><Box className="text-blue-400"/><div><h4 className="font-bold">{pat.name}</h4><p className="text-xs text-slate-400">Dari: {pat.source}</p></div></div>
                  <span className="bg-emerald-900 text-emerald-400 font-bold px-3 py-1 rounded-full text-xs">{pat.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  /* --- 3. DISPATCH --- */
  const renderDispatch = () => {
    const handleDispatch = (patId) => {
      setDispatchedOrders([...dispatchedOrders, { id: "ORD-00" + (dispatchedOrders.length + 2), pattern: patId, mitra: "Mitra Lokal Terdekat", status: "Assigned" }]);
      setGeneratedPatterns(generatedPatterns.filter(p => p.id !== patId));
    };

    return (
      <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
        <div><h2 className="text-2xl font-black text-gray-900">Distribusi Order</h2><span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full mt-2 inline-block">Radius AI: <10 KM</span></div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white border rounded-2xl flex flex-col overflow-hidden"><div className="bg-gray-50 border-b p-4 font-bold">Pola Menunggu (Eco-Kit)</div>
            <div className="p-4 space-y-3">
              {generatedPatterns.map(pat => (
                <div key={pat.id} className="flex justify-between items-center border p-4 rounded-xl bg-white"><div className="font-bold">{pat.name}</div><button onClick={() => handleDispatch(pat.id)} className="bg-emerald-600 text-white font-bold text-sm px-4 py-2 rounded-lg flex items-center gap-2">Assign <Truck size={16}/></button></div>
              ))}
              {generatedPatterns.length === 0 && <p className="text-gray-400 text-center py-4">Kosong</p>}
            </div>
          </div>
          <div className="bg-white border rounded-2xl flex flex-col overflow-hidden"><div className="bg-gray-50 border-b p-4 font-bold flex justify-between">Live Mitra Status <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"/></div>
            <div className="p-4 space-y-3 overflow-y-auto max-h-96">
              {dispatchedOrders.map(ord => (
                <div key={ord.id} className="border p-4 rounded-xl bg-slate-50"><div className="flex justify-between mb-2"><span className="font-bold">{ord.id}</span> <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded">{ord.status}</span></div>
                  <div className="text-sm my-1 flex gap-2"><User size={16}/> {ord.mitra}</div><div className="text-sm flex gap-2"><Scissors size={16}/> {ord.pattern}</div>
                  <button onClick={() => {
                    setQcItems([...qcItems, { id: "QC-00" + (qcItems.length + 2), order: ord.id, mitra: ord.mitra, status: "Pending Review" }]);
                    setDispatchedOrders(dispatchedOrders.filter(o => o.id !== ord.id));
                  }} className="mt-4 text-xs bg-emerald-100 text-emerald-700 font-bold px-3 py-1.5 rounded w-full border border-emerald-200 text-center hover:bg-emerald-200">
                    [SIMULASI] Order Selesai ? Kirim ke QC
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  /* --- 4. QC & BLOCKCHAIN --- */
  const renderQCBlockchain = () => {
    const [mintingId, setMintingId] = useState(null);

    const handleApprove = (qcId) => {
      setMintingId(qcId);
      setTimeout(() => {
        setMintingId(null);
        setQcItems(qcItems.filter(q => q.id !== qcId));
        setBlockchainMints([{ dppId: "DPP-" + Math.floor(Math.random()*9000+1000), item: qcId, txHash: "0x"+Math.random().toString(16).substr(2,8)+"...", ecopay: "Rp " + (Math.floor(Math.random()*50)+100) + ".000", timestamp: new Date().toLocaleString() }, ...blockchainMints]);
      }, 3500);
    };

    return (
      <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
        <div><h2 className="text-2xl font-black text-gray-900 flex items-center gap-2"><Shield className="text-violet-600"/> QC & Web3 Minting</h2><p className="text-gray-500">Approve jahitan, buat DPP, & Cairkan EcoPay</p></div>
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="font-bold bg-gray-100 p-3 rounded-lg border">1. Inbox Quality Control</h3>
            {qcItems.map(qc => (
              <div key={qc.id} className={\`bg-white border p-5 rounded-2xl relative \${mintingId === qc.id ? 'border-violet-500 ring-4 ring-violet-100' : ''}\`}>
                {mintingId === qc.id && (
                  <div className="absolute inset-0 bg-violet-900/90 text-white flex flex-col items-center justify-center z-10 rounded-2xl">
                    <RefreshCw className="animate-spin mb-3 text-violet-300" size={32}/>
                    <div className="font-bold text-lg">Minting Smart Contract...</div><div className="text-xs text-violet-300 font-mono mt-1">DPP & EcoPay Transferring</div>
                  </div>
                )}
                <div className="flex justify-between mb-4"><div><h4 className="font-bold">{qc.id}</h4><p className="text-sm text-gray-500">Dari: {qc.mitra}</p></div><span className="bg-amber-100 text-amber-700 font-bold text-xs px-3 py-1 rounded-full">{qc.status}</span></div>
                <div className="bg-gray-50 border border-dashed h-24 mb-4 flex justify-center items-center rounded-xl text-gray-400"><Camera/><span className="text-sm ml-2">Foto Hasil Jahitan</span></div>
                <button onClick={() => handleApprove(qc.id)} className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl flex justify-center gap-2 hover:bg-emerald-700"><CheckCircle/> Approve & Mint DPP</button>
              </div>
            ))}
            {qcItems.length === 0 && <p className="text-center py-6 text-gray-400 border-2 border-dashed rounded-xl">Belum ada order untuk direview.</p>}
          </div>
          <div className="space-y-4">
            <h3 className="font-bold bg-violet-50 text-violet-800 p-3 rounded-lg border flex justify-between">2. DPP & EcoPay Ledger <QrCode size={18}/></h3>
            <div className="bg-gradient-to-tr from-violet-950 to-indigo-900 p-6 rounded-2xl text-white h-[500px] overflow-y-auto shadow-xl space-y-4">
              {blockchainMints.map(dpp => (
                <div key={dpp.dppId} className="bg-white/10 border border-white/20 p-4 rounded-xl">
                  <div className="flex justify-between mb-3"><div className="flex items-center gap-2"><Link2 className="text-violet-300" size={16}/><span className="font-black text-lg">{dpp.dppId}</span></div><span className="text-xs text-violet-200">{dpp.timestamp}</span></div>
                  <div className="border-b border-white/10 pb-3 mb-3 text-sm space-y-1"><p><span className="text-gray-400">Order QC: </span>{dpp.item}</p><p><span className="text-gray-400">Tx Hash: </span><span className="text-blue-300 font-mono bg-blue-900/30 px-1 rounded">{dpp.txHash}</span></p></div>
                  <div className="flex justify-between items-center text-sm font-medium"><div className="flex items-center gap-2 bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-lg"><Wallet size={16}/> EcoPay: {dpp.ecopay}</div><CheckCircle className="text-emerald-400" size={20}/></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50/50">
      <aside className="w-72 bg-zinc-950 text-white shadow-xl flex flex-col z-20">
        <div className="p-6 border-b border-zinc-800 flex items-center gap-3"><Recycle className="text-emerald-400" size={32}/><div><h1 className="font-black text-xl text-emerald-400">EcoThread</h1><p className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono mt-0.5">Super Admin</p></div></div>
        <nav className="p-4 space-y-2 flex-1">
          {navItems.map(i => (
            <button key={i.id} onClick={() => setActiveTab(i.id)} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all text-sm ${activeTab === i.id ? "bg-emerald-600/20 text-emerald-400 border border-emerald-500/30" : "text-zinc-400 hover:bg-zinc-900 border border-transparent"}`}>
              <i.icon size={20} className={activeTab === i.id ? "text-emerald-400" : ""}/> {i.label}
            </button>
          ))}
        </nav>
      </aside>
      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b flex justify-between items-center px-8 z-10 shrink-0"><div className="bg-gray-100 font-medium px-4 py-1.5 rounded-lg text-sm text-gray-600 flex items-center shadow-inner">City Hub Jakarta <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse ml-3"/></div><div className="flex gap-3 items-center"><div className="w-8 h-8 rounded-full bg-emerald-500 text-white font-bold flex justify-center items-center">SA</div><span className="font-bold text-sm">Super Admin</span></div></header>
        <div className="p-8 flex-1 overflow-y-auto relative"><div className="max-w-6xl mx-auto">{activeTab === 'inventory' && renderInventory()}{activeTab === 'garmagenet' && renderGarmageNet()}{activeTab === 'dispatch' && renderDispatch()}{activeTab === 'qc' && renderQCBlockchain()}</div></div>
      </main>
    </div>
  );
}
`
fs.writeFileSync('build_mvp2.js', `const fs = require('fs');\nfs.writeFileSync('ecothread_dashboard.jsx', \`${content}\`);\nconsole.log('Done!');\n`);
