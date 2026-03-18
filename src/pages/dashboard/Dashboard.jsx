import Navbar from "../../components/Navbar";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion"; // Animation ke liye

import {
  FaUser,
  FaPlusCircle,
  FaTasks,
  FaCoins,
  FaCheckCircle,
  FaArrowRight
} from "react-icons/fa";

// Animation Variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } }
};

function Dashboard() {
  const [stats, setStats] = useState({
    tasksPosted: 0,
    tasksCompleted: 0,
    totalEarnings: 0,
    rating: 0
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("https://backend2-3avp.onrender.com/api/dashboard/stats", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats({
          tasksPosted: res.data.tasksPosted || 0,
          tasksCompleted: res.data.tasksCompleted || 0,
          totalEarnings: res.data.totalEarnings || 0,
          rating: res.data.rating || 0
        });
      } catch (err) {
        console.error("Dashboard Error:", err);
      }
    };
    if (token) fetchStats();
  }, [token]);

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 pb-20 selection:bg-indigo-500/30">
      <Navbar />

      {/* HERO SECTION WITH MESH GRADIENT */}
      <div className="relative overflow-hidden pt-16 pb-24 px-6">
        {/* Background Decorative Blobs */}
        <div className="absolute top-0 -left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 -right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px]" />

        <motion.div 
          initial="initial"
          animate="animate"
          variants={staggerContainer}
          className="max-w-5xl mx-auto text-center relative z-10"
        >
          <motion.span 
            variants={fadeInUp}
            className="px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-6 inline-block"
          >
            Welcome Back, Achiever
          </motion.span>
          
          <motion.h1 
            variants={fadeInUp}
            className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-white via-indigo-200 to-slate-400 bg-clip-text text-transparent"
          >
            Your HelpX Engine
          </motion.h1>

          <motion.p variants={fadeInUp} className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Ready to scale your impact? Track your progress, manage tasks, and watch your earnings grow in real-time.
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-4">
            <Link
              to="/browse-tasks"
              className="group relative flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-4 rounded-2xl font-bold transition-all hover:shadow-[0_0_30px_rgba(79,70,229,0.4)] hover:-translate-y-1"
            >
              <FaCoins className="group-hover:rotate-12 transition-transform" />
              Start Earning
              <FaArrowRight className="text-sm opacity-50 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/post-task"
              className="flex items-center gap-2 bg-slate-800/50 hover:bg-slate-800 backdrop-blur-xl border border-slate-700 text-white px-10 py-4 rounded-2xl font-bold transition-all hover:-translate-y-1"
            >
              <FaPlusCircle />
              Post Task
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* STATS SECTION - GLASSMORPHISM CARDS */}
      <div className="max-w-6xl mx-auto px-6 -mt-12 relative z-20">
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {[
            { label: "Tasks Posted", val: stats.tasksPosted, icon: <FaTasks />, color: "text-blue-400", bg: "bg-blue-400/10" },
            { label: "Completed", val: stats.tasksCompleted, icon: <FaCheckCircle />, color: "text-emerald-400", bg: "bg-emerald-400/10" },
            { label: "Total Earnings", val: `₹${stats.totalEarnings}`, icon: <FaCoins />, color: "text-amber-400", bg: "bg-amber-400/10" },
            { label: "User Rating", val: `${stats.rating} ⭐`, icon: <FaUser />, color: "text-purple-400", bg: "bg-purple-400/10" }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              variants={fadeInUp}
              whileHover={{ y: -5 }}
              className="relative group p-[1px] rounded-3xl overflow-hidden"
            >
              {/* Gradient Border on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative bg-[#1e293b]/80 backdrop-blur-2xl p-6 rounded-[23px] h-full border border-slate-700/50">
                <div className={`w-12 h-12 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center text-xl mb-4`}>
                  {item.icon}
                </div>
                <p className="text-slate-400 text-sm font-medium mb-1">{item.label}</p>
                <h3 className="text-3xl font-black text-white tracking-tight">
                  {item.val}
                </h3>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export default Dashboard;