const fs = require('fs');
const p = 'D:/LOMBA/GEMASTIK/echothread-superadmin-app/ecothread_dashboard.jsx';
let c = fs.readFileSync(p, 'utf8');

c = c.replace(/const OrdersView = \(\) => \([\s\S]+?<\/div>\n    <\/div>\n  \);/, \const OrdersView = () => {
    const [assigningId, setAssigningId] = React.useState(null);
    const [assignedOrders, setAssignedOrders] = React.useState({});

    const handleAssign = (id) => {
      setAssigningId(id);
      setTimeout(() => {
        setAssigningId(null);
        setAssignedOrders(prev => ({...prev, [id]: true}));
        alert('✅ SUCCESS!\\n\\nTugas menjahit material Eco-Kit dan instruksi Pola 3D berbasis AI telah masuk ke Menu "Tasks" di Aplikasi Mitra (iOS/Android).');
      }, 1500);
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Order Distribution</h2>
            <p className="text-gray-500 text-sm">Track and dispatch AI patterns + material kits to your mitra network</p>
          </div>
          <button className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-teal-700 transition-colors">
            <Plus size={18} />
            New Order
          </button>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <StatCard icon={Package} label="Total Orders" value="156" color="bg-teal-500" />
          <StatCard icon={Clock} label="In Progress" value="23" color="bg-blue-500" />
          <StatCard icon={AlertCircle} label="QC Pending" value="8" color="bg-amber-500" />
          <StatCard icon={CheckCircle} label="Completed" value="125" color="bg-emerald-500" />
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Order ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Product</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Assigned Mitra</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Progress</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Dispatch Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {ordersData.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4 font-mono text-sm">{order.id}</td>
                  <td className="px-4 py-4 text-sm font-medium">{order.product}</td>
                  <td className="px-4 py-4 text-sm">{order.mitra}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={\h-full rounded-full \\}
                          style={{ width: \\%\ }}
                        />
                      </div>
                      <span className="text-xs text-gray-500">{order.progress}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    {assignedOrders[order.id] ? (
                      <span className="text-emerald-700 font-bold text-sm bg-emerald-50 px-3 py-1.5 rounded-full flex items-center justify-center gap-1 w-max"><CheckCircle size={15}/> Dispatched to Mitra APP</span>
                    ) : (
                      <button 
                        onClick={() => handleAssign(order.id)}
                        disabled={assigningId === order.id}
                        className={\	ext-sm font-medium px-4 py-2 rounded-lg flex items-center justify-center gap-2 w-max \ transition-all\}>
                        {assigningId === order.id ? 'Sending...' : 'Assign to Mitra APP'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };\);

fs.writeFileSync(p, c);
