import re

filepath = r"D:\LOMBA\GEMASTIK\echothread-superadmin-app\ecothread_dashboard.jsx"

with open(filepath, "r", encoding="utf-8") as f:
    text = f.read()

# 1. OverviewView: View All Buttons
text = re.sub(
    r'(<button)( className="text-teal-600 text-sm font-medium hover:text-teal-700">View all →</button>)',
    r'\g<1> onClick={() => setActiveView("orders")}\g<2>',
    text,
    count=1
)
text = re.sub(
    r'(<button)( className="text-teal-600 text-sm font-medium hover:text-teal-700">View all →</button>)',
    r'\g<1> onClick={() => setActiveView("mitra")}\g<2>',
    text,
    count=1
)

# 2. EcoKitView: Create New Kit
text = re.sub(
    r'(<button)( className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-teal-700 transition-colors">\s*<Plus size=\{18\} />\s*Create New Kit\s*</button>)',
    r'\g<1> onClick={() => alert("✅ Form Create New Eco-Kit material package terbuka!")}\g<2>',
    text
)

# EcoKitView: Generate Kit
text = re.sub(
    r'(<button)( className="flex items-center gap-2 bg-teal-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-teal-700 transition-colors">\s*<Box size=\{18\} />\s*Generate Kit\s*</button>)',
    r'\g<1> onClick={() => alert("📦 Eco-Kit Berhasil Dibuat dan siap dikirimkan dengan resi pengiriman.")}\g<2>',
    text
)

# 3. MitraView: Add Mitra
text = re.sub(
    r'(<button)( className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-teal-700 transition-colors">\s*<Plus size=\{18\} />\s*Add Mitra\s*</button>)',
    r'\g<1> onClick={() => alert("👤 Modal formulir pendaftaran Mitra Baru ditampilkan!")}\g<2>',
    text
)

# MitraView: View Profile
text = re.sub(
    r'(<button)( className="flex-1 text-sm font-medium text-teal-600 py-2 rounded-lg border border-teal-200 hover:bg-teal-50 transition-colors">\s*View Profile\s*</button>)',
    r'\g<1> onClick={() => alert("Lihat detail performa, ulasan, & portfolio produksi Mitra.")}\g<2>',
    text
)

# MitraView: Assign Order
text = re.sub(
    r'(<button)( className="flex-1 text-sm font-medium text-white bg-teal-600 py-2 rounded-lg hover:bg-teal-700 transition-colors">\s*Assign Order\s*</button>)',
    r'\g<1> onClick={() => alert("🚀 Order Produksi baru berhasil diteruskan ke Dashboard Aplikasi Mitra ini!")}\g<2>',
    text
)

# 4. QCView: Approve & Reject
text = re.sub(
    r'<button className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 text-white py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors">\s*<Check size=\{16\} />\s*Approve\s*</button>',
    r'''<button onClick={() => handleQcApprove(item)} className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 text-white py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors shadow-sm">
                      <Check size={16} /> Approve
                    </button>''',
    text
)

text = re.sub(
    r'<button className="flex-1 flex items-center justify-center gap-2 border border-red-200 text-red-600 py-2 rounded-lg font-medium hover:bg-red-50 transition-colors">\s*<X size=\{16\} />\s*Reject\s*</button>',
    r'''<button onClick={() => handleQcReject(item)} className="flex-1 flex items-center justify-center gap-2 border border-red-200 text-red-600 py-2 rounded-lg font-medium hover:bg-red-50 transition-colors">
                      <X size={16} /> Reject
                    </button>''',
    text
)

# 5. BlockchainView: Mint New DPP
text = re.sub(
    r'<button className="w-full mt-4 flex items-center justify-center gap-2 bg-purple-600 text-white py-3 rounded-xl font-medium hover:bg-purple-700 transition-colors">\s*<Zap size=\{18\} />\s*Mint New DPP\s*</button>',
    r'''<button onClick={handleMintDpp} className="w-full mt-4 flex flex-col items-center justify-center gap-1 bg-purple-600 text-white py-3 rounded-xl font-medium hover:bg-purple-700 transition-colors shadow-md animate-pulse">
              <div className="flex items-center gap-2"><Zap size={18} /> Mint New DPP to Polygon</div>
            </button>''',
    text
)

# 6. FinanceMitraView: Release Fund & Complete Transfer
text = re.sub(
    r'<button className="text-emerald-600 hover:text-emerald-800 font-medium flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded">\s*<Wallet size=\{14\} /> Release Fund \(Pay\)\s*</button>',
    r'''<button onClick={() => {
                        setQcData(prev => prev.map(q => q.id === item.id ? { ...q, status: 'paid' } : q));
                        alert(`💸 UPAH CAIR\nDana pencairan ke e-Wallet (EcoPay) atas nama Mitra ${item.mitra} berhasil diproses.`);
                      }} className="text-emerald-600 hover:text-emerald-800 font-medium flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded border border-emerald-200 hover:bg-emerald-100 transition-colors">
                        <Wallet size={14} /> Release Fund (Pay)
                      </button>''',
    text
)

text = re.sub(
    r'<button className="text-white hover:text-gray-100 font-medium flex items-center gap-1 bg-emerald-600 px-3 py-1\.5 rounded shadow-sm">\s*<CheckCircle size=\{14\} /> Complete Transfer\s*</button>',
    r'''<button onClick={() => alert("✅ Transaksi telah ditandai Selesai.")} className="text-white hover:text-gray-100 font-medium flex items-center gap-1 bg-emerald-600 px-3 py-1.5 rounded shadow-sm">
                        <CheckCircle size={14} /> Complete Transfer
                      </button>''',
    text
)


with open(filepath, "w", encoding="utf-8") as f:
    f.write(text)

print("Patch applied.")
