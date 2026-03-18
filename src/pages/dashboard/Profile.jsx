import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";

import {
  FaUserCircle,
  FaEdit,
  FaSignOutAlt,
  FaStar,
  FaWallet,
  FaCamera,
  FaSpinner
} from "react-icons/fa";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [updating, setUpdating] = useState(false);

  const [name, setName] = useState("");
  const [skills, setSkills] = useState("");
  const [bio, setBio] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }
    fetchProfile();
  }, [navigate, token]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await axios.get("https://backend2-3avp.onrender.com/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data);
      setName(res.data.name || "");
      setSkills(res.data.skills?.join(", ") || "");
      setBio(res.data.bio || "");
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      const res = await axios.put(
        "https://backend2-3avp.onrender.com/api/users/profile",
        {
          name,
          skills: skills.split(",").map(s => s.trim()).filter(Boolean),
          bio
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(res.data);
      setEditing(false);
    } catch (err) {
      console.log(err);
    } finally {
      setUpdating(false);
    }
  };

  const handleWithdraw = async () => {
    const amount = prompt("Enter withdraw amount (₹)");
    if (!amount || isNaN(amount) || Number(amount) <= 0) return;

    try {
      await axios.post(
        "https://backend2-3avp.onrender.com/api/withdraw",
        { amount: Number(amount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Withdraw request created successfully!");
      fetchProfile();
    } catch (error) {
      alert(error.response?.data?.message || "Withdraw failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-indigo-950 to-slate-950 flex items-center justify-center">
        <div className="text-2xl font-bold text-indigo-400 animate-pulse flex items-center gap-3">
          <FaSpinner className="animate-spin text-3xl" />
          Loading profile...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-indigo-950 to-slate-950 text-gray-100 pb-20 lg:pb-8">

      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">

        <div className="bg-gray-900/70 backdrop-blur-2xl border border-gray-700/50 rounded-3xl shadow-2xl shadow-black/40 overflow-hidden">

          {/* Header Gradient */}
          <div className="h-48 bg-gradient-to-r from-indigo-700 via-purple-700 to-blue-700 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          </div>

          <div className="relative px-6 pb-10 -mt-20">

            {/* Avatar with Glow Ring */}
            <div className="absolute -top-16 left-6 group">
              <div className="relative w-32 h-32">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-500 animate-pulse-slow blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="w-32 h-32 bg-gray-900 rounded-full shadow-2xl flex items-center justify-center border-4 border-gray-800 overflow-hidden transform group-hover:scale-105 transition-transform duration-300">
                  <FaUserCircle className="w-full h-full text-gray-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-3">
                    <FaCamera className="text-gray-200 text-2xl" />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-20 flex flex-col md:flex-row md:items-start justify-between gap-6">

              <div className="animate-fade-in">
                <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                  {user?.name || "User"}
                </h1>
                <p className="text-indigo-300 font-medium mt-2">{user?.email}</p>
              </div>

              <div className="flex flex-wrap gap-4 animate-fade-in delay-200">
                <button
                  onClick={() => setEditing(!editing)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-md ${
                    editing
                      ? "bg-red-600/80 text-white hover:bg-red-700"
                      : "bg-gray-800/70 backdrop-blur-md border border-gray-600 text-indigo-300 hover:bg-gray-700/70 hover:scale-105"
                  }`}
                >
                  <FaEdit />
                  {editing ? "Cancel Edit" : "Edit Profile"}
                </button>

                <button
                  onClick={() => {
                    localStorage.clear();
                    navigate("/");
                  }}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-rose-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  <FaSignOutAlt />
                  Logout
                </button>
              </div>
            </div>

            <hr className="my-10 border-gray-700/50" />

            {!editing ? (
              <div className="grid md:grid-cols-3 gap-6 animate-fade-in-up">

                {/* Left - Bio & Skills */}
                <div className="md:col-span-2 space-y-8">
                  <section className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-700/40 shadow-inner hover:shadow-xl transition-shadow">
                    <h3 className="text-lg font-bold text-gray-200 mb-4 uppercase tracking-wide">About Me</h3>
                    <p className="text-gray-300 leading-relaxed">
                      {user?.bio || "Tell the community something about yourself..."}
                    </p>
                  </section>

                  <section className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-700/40 shadow-inner hover:shadow-xl transition-shadow">
                    <h3 className="text-lg font-bold text-gray-200 mb-4 uppercase tracking-wide">Skills</h3>
                    <div className="flex flex-wrap gap-3">
                      {user?.skills?.length > 0 ? (
                        user.skills.map((skill, i) => (
                          <span
                            key={i}
                            className="px-5 py-2 bg-gradient-to-r from-indigo-600/30 to-purple-600/30 text-indigo-300 rounded-full text-sm font-semibold border border-indigo-500/30 hover:scale-105 transition-transform"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <p className="text-gray-500 italic">No skills added yet. Edit to showcase your expertise!</p>
                      )}
                    </div>
                  </section>
                </div>

                {/* Right - Rating & Wallet */}
                <div className="space-y-6">
                  <div className="bg-gray-800/60 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/40 shadow-inner hover:shadow-xl hover:scale-[1.02] transition-all duration-300 text-center">
                    <FaStar className="text-5xl text-yellow-400 mx-auto mb-4 animate-pulse-slow" />
                    <h3 className="text-xl font-bold text-gray-200">Rating</h3>
                    <div className="text-4xl font-black bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent mt-3">
                      {user?.rating ? user.rating.toFixed(1) : "—"} ★
                    </div>
                  </div>

                  <div className="bg-gray-800/60 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/40 shadow-inner hover:shadow-xl hover:scale-[1.02] transition-all duration-300 text-center">
                    <FaWallet className="text-5xl text-green-400 mx-auto mb-4 animate-pulse-slow" />
                    <h3 className="text-xl font-bold text-gray-200">Wallet Balance</h3>
                    <div className="text-4xl font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mt-3">
                      ₹{user?.wallet || 0}
                    </div>

                    <button
                      onClick={handleWithdraw}
                      className="mt-6 w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300"
                    >
                      Withdraw Funds
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6 bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-700/40 shadow-inner animate-fade-in-up">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Full Name</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-5 bg-gray-900/70 border border-gray-700 rounded-2xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-inner"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Skills (comma separated)</label>
                  <input
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    className="w-full p-5 bg-gray-900/70 border border-gray-700 rounded-2xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-inner"
                    placeholder="e.g. Plumbing, Graphic Design, Tutoring"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Bio</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full p-5 bg-gray-900/70 border border-gray-700 rounded-2xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-inner h-40"
                    placeholder="Tell others about your experience and services..."
                  />
                </div>

                <button
                  onClick={handleUpdate}
                  disabled={updating}
                  className={`w-full py-5 rounded-2xl font-bold text-lg shadow-xl transition-all duration-300 ${
                    updating
                      ? "bg-gray-700 cursor-not-allowed"
                      : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white hover:shadow-2xl hover:scale-105 active:scale-95"
                  }`}
                >
                  {updating ? "Saving Changes..." : "Save Profile"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(50px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulseSlow { 0%, 100% { opacity: 0.6; transform: scale(1); } 50% { opacity: 0.9; transform: scale(1.08); } }
        .animate-fade-in     { animation: fadeIn 0.8s ease-out forwards; }
        .animate-fade-in-up  { animation: fadeInUp 1s ease-out forwards; }
        .delay-200           { animation-delay: 0.2s; }
        .animate-pulse-slow  { animation: pulseSlow 6s ease-in-out infinite; }
      `}</style>
    </div>
  );
}

export default Profile;