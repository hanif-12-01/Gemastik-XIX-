import re

with open('D:/LOMBA/GEMASTIK/echothread-superadmin-app/ecothread_dashboard.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

replacement = """  const OrdersView = () => {
    const [assigningId, setAssigningId] = React.useState(null);
    const [assignedOrders, setAssignedOrders] = React.useState({});

    const handleAssign = (id) => {
      setAssigningId(id);
      setTimeout(() => {
        setAssigningId(null);
        setAssignedOrders(prev => ({...prev, [id]: true}));
        alert('✅ SUCCESS!\\n\\nTugas menjahit material (Eco-Kit) dan instruksi Pola 3D berbasis AI telah masuk ke Menu \"Tasks\" di Aplikasi Mitra (iOS/Android).');
      }, 1500);
    };

    return (
      <div className=\"space-y-6\">
        <div className=\"flex items-center justify-between\">
          <div>
            <h2 className=\"text-xl font-bold text-gray-900\">Order Distribution</h2>
            <p className=\"text-gray-500 text-sm\">Lacak dan kirim bahan baku serta Pola 3D AI ke Mitra App</p>
          </div>
        </div>

        <div className=\"grid grid-cols-4 gap-4\">
          <StatCard icon={Package} label=\"Total Orders\" value=\"156\" color=\"bg-teal-500\" />
          <StatCard icon={Clock} label=\"In Progress\" value=\"23\" color=\"bg-blue-500\" />
          <StatCard icon={AlertCircle} label=\"QC Pending\" value=\"8\" color=\"bg-amber-500\" />
          <StatCard icon={CheckCircle} label=\"Completed\" value=\"125\" color=\"bg-emerald-500\" />
        </div>

        <div className=\"bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden\">
          <table className=\"w-full\">
            <thead className=\"bg-gray-50\">
              <tr>
                <th className=\"px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase\">ID</th>
                <th className=\"px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase\">Product</th>
                <th className=\"px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase\">Target Mitra</th>
                <th className=\"px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase\">Action (Simulasi)</th>
              </tr>
            </thead>
            <tbody className=\"divide-y divide-gray-100\">
              {ordersData.map((order) => (
                <tr key={order.id} className=\"hover:bg-gray-50 transition-colors\">
                  <td className=\"px-4 py-4 font-mono text-sm\">{order.id}</td>
                  <td className=\"px-4 py-4 text-sm font-medium\">{order.product}</td>
                  <td className=\"px-4 py-4 text-sm\">{order.mitra}</td>
                  <td className=\"px-4 py-4\">
                    {assignedOrders[order.id] ? (
                      <span className=\"text-emerald-700 font-bold text-sm bg-emerald-50 px-4 py-2 rounded-full flex items-center justify-center gap-2 w-max shadow-sm border border-emerald-200\">
                        <CheckCircle size={16}/> Dispatched to Mitra APP
                      </span>
                    ) : (
                      <button onClick={() => handleAssign(order.id)} disabled={assigningId === order.id} className={`text-sm font-medium px-4 py-2 rounded-lg flex items-center justify-center gap-2 w-max transition-all ${assigningId === order.id ? 'bg-gray-100 text-gray-400' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md'}`}>
                        {assigningId === order.id ? 'Dispatching...' : 'Simulasi: Assign ke Mitra'}
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
  };"""

c = re.sub(r'const OrdersView = \(\)( => \([\s\S]*?| => \{\n[\s\S]*?)  // AI Digitization View', replacement + '\n\n  // AI Digitization View', c, count=1)

with open('D:/LOMBA/GEMASTIK/echothread-superadmin-app/ecothread_dashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(c)

print('Rewrite complete!')
