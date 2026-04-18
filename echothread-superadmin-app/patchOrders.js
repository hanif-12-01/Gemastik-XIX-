const fs = require('fs');
let code = fs.readFileSync('ecothread_dashboard.jsx', 'utf-8');

const t2 = `<CheckCircle size={16}/> Dispatched to Mitra APP</span>) : (
                      <button onClick={() => handleAssign(order.id)} disabled={assigningId === order.id} className={\`text-sm font-medium px-4 py-2 rounded-lg flex items-center justify-center gap-2 w-max transition-all \${assigningId === order.id ? 'bg-gray-100 text-gray-400' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md'}\`}>
                        {assigningId === order.id ? 'Dispatching...' : 'Simulasi: Assign ke Mitra'}
                      </button>
                    )}
                  </td>`;

const r2 = `<CheckCircle size={16}/> Ditugaskan</span>
                      <button onClick={() => {
                        const orderObj = ordersData.find(o => o.id === order.id);
                        setQcData([{ id: 'QC-' + order.id.split('-')[1], orderId: order.id, product: orderObj.product, mitra: orderObj.mitra, submitted: new Date().toISOString().split('T')[0], status: 'pending' }, ...qcData]);
                        setOrdersData(ordersData.filter(o => o.id !== order.id));
                        alert('✅ Jahitan ' + order.id + ' Selesai! Dikirim ke Inbox QC');
                      }} className="ml-2 text-xs bg-purple-100 text-purple-700 px-3 py-1.5 rounded-lg border border-purple-200 hover:bg-purple-200 transition font-bold w-max shadow-sm">Selesai ➔ Masuk QC</button>
                      </div>
                    ) : (
                      <button onClick={() => handleAssign(order.id)} disabled={assigningId === order.id} className={\`text-sm font-medium px-4 py-2 rounded-lg flex items-center justify-center gap-2 w-max transition-all \${assigningId === order.id ? 'bg-gray-100 text-gray-400' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md'}\`}>
                        {assigningId === order.id ? 'Dispatching...' : 'Simulasi: Assign ke Mitra'}
                      </button>
                    )}
                  </td>`;

// Also fix the assigned action body
let oldBody = `setTimeout(() => {
        setAssigningId(null);
        setAssignedOrders(prev => ({...prev, [id]: true}));
        alert('✅ SUCCESS!\\n\\nTugas menjahit material (Eco-Kit) dan instruksi Pola 3D berbasis AI telah masuk ke Menu "Tasks" di Aplikasi Mitra (iOS/Android).');
      }, 1500);`;
let newBody = `setTimeout(() => {
        setAssigningId(null);
        setAssignedOrders(prev => ({...prev, [id]: true}));
        setOrdersData(ordersData.map(o => o.id === id ? {...o, status: 'in_progress'} : o));
        alert('✅ SUCCESS!\\n\\nTugas menjahit (Eco-Kit) berhasil dilempar ke Aplikasi Mitra (Ibu Siti).');
      }, 1500);`;

if(code.indexOf('Dispatched to Mitra APP')>-1) {
    code = code.replace(t2, r2.replace('</div>', ''));
    console.log('p1 fixed');
}
if(code.indexOf('setAssignedOrders(prev => ({...prev, [id]: true}));')>-1) {
    code = code.replace(oldBody, newBody);
    console.log('p2 fixed');
}

fs.writeFileSync('ecothread_dashboard.jsx', code);
