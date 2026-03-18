import AdminNavbar from "../../components/AdminNavbar";
import { Link } from "react-router-dom";

function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Admin Dashboard 👑
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCard
            to="/admin/users"
            emoji="👥"
            title="Manage Users"
            description="View, edit, ban or promote users"
            color="blue"
          />

          <DashboardCard
            to="/admin/tasks"
            emoji="📋"
            title="All Tasks"
            description="Monitor, review and moderate tasks"
            color="indigo"
          />

          <DashboardCard
            to="/admin/earnings"
            emoji="💸"
            title="Earnings Overview"
            description="Track platform revenue & user payouts"
            color="green"
          />

          <DashboardCard
            to="/admin/withdraw"
            emoji="🏦"
            title="Withdraw Requests"
            description="Review & process pending withdrawals"
            color="yellow"
          />
        </div>

        {/* You can easily add more rows / stats later */}
      </main>
    </div>
  );
}

// Reusable small card component
function DashboardCard({ to, emoji, title, description, color = "gray" }) {
  const colorClasses = {
    blue: "hover:border-blue-500",
    indigo: "hover:border-indigo-500",
    green: "hover:border-green-500",
    yellow: "hover:border-yellow-500",
    gray: "hover:border-gray-400",
  }[color];

  return (
    <Link
      to={to}
      className={`
        block bg-white p-6 rounded-xl shadow-sm 
        border-2 border-transparent ${colorClasses}
        transition-all duration-200 hover:shadow-md hover:-translate-y-1
      `}
    >
      <div className="text-4xl mb-4">{emoji}</div>
      <h2 className="text-xl font-semibold text-gray-800 mb-2">{title}</h2>
      <p className="text-gray-600 text-sm">{description}</p>
    </Link>
  );
}

export default AdminDashboard;