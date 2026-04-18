const fs = require('fs');
let code = fs.readFileSync('ecothread_dashboard.jsx', 'utf-8');
const searchString = "Dispatched to Mitra APP</span>) :";

const rep = `Ditugaskan</span>
                      <button onClick={() => {
                        const orderObj = ordersData.find(o => o.id === order.id);
                        setQcData([{ id: 'QC-' + order.id.split('-')[1], orderId: order.id, product: orderObj.product, mitra: orderObj.mitra, submitted: new Date().toISOString().split('T')[0], status: 'pending' }, ...qcData]);
                        setOrdersData(ordersData.filter(o => o.id !== order.id));
                        alert('✅ Jahitan Selesai! Dikirim ke Inbox QC');
                      }} className="ml-2 text-xs bg-purple-100 text-purple-700 px-3 py-1.5 rounded-lg font-bold">Menjahit Selesai ➔ QC</button>
                    ) :`;

code = code.replace(searchString, rep);
fs.writeFileSync('ecothread_dashboard.jsx', code);
console.log('Done replacement');
