const fs = require('fs');
const filepath = 'D:/LOMBA/GEMASTIK/echothread-superadmin-app/ecothread_dashboard.jsx';
let content = fs.readFileSync(filepath, 'utf8');

// 1. QCView modifications
const qc_old = `const QCView = () => (`;
const qc_new = `const QCView = () => {
    const handleQcApprove = (item) => {
      setQcData(prev => prev.map(q => q.id === item.id ? { ...q, status: 'approved' } : q));
      setOrdersData(prev => prev.map(o => o.id === item.orderId ? { ...o, status: 'completed' } : o));
      setBlockchainData(prev => [{
        id: \`DPP-00\${Math.floor(Math.random() * 10) + 4}\`,
        productId: \`PRD-\${item.orderId.split('-')[1]}\`,
        txHash: 'pending...',
        status: 'queued',
        timestamp: '-',
        carbon: (Math.random() * 2 + 1.5).toFixed(1) + 'kg'
      }, ...prev]);
      alert(\`✅ PRODUK LAYAK JUAL (QC Lulus)\\nProduk \${item.product} dari Mitra \${item.mitra} lolos.\\n1. Otomatis masuk antrean sertifikasi Blockchain DPP.\\n2. Dana upah siap dicairkan (Finance Dashboard).\`);
    };

    const handleQcReject = (item) => {
      setQcData(prev => prev.map(q => q.id === item.id ? { ...q, status: 'rejected' } : q));
      setOrdersData(prev => prev.map(o => o.id === item.orderId ? { ...o, status: 'in_progress' } : o));
      alert(\`❌ PRODUK REJECT\\nProduk \${item.product} tidak memenuhi standar. Pesanan dikembalikan kepada Mitra \${item.mitra} untuk diperbaiki.\`);
    };

    return (`

const btn_approve_old = `<button className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 text-white py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors">
                      <Check size={16} />
                      Approve
                    </button>`;
const btn_approve_new = `<button onClick={() => handleQcApprove(item)} className="flex-1 flex flex-col items-center justify-center gap-0.5 bg-emerald-600 text-white py-1.5 rounded-lg font-medium hover:bg-emerald-700 transition-colors shadow-sm">
                      <div className="flex items-center gap-1"><Check size={16} /> Approve & Mint DPP</div>
                      <span className="text-[10px] font-normal opacity-80">+ Release Rp 150k to Mitra</span>
                    </button>`;

const btn_reject_old = `<button className="flex-1 flex items-center justify-center gap-2 border border-red-200 text-red-600 py-2 rounded-lg font-medium hover:bg-red-50 transition-colors">
                      <X size={16} />
                      Reject
                    </button>`;
const btn_reject_new = `<button onClick={() => handleQcReject(item)} className="flex-1 flex flex-col items-center justify-center gap-0.5 border border-red-200 text-red-600 py-1.5 rounded-lg font-medium hover:bg-red-50 transition-colors">
                      <div className="flex items-center gap-1"><X size={16} /> Reject (Send Back)</div>
                      <span className="text-[10px] font-normal text-rose-500">Lock EcoPay Fund</span>
                    </button>`;


// 2. BlockchainView modifications
const blockchain_old = `const BlockchainView = () => (`;
const blockchain_new = `const BlockchainView = () => {
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
        
        alert(\`✅ MINTING BERHASIL!\\nSertifikat Digital Product Passport (DPP) ke jaringan Polygon berhasil di-mint.\\nKonsumen sekarang bisa scan QRCode yang dijahit di baju untuk melihat riwayat perjalanan "Limbah hingga ke Lemari".\`);
    };

    return (`

const btn_mint_old = `<button className="w-full mt-4 flex items-center justify-center gap-2 bg-purple-600 text-white py-3 rounded-xl font-medium hover:bg-purple-700 transition-colors">
              <Zap size={18} />
              Mint New DPP
            </button>`;
const btn_mint_new = `<button onClick={handleMintDpp} className="w-full mt-4 flex items-center justify-center gap-2 bg-purple-600 text-white py-3 rounded-xl font-medium shadow-md shadow-purple-200 hover:bg-purple-700 transition-colors animate-pulse">
              <Zap size={18} />
              Mint Pending DPP to Polygon
            </button>`;

// 3. FinanceView modifications
const finance_old = `<button className="text-emerald-600 hover:text-emerald-800 font-medium flex items-center justify-center gap-1 bg-emerald-50 px-2 py-1 rounded">
                        <Wallet size={14} /> Release Fund (Pay)
                      </button>`;
const finance_new = `<button onClick={() => {
                        setQcData(prev => prev.map(q => q.id === item.id ? { ...q, status: 'paid' } : q));
                        alert(\`💸 UPAH CAIR\\nDana pencairan sebesar Rp 150.000 telah otomatis masuk ke e-Wallet (EcoPay) atas nama Mitra \${item.mitra}.\`);
                      }} className="text-emerald-600 hover:text-emerald-800 font-medium flex items-center justify-center gap-1 bg-emerald-50 px-2 py-1 rounded border border-emerald-200 hover:bg-emerald-100 transition-colors">
                        <Wallet size={14} /> Release Fund (Pay)
                      </button>`;

content = content.replace(qc_old, qc_new);
content = content.replace(btn_approve_old, btn_approve_new);
content = content.replace(btn_reject_old, btn_reject_new);
content = content.replace("    );\n\n  const BlockchainView", "    );\n  };\n\n  const BlockchainView");

content = content.replace(blockchain_old, blockchain_new);
content = content.replace(btn_mint_old, btn_mint_new);
content = content.replace("    );\n\n\n  const FinanceMitraView", "    );\n  };\n\n\n  const FinanceMitraView");
content = content.replace("    );\n\n  const FinanceMitraView", "    );\n  };\n\n  const FinanceMitraView");

let financeFixCount = 0;
while (content.includes(finance_old)) {
   content = content.replace(finance_old, finance_new);
   financeFixCount++;
   if (financeFixCount > 10) break;
}

fs.writeFileSync(filepath, content);
console.log('Script ran successfully');
