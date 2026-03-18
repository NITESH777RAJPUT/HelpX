import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import TaskCard from "../../components/TaskCard";

import { FaGlobe, FaMapMarkerAlt, FaSearch } from "react-icons/fa";

function BrowseTasks() {
  const [tasks, setTasks] = useState([]);
  const [activeTab, setActiveTab] = useState("global");
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude: lat, longitude: lng } = pos.coords;
          setUserLocation({ lat, lng });
          setActiveTab("nearby");
          fetchTasks("nearby", lat, lng);
        },
        () => fetchTasks("global")
      );
    } else {
      fetchTasks("global");
    }
  }, []);

  const fetchTasks = async (tab, lat = null, lng = null) => {
    setLoading(true);
    try {
      let url = `https://backend2-3avp.onrender.com/api/tasks?type=${tab === "nearby" ? "nearby" : "global"}`;
      if (tab === "nearby" && lat) {
        url += `&lat=${lat}&lng=${lng}&maxDistance=30000`;
      }
      const res = await axios.get(url);
      setTasks(res.data || []);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-indigo-950 to-slate-950 text-gray-100 pb-20 lg:pb-8">

      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

        {/* Header */}
        <header className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-4">
              <FaSearch className="text-indigo-400" />
              Available Tasks
            </h1>
            <p className="text-gray-400 mt-2 text-lg">
              Discover opportunities to help nearby or globally and earn.
            </p>
          </div>

          <div className="text-lg font-medium text-indigo-300 bg-gray-800/50 px-5 py-2 rounded-full border border-indigo-500/30">
            {tasks.length} tasks available
          </div>
        </header>

        {/* Tabs - Pill Style */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-gray-900/70 backdrop-blur-xl border border-gray-700/50 rounded-full p-1.5 shadow-xl shadow-black/30">
            <button
              onClick={() => {
                setActiveTab("global");
                fetchTasks("global");
              }}
              className={`flex items-center gap-3 px-8 py-3.5 rounded-full font-semibold transition-all duration-300 ${
                activeTab === "global"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/40"
                  : "text-gray-300 hover:bg-gray-800/70"
              }`}
            >
              <FaGlobe className="text-xl" />
              Global
            </button>

            <button
              onClick={() => {
                setActiveTab("nearby");
                if (userLocation) {
                  fetchTasks("nearby", userLocation.lat, userLocation.lng);
                }
              }}
              disabled={!userLocation}
              className={`flex items-center gap-3 px-8 py-3.5 rounded-full font-semibold transition-all duration-300 ${
                activeTab === "nearby"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/40"
                  : "text-gray-300 hover:bg-gray-800/70 disabled:opacity-50 disabled:cursor-not-allowed"
              }`}
            >
              <FaMapMarkerAlt className="text-xl" />
              Nearby
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => (
              <div
                key={i}
                className="h-72 bg-gray-800/50 rounded-2xl animate-pulse border border-gray-700/40"
              ></div>
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <div className="bg-gray-900/60 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-16 text-center shadow-2xl">
            <FaSearch className="text-7xl text-gray-500 mx-auto mb-6 opacity-70" />
            <h2 className="text-3xl font-bold text-gray-200 mb-3">
              No tasks found
            </h2>
            <p className="text-gray-400 text-lg">
              Try switching between Global / Nearby or check back later!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {tasks.map((task) => (
              <div
                key={task._id}
                className="transform transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02]"
              >
                <TaskCard
                  task={task}
                  userLocation={userLocation}
                  activeTab={activeTab}
                  refreshTasks={() =>
                    fetchTasks(
                      activeTab,
                      userLocation?.lat,
                      userLocation?.lng
                    )
                  }
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default BrowseTasks;