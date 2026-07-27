const fs = require('fs');
let text = fs.readFileSync('D:/LOMBA/GEMASTIK/echothread-superadmin-app/ecothread_dashboard.jsx', 'utf8');

text = text.replace(/<aside className=\{g-white[^>]+>/g, '<aside className={`bg-white border-r border-gray-100 flex flex-col transition-all duration-300 ${sidebarCollapsed ? "w-20" : "w-64"}`}>');
text = text.replace(/className=\{w-full flex items-center gap-3 px-3 py-2\.5 rounded-xl[\s\S]*?transition-all \\?\}/g, 'className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${activeView === item.id ? "bg-teal-50 text-teal-700" : "text-gray-600 hover:bg-gray-50"}`}');

fs.writeFileSync('D:/LOMBA/GEMASTIK/echothread-superadmin-app/ecothread_dashboard.jsx', text, 'utf8');
console.log('Fixed successfully');
