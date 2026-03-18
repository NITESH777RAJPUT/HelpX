import { useEffect, useState } from "react";
import axios from "axios";
import AdminNavbar from "../../components/AdminNavbar";

function AdminTasks() {

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {

      // 🔥 ADMIN MODE (IMPORTANT CHANGE)
      const res = await axios.get(
        "https://backend2-3avp.onrender.com/api/tasks?admin=true"
      );

      console.log("Admin Tasks:", res.data); // 🔍 debug

      setTasks(res.data);

    } catch (err) {
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">

      <AdminNavbar />

      <div className="max-w-5xl mx-auto p-6">

        <h1 className="text-3xl font-bold mb-6">
          All Tasks 📋
        </h1>

        <div className="bg-white p-6 rounded-xl shadow">

          {loading ? (
            <p>Loading tasks...</p>
          ) : tasks.length === 0 ? (
            <p>No tasks found</p>
          ) : (
            tasks.map((task) => (
              <div key={task._id} className="border-b py-3">

                <p className="font-bold text-lg">
                  {task.title}
                </p>

                <p className="text-gray-600">
                  ₹{task.payment}
                </p>

                <p className="text-sm">
                  Status: 
                  <span className={`ml-1 font-semibold ${
                    task.status === "completed"
                      ? "text-green-600"
                      : task.status === "accepted"
                      ? "text-blue-600"
                      : "text-orange-500"
                  }`}>
                    {task.status}
                  </span>
                </p>

                {/* 👤 Posted By */}
                <p className="text-sm text-gray-500">
                  Posted by: {task.postedBy?.name || "Unknown"}
                </p>

                {/* 🤝 Helper */}
                {task.helper && (
                  <p className="text-sm text-gray-500">
                    Helper: {task.helper?.name}
                  </p>
                )}

              </div>
            ))
          )}

        </div>

      </div>

    </div>
  );
}

export default AdminTasks;