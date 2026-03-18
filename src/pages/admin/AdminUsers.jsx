import { useEffect, useState } from "react";
import axios from "axios";
import AdminNavbar from "../../components/AdminNavbar";

function AdminUsers() {

  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {

      const res = await axios.get(
        "https://backend2-3avp.onrender.com/api/users"
      );

      setUsers(res.data);

    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">

      <AdminNavbar />

      <div className="max-w-5xl mx-auto p-6">

        <h1 className="text-3xl font-bold mb-6">
          All Users 👥
        </h1>

        <div className="bg-white p-6 rounded-xl shadow">

          {users.length === 0 ? (
            <p>No users found</p>
          ) : (
            users.map((user) => (
              <div
                key={user._id}
                className="border-b py-2 flex justify-between"
              >
                <span>{user.name}</span>
                <span>{user.email}</span>
              </div>
            ))
          )}

        </div>

      </div>

    </div>
  );
}

export default AdminUsers;