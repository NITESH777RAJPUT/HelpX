import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";

import {
  FaCheckCircle,
  FaComments,
  FaRupeeSign,
  FaMapMarkerAlt,
  FaUser,
  FaHourglassHalf
} from "react-icons/fa";

function AcceptedTasks() {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // 🔥 FETCH TASKS
  const fetchTasks = async () => {
    try {
      const res = await axios.get(
        "https://backend2-3avp.onrender.com/api/tasks/accepted",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 START TASK
  const startTask = async (id) => {
    try {
      await axios.put(
        `https://backend2-3avp.onrender.com/api/tasks/${id}/start`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTasks();
    } catch (err) {
      alert("Could not start task");
    }
  };

  // 🔥 COMPLETE TASK
  const completeTask = async (id) => {
    try {
      await axios.put(
        `https://backend2-3avp.onrender.com/api/tasks/${id}/complete`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTasks();
    } catch (err) {
      alert("Could not complete task");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-indigo-950 to-slate-950 text-gray-100 pb-20 lg:pb-8">

      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

        <h1 className="text-4xl md:text-5xl font-extrabold mb-10 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent text-center md:text-left">
          Tasks You're Working On
        </h1>

        {tasks.length === 0 ? (
          <div className="bg-gray-900/70 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-16 text-center shadow-2xl">
            <div className="text-7xl mb-6 opacity-70">👷‍♂️</div>
            <h2 className="text-3xl font-bold text-gray-200 mb-4">
              No active tasks yet
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Browse available tasks and start earning by helping others!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {tasks.map((task) => (
              <div
                key={task._id}
                className="bg-gray-900/70 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:shadow-indigo-500/20 hover:scale-[1.01] transition-all duration-300 flex flex-col md:flex-row gap-6 items-start"
              >
                <div className="flex-1 space-y-4">

                  {/* STATUS */}
                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
                        task.status === "accepted"
                          ? "bg-blue-500/20 text-blue-300 border border-blue-500/40"
                          : task.status === "in_progress"
                          ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40"
                          : task.status === "pending_review"
                          ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/40"
                          : task.status === "completed"
                          ? "bg-green-500/20 text-green-300 border border-green-500/40"
                          : "bg-gray-500/20 text-gray-300 border border-gray-500/40"
                      }`}
                    >
                      {task.status.replace("_", " ").toUpperCase()}
                    </span>

                    <span className="flex items-center gap-2 text-gray-400 text-sm">
                      <FaUser className="text-indigo-400" />
                      {task.postedBy?.name || "Unknown"}
                    </span>
                  </div>

                  {/* TITLE */}
                  <h2 className="text-2xl font-bold text-gray-100 line-clamp-2">
                    {task.title}
                  </h2>

                  {/* DESCRIPTION */}
                  <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
                    {task.description}
                  </p>

                  {/* TAGS */}
                  <div className="flex flex-wrap gap-3 text-sm">
                    <span className="flex items-center gap-2 bg-gradient-to-r from-green-600/30 to-emerald-600/30 px-4 py-1.5 rounded-full border border-green-500/30 text-green-300 font-medium">
                      <FaRupeeSign className="text-green-400" />
                      {task.payment || "Negotiable"}
                    </span>

                    <span className="flex items-center gap-2 bg-gray-800/70 px-4 py-1.5 rounded-full border border-gray-600 text-gray-300">
                      <FaMapMarkerAlt className="text-red-400" />
                      {task.location?.address || "Global"}
                    </span>
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="w-full md:w-auto flex flex-col gap-4 mt-4 md:mt-0">

                  {/* 🔵 ACCEPTED → START */}
                  {task.status === "accepted" && (
                    <>
                      <button
                        onClick={() => startTask(task._id)}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl font-semibold text-white hover:scale-105 transition"
                      >
                        ▶️ Start Task
                      </button>

                      <button
                        onClick={() => navigate(`/chat/${task._id}`)}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-violet-600 rounded-xl font-semibold text-white hover:scale-105 transition"
                      >
                        <FaComments />
                        Chat Owner
                      </button>
                    </>
                  )}

                  {/* 🟡 IN PROGRESS → COMPLETE */}
                  {task.status === "in_progress" && (
                    <>
                      <button
                        onClick={() => completeTask(task._id)}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl font-semibold text-white hover:scale-105 transition"
                      >
                        <FaCheckCircle />
                        Mark Complete
                      </button>

                      <button
                        onClick={() => navigate(`/chat/${task._id}`)}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-violet-600 rounded-xl font-semibold text-white hover:scale-105 transition"
                      >
                        <FaComments />
                        Chat Owner
                      </button>
                    </>
                  )}

                  {/* 🟣 PENDING */}
                  {task.status === "pending_review" && (
                    <div className="flex items-center justify-center gap-2 px-6 py-4 bg-yellow-500/20 border border-yellow-500/40 rounded-xl text-yellow-300 font-semibold text-center">
                      <FaHourglassHalf />
                      Waiting for approval ⏳
                    </div>
                  )}

                  {/* 🟢 COMPLETED */}
                  {task.status === "completed" && (
                    <div className="flex items-center justify-center gap-2 px-6 py-4 bg-green-500/20 border border-green-500/40 rounded-xl text-green-300 font-semibold text-center">
                      💸 Payment Received
                    </div>
                  )}

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AcceptedTasks;