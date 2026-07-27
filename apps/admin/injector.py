import re

with open("ecothread_dashboard.jsx", "r", encoding="utf-8") as f:
    text = f.read()

# Ubah variabel array constant menjadi React state pakai fungsi lambda agar isi inner tidak terduplikasi 
for var in ["inventoryData", "ordersData", "qcData", "blockchainData"]:
    text = re.sub(
        r"const " + var + r" = \[(.*?)\];",
        r"const [" + var + r", set" + var[0].upper() + var[1:] + r"] = useState([\1]);",
        text,
        flags=re.DOTALL
    )

# Eksekusi Logic 1: Di page inventory action ganti ke logika button
inv_action_old = """                  <td className="px-4 py-4">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <MoreVertical size={16} className="text-gray-400" />
                    </button>
                  </td>"""
inv_action_new = """                  <td className="px-4 py-4 flex gap-2">
                    {item.status === 'received' || item.status === 'processing' ? (
                      <button onClick={() => setInventoryData(inventoryData.map(i => i.id === item.id ? {...i, status: 'sterilized'} : i))} className="text-xs bg-amber-100 text-amber-700 px-3 py-1.5 rounded-lg hover:bg-amber-200 transition font-bold">Sterilkan</button>
                    ) : item.status === 'sterilized' ? (
                      <button onClick={() => { setActiveView('ai-digitization'); alert('Limbah sudah siap di scanning.\\nSedang mengalihkan Anda ke AI GarmageNet untuk di-Generate menjadi pola/eco-kit...'); }} className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-indigo-200 transition font-bold text-nowrap">Kirim AI <Cpu size={12}/></button>
                    ) : null}
                  </td>"""
if inv_action_old in text:
    text = text.replace(inv_action_old, inv_action_new)
else:
    print("Warning: could not find Inventory Action old text")

# Eksekusi Logic 2: Di AI processing buat dia menambahkan ke list ordersData
ai_old = """    const simulateProcessing = () => {
      setProcessingStage('scanning');
      setTimeout(() => setProcessingStage('mapping'), 1500);
      setTimeout(() => setProcessingStage('generating'), 3000);
      setTimeout(() => {
        setProcessingStage('complete');
        setGeneratedPattern(true);
      }, 4500);
    };"""
ai_new = """    const simulateProcessing = () => {
      setProcessingStage('scanning');
      setTimeout(() => setProcessingStage('mapping'), 1500);
      setTimeout(() => setProcessingStage('generating'), 3000);
      setTimeout(() => {
        setProcessingStage('complete');
        setGeneratedPattern(true);
        setOrdersData([{ id: 'ORD-' + Math.floor(Math.random()*1000), product: 'AI Generated Eco-Kit', mitra: 'Available (Target AI)', status: 'pending', deadline: '2026-04-20', progress: 0 }, ...ordersData]);
      }, 4500);
    };"""
if ai_old in text:
    text = text.replace(ai_old, ai_new)
else:
    print("Warning: could not find AI simulate old text")

# Eksekusi Logic 3: Di bagian QC approval hubungkan data ke Blockchain minting Data
qc_old = """                  <div className="flex gap-2">
                    <button className="flex-1 py-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors font-medium text-sm">
                      Approve
                    </button>
                    <button className="flex-1 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm">
                      Reject
                    </button>
                  </div>"""

qc_new = """                  <div className="flex gap-2">
                    <button onClick={() => {
                      setQcData(qcData.filter(q => q.id !== item.id));
                      setBlockchainData([{ id: 'DPP-' + Math.floor(Math.random()*9000), productId: 'PRD-' + Math.floor(Math.random()*900), txHash: '0x' + Math.random().toString(16).substr(2, 10) + '...', status: 'minted', timestamp: new Date().toLocaleString(), carbon: '2.5kg' }, ...blockchainData]);
                      alert('✅ APPROVED & MINTED!\\n\\n1. Kualitas jahitan lolos Quality Control.\\n2. Digital Product Passport (DPP) tercipta di jaringan Web3.\\n3. Saldo uang EcoPay Otomatis Dicairkan secara instan ke dompet digital milik ' + item.mitra);
                    }} className="flex-1 py-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors font-medium text-sm text-nowrap">
                      Approve & Mint
                    </button>
                    <button onClick={() => setQcData(qcData.filter(q => q.id !== item.id))} className="flex-1 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm">
                      Reject
                    </button>
                  </div>"""
if qc_old in text:
    text = text.replace(qc_old, qc_new)
else:
    print("Warning: could not find QC button old text")
    
# Eksekusi Logic 4: Ganti tombol Assigned di Order distribution supaya dia bisa simulasi selesai (Kirim ke QC)
orders_assign_old = """setAssignedOrders(prev => ({...prev, [id]: true}));
          alert('✅ SUCCESS! Tugas menjahit material (Eco-Kit) dan instruksi Pola 3D berbasis AI telah masuk ke Aplikasi Mitra (iOS/Android).');"""
orders_assign_new = """setAssignedOrders(prev => ({...prev, [id]: true}));
          setOrdersData(ordersData.map(o => o.id === id ? {...o, status: 'in_progress'} : o));
          alert('✅ SUCCESS!\\n\\nTugas pembuatan baju dari AI Garmagenet telah berhasil dilempar ke ponsel pintar Mitra Jahit ' + id);"""
if orders_assign_old in text:
    text = text.replace(orders_assign_old, orders_assign_new)
else:
    print("Warning: could not find Order assign JS string")

# Eksekusi Logic 5: Tambahkan button selesai jahit (Tandai Selesai)      
bt_old = """<CheckCircle size={16}/> Dispatched to Mitra APP</span>"""
bt_new = """<CheckCircle size={16}/> Dispatched </span>
                      <button onClick={() => {
                        const orderObj = ordersData.find(o => o.id === order.id);
                        setQcData([{ id: 'QC-' + order.id.split('-')[1], orderId: order.id, product: orderObj.product, mitra: orderObj.mitra, submitted: new Date().toISOString().split('T')[0], status: 'pending' }, ...qcData]);
                        setOrdersData(ordersData.filter(o => o.id !== order.id));
                        alert('✅ SIMULASI MITRA:\\nIbu/Bapak Mitra telah selesai menjahit dan menekan "Kirim ke QC". Data berhasil masuk antrean QC SuperAdmin.');
                      }} className="ml-2 text-xs bg-violet-100 text-violet-700 px-3 py-1.5 rounded-lg hover:bg-violet-200 transition font-bold w-max border border-violet-200 flex items-center gap-1 text-nowrap"><CheckCircle size={12}/> Selesai Jahit ➔ Masuk QC</button>"""
if bt_old in text:
    text = text.replace(bt_old, bt_new)
else:
    print("Warning: could not find Button text "+bt_old)

with open("ecothread_dashboard.jsx", "w", encoding="utf-8") as f:
    f.write(text)
print("Done linking features!")

