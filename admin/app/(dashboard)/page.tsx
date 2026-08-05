export default function OverviewPage() {
  const stats = [
    { label: "Total Products", value: "124", change: "+12 this month", color: "from-pink-500 to-rose-500" },
    { label: "Partner Inquiries", value: "12", change: "+3 this week", color: "from-purple-500 to-indigo-500" },
    { label: "Career Applications", value: "38", change: "+7 this week", color: "from-cyan-500 to-blue-500" },
    { label: "Newsletter Subscribers", value: "286", change: "+24 this month", color: "from-orange-500 to-amber-500" },
  ];

  const activity = [
    { dot: "bg-blue-400", text: "New resume uploaded by Priya K.", time: "2 min ago" },
    { dot: "bg-green-400", text: 'Product "Neon Berry Popsicle" updated.', time: "1 hour ago" },
    { dot: "bg-purple-400", text: "District Partner inquiry received.", time: "3 hours ago" },
    { dot: "bg-pink-400", text: "Gallery image uploaded.", time: "5 hours ago" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white">Welcome back 👋</h2>
        <p className="text-gray-400 mt-1 text-sm">Here's what's happening with Frozen Fusion today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-24 h-24 rounded-full bg-gradient-to-br ${stat.color} opacity-10 blur-2xl`} />
            <p className="text-gray-400 text-sm font-medium mb-2">{stat.label}</p>
            <p className="text-3xl font-extrabold text-white">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-2">{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h3 className="text-base font-semibold text-white mb-5">Recent Activity</h3>
        <ul className="space-y-4">
          {activity.map((item, i) => (
            <li key={i} className="flex items-start gap-4 pb-4 last:pb-0 last:border-0 border-b border-gray-800">
              <div className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${item.dot}`} />
              <div className="flex-1">
                <p className="text-sm text-gray-200">{item.text}</p>
                <p className="text-xs text-gray-500 mt-0.5">{item.time}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
