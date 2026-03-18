import { useEffect, useState } from "react";
import axios from "axios";
import AdminNavbar from "../../components/AdminNavbar";

function AdminEarnings() {

  const [earnings, setEarnings] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchEarnings = async () => {
    try {

      // 🔥 NEW API (optimized)
      const res = await axios.get(
        "https://backend2-3avp.onrender.com/api/users/admin-wallet"
      );

      setEarnings(res.data.wallet || 0);

    } catch (err) {
      console.error("Error fetching earnings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEarnings();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">

      <AdminNavbar />

      <div className="p-10 text-center">

        <h1 className="text-3xl font-bold mb-5">
          Admin Earnings 💸
        </h1>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="text-4xl text-green-600 font-bold">
            ₹{earnings}
          </div>
        )}

      </div>

    </div>
  );
}

export default AdminEarnings;