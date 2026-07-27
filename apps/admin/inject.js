const fs = require('fs');
const filepath = 'd:/LOMBA/GEMASTIK/echothread-superadmin-app/ecothread_dashboard.jsx';
let content = fs.readFileSync(filepath, 'utf8');

const financeComponent = `
  const FinanceMitraView = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Mitra Finance & Payouts (EcoPay)</h2>
        <p className="text-gray-500 text-sm">Manage pending payouts, release funds to Mitra wallets, and view transaction history</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatCard icon={Wallet} label="Total Pending Payout" value="Rp 2,450,000" color="bg-amber-500" />
        <StatCard icon={ArrowUpRight} label="Total Released (MTD)" value="Rp 34,500,000" color="bg-emerald-500" />
        <StatCard icon={CheckCircle} label="Success Rate" value="100%" color="bg-teal-500" />
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4">Pending Wallet Transfers to Mitra</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-y border-gray-100">
              <tr>
                <th className="px-4 py-3">Transaction ID</th>
                <th className="px-4 py-3">Mitra Name</th>
                <th className="px-4 py-3">Order Ref</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {qcData.filter(q => q.status === 'pending').map((item, i) => (
                <tr key={'fin-'+i} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">TRX-82{71 + i}</td>
                  <td className="px-4 py-3">{item.mitra}</td>
                  <td className="px-4 py-3 font-mono">{item.orderId}</td>
                  <td className="px-4 py-3 font-bold text-gray-900">Rp 150,000</td>
                  <td className="px-4 py-3"><StatusBadge status="qc_pending" /></td>
                  <td className="px-4 py-3">
                    <button className="text-emerald-600 hover:text-emerald-800 font-medium flex items-center justify-center gap-1 bg-emerald-50 px-2 py-1 rounded">
                      <Wallet size={14} /> Release Fund (Pay)
                    </button>
                  </td>
                </tr>
              ))}
               <tr className="hover:bg-gray-50 bg-amber-50/10">
                  <td className="px-4 py-3 font-medium text-gray-900">TRX-8280</td>
                  <td className="px-4 py-3">Pak Ahmad Hidayat</td>
                  <td className="px-4 py-3 font-mono">ORD-003</td>
                  <td className="px-4 py-3 font-bold text-gray-900">Rp 120,000</td>
                  <td className="px-4 py-3"><StatusBadge status="approved" /></td>
                  <td className="px-4 py-3">
                    <button className="text-white hover:text-gray-100 font-medium flex items-center gap-1 bg-emerald-600 px-3 py-1.5 rounded shadow-sm">
                      <Wallet size={14} className="text-white" /> Complete Transfer
                    </button>
                  </td>
                </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

`;

content = content.replace('  const renderView = () => {', financeComponent + '  const renderView = () => {');
fs.writeFileSync(filepath, content);