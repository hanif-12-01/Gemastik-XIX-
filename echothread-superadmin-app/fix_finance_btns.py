import re

filepath = r"D:\LOMBA\GEMASTIK\echothread-superadmin-app\ecothread_dashboard.jsx"

with open(filepath, "r", encoding="utf-8") as f:
    text = f.read()

# Fix Finance Release Fund
text = re.sub(
    r'<button className="text-emerald-600\s*hover:text-emerald-800 font-medium flex items-center justify-center gap-1\s*bg-emerald-50 px-2 py-1 rounded">\s*<Wallet size=\{14\} /> Release Fund \(Pay\)\s*</button>',
    r'''<button onClick={() => {
                        setQcData(prev => prev.map(q => q.id === item.id ? { ...q, status: 'paid' } : q));
                        alert(`💸 UPAH CAIR\nDana pencairan ke e-Wallet (EcoPay) Mitra sebesar Rp 150.000 atas nama ${item.mitra} berhasil diproses tanpa potongan!`);
                      }} className="text-emerald-600 hover:text-emerald-800 font-medium flex items-center justify-center gap-1 bg-emerald-50 px-2 py-1 rounded border border-emerald-200 hover:bg-emerald-100 transition-colors">
                        <Wallet size={14} /> Release Fund (Pay)
                      </button>''',
    text,
    flags=re.MULTILINE
)

# Fix Finance Complete Transfer 
text = re.sub(
    r'<button className="text-white hover:text-gray-100\s*font-medium flex items-center gap-1 bg-emerald-600 px-3 py-1\.5 rounded\s*shadow-sm">\s*<Wallet size=\{14\} className="text-white" /> Complete\s*Transfer\s*</button>',
    r'''<button onClick={() => alert("✅ Transaksi telah ditandai Selesai.")} className="text-white hover:text-gray-100 font-medium flex items-center gap-1 bg-emerald-600 px-3 py-1.5 rounded shadow-sm hover:bg-emerald-700 transition-colors">
                        <Wallet size={14} className="text-white" /> Complete Transfer
                      </button>''',
    text,
    flags=re.MULTILINE
)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(text)

print("Finance Patch applied.")
