const fs = require('fs');
const filepath = 'd:/LOMBA/GEMASTIK/echothread-superadmin-app/ecothread_dashboard.jsx';
let content = fs.readFileSync(filepath, 'utf8');

const oldStr = `<button className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 text-white py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors">
               <Check size={16} />
               Approve
             </button>`;
const newStr = `<button className="flex-1 flex flex-col items-center justify-center gap-0.5 bg-emerald-600 text-white py-1.5 rounded-lg font-medium hover:bg-emerald-700 transition-colors shadow-sm">
               <div className="flex items-center gap-1"><Check size={16} /> Approve & Mint DPP</div>
               <span className="text-[10px] font-normal opacity-80">+ Release Rp 150k to Mitra</span>
             </button>`;

const oldStr2 = `<button className="flex-1 flex items-center justify-center gap-2 border border-red-200 text-red-600 py-2 rounded-lg font-medium hover:bg-red-50 transition-colors">
               <X size={16} />
               Reject
             </button>`;
const newStr2 = `<button className="flex-1 flex flex-col items-center justify-center gap-0.5 border border-red-200 text-red-600 py-1.5 rounded-lg font-medium hover:bg-red-50 transition-colors">
               <div className="flex items-center gap-1"><X size={16} /> Reject (Send Back)</div>
               <span className="text-[10px] font-normal text-rose-500">Lock EcoPay Fund</span>
             </button>`;

content = content.replace(oldStr, newStr);
content = content.replace(oldStr2, newStr2);
fs.writeFileSync(filepath, content);