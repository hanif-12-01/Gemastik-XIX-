const fs = require('fs');
let code = fs.readFileSync('ecothread_dashboard.jsx', 'utf-8');

const tTarget = `<button className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 text-white py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors">
                      <Check size={16} />
                      Approve
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 border border-red-200 text-red-600 py-2 rounded-lg font-medium hover:bg-red-50 transition-colors">
                      <X size={16} />
                      Reject
                    </button>`;
const tResult = `<button onClick={() => {
                        setQcData(qcData.filter(q => q.id !== item.id));
                        setBlockchainData([{ id: 'DPP-' + Math.floor(Math.random()*9000), productId: parseInt(Math.random()*9000), txHash: '0x' + Math.random().toString(16).substr(2, 10).padEnd(10,'0') + '...3c2e', status: 'minted', timestamp: new Date().toLocaleString(), carbon: '2.5kg' }, ...blockchainData]);
                        alert('✅ APPROVED & MINTED!\\n\\n1. Kualitas lolos QC.\\n2. Digital Product Pasport (DPP) tercipta di Web3.\\n3. Saldo uang EcoPay Rp150.000 Otomatis Dicairkan secara instan ke dompet digital Mitra.');
                    }} className="flex-1 flex items-center justify-center gap-1 bg-emerald-600 text-white py-2 rounded-lg font-bold hover:bg-emerald-700 transition-colors text-xs text-nowrap shadow-md">
                      <Check size={14} /> Approve & Mint DPP
                    </button>
                    <button onClick={() => setQcData(qcData.filter(q => q.id !== item.id))} className="flex-1 flex items-center justify-center gap-2 border border-red-200 text-red-600 py-2 rounded-lg font-medium hover:bg-red-50 transition-colors shadow-sm">
                      <X size={14} />
                      Reject
                    </button>`;
fs.writeFileSync('ecothread_dashboard.jsx', code.replace(tTarget, tResult));
console.log('Fixed QC button')
