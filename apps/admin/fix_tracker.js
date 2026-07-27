const fs = require('fs');
const filepath = 'D:/LOMBA/GEMASTIK/echothread-superadmin-app/ecothread_dashboard.jsx';
let content = fs.readFileSync(filepath, 'utf8');

const monitor_old = `    const MonitorView = () => {
      const [stats, setStats] = useState({ cpu: 45, mem: 60, activeModels: 3 });
      const [logs, setLogs] = useState([]);

      useEffect(() => {
        const interval = setInterval(() => {
          setStats({
            cpu: Math.floor(Math.random() * 30 + 30),
            mem: Math.floor(Math.random() * 20 + 50),
            activeModels: 3
          });
          setLogs(prev => [
            { time: new Date().toLocaleTimeString(), msg: "[AI Model] Memproses data sampah masuk dari Mitra..." },
            ...prev.slice(0, 4)
          ]);
        }, 3000);
        return () => clearInterval(interval);
      }, []);

      return (
        <div className="p-6 space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">Live AI & Logistics Tracking</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="text-gray-500 mb-2">CPU Usage</h3>
              <p className="text-3xl font-bold text-teal-600">{stats.cpu}%</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="text-gray-500 mb-2">Memory Usage</h3>
              <p className="text-3xl font-bold text-teal-600">{stats.mem}%</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="text-gray-500 mb-2">Active AI Models</h3>
              <p className="text-3xl font-bold text-teal-600">{stats.activeModels}</p>
            </div>
          </div>
          <div className="bg-gray-900 rounded-xl p-6 text-green-400 font-mono text-sm max-h-64 overflow-y-auto">
            {logs.map((log, i) => (
              <div key={i}>[{log.time}] {log.msg}</div>
            ))}
            {logs.length === 0 && <div>Menunggu data AI stream...</div>}
          </div>
        </div>
      );
    };`;

const monitor_new = `    const MonitorView = () => {
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
                    <div className={\`absolute -left-9 mt-0.5 w-6 h-6 rounded-full flex items-center justify-center ring-4 \${step.color} bg-white\`}>
                       {step.active ? (
                         <div className="w-2.5 h-2.5 bg-teal-500 rounded-full animate-bounce"></div>
                       ) : step.icon}
                    </div>
                    <div className={\`pt-0.5 \${step.active ? '' : 'opacity-75'}\`}>
                      <p className={\`text-sm font-bold \${step.active ? 'text-teal-600' : 'text-gray-800'}\`}>{step.status}</p>
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
    };`;

if(content.includes('const MonitorView = () => {')) {
    // Only replace the function
    const startIdx = content.indexOf('const MonitorView = () => {');
    const matchStr = 'const renderView = () => {';
    const endIdx = content.indexOf(matchStr, startIdx);
    if(startIdx !== -1 && endIdx !== -1) {
        const originalContent = content.substring(0, startIdx) + monitor_new + '\n\n    ' + content.substring(endIdx);
        fs.writeFileSync(filepath, originalContent);
        console.log("Success tracker patch!");
    } else {
        console.log("Could not find boundaries.");
    }
} else {
   console.log("MonitorView not found.");
}
