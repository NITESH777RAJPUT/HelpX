import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  FaHome,
  FaPlusCircle,
  FaSearch,
  FaClipboardList,
  FaCheckCircle,
  FaUser,
  FaSignOutAlt,
  FaBars,
  FaTimes
} from "react-icons/fa";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Scroll effect for Navbar transparency
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: "Dashboard", path: "/dashboard", icon: <FaHome /> },
    { name: "Post Task", path: "/post-task", icon: <FaPlusCircle /> },
    { name: "Browse", path: "/browse-tasks", icon: <FaSearch /> },
    { name: "My Tasks", path: "/my-tasks", icon: <FaClipboardList /> },
    { name: "Accepted", path: "/accepted-tasks", icon: <FaCheckCircle /> },
    { name: "Profile", path: "/profile", icon: <FaUser /> }
  ];

  return (
    <>
      {/* --- MAIN NAVBAR --- */}
      <nav 
        className={`sticky top-0 z-[100] transition-all duration-500 px-4 py-3 ${
          scrolled 
          ? "bg-white/70 backdrop-blur-2xl border-b border-white/30 shadow-xl py-2" 
          : "bg-transparent py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* LOGO AREA */}
          <Link to="/dashboard" className="flex items-center group relative outline-none">
            <div className="relative flex items-center">
              {/* Logo Glow Effect */}
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
              
              {/* Actual Logo Image */}
              <img 
                src="/logo.png" // Apni image ka file name yahan likhein (Public folder mein rakhein)
                alt="HelpX Logo" 
                className="h-10 md:h-12 w-auto object-contain relative z-10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-2"
              />
              
              {/* Optional Text (agar image mein text nahi hai toh isey rakhein, warna hata dein) */}
              {/* <span className="ml-2 font-black text-2xl bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">HelpX</span> */}
            </div>
          </Link>

          {/* DESKTOP MENU - Sleek Pill Design */}
          <div className="hidden lg:flex items-center gap-1 bg-gray-900/5 backdrop-blur-md p-1.5 rounded-full border border-black/5 shadow-inner">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                  isActive(link.path)
                    ? "bg-white text-blue-600 shadow-md scale-105"
                    : "text-slate-600 hover:text-blue-600 hover:bg-white/40"
                }`}
              >
                <span className={`text-lg transition-transform ${isActive(link.path) ? "scale-110" : "group-hover:translate-y-[-2px]"}`}>
                  {link.icon}
                </span>
                {link.name}
              </Link>
            ))}
          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-full font-bold text-sm shadow-lg hover:shadow-slate-400/30 hover:-translate-y-0.5 transition-all active:scale-95"
            >
              <FaSignOutAlt /> Logout
            </button>

            {/* Mobile Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-3 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/40 hover:bg-blue-700 transition-colors"
            >
              {isOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU DROPDOWN */}
        {isOpen && (
          <div className="lg:hidden absolute top-[calc(100%+10px)] left-4 right-4 bg-white/90 backdrop-blur-2xl rounded-3xl border border-white/50 shadow-2xl p-4 flex flex-col gap-2 animate-slide-in">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-4 p-4 rounded-2xl font-bold transition-all ${
                  isActive(link.path)
                    ? "bg-blue-600 text-white shadow-blue-200 shadow-lg"
                    : "text-slate-700 hover:bg-blue-50"
                }`}
              >
                <span className="text-xl">{link.icon}</span>
                {link.name}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="mt-2 flex items-center gap-4 p-4 bg-red-50 text-red-600 rounded-2xl font-bold hover:bg-red-100 transition-all"
            >
              <FaSignOutAlt className="text-xl" /> Logout
            </button>
          </div>
        )}
      </nav>

      {/* --- MOBILE BOTTOM BAR --- */}
      <div className="lg:hidden fixed bottom-4 left-4 right-4 z-[100]">
        <div className="bg-slate-900/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 flex justify-around items-center py-3 px-2">
          {navLinks.slice(0, 5).map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`relative flex flex-col items-center gap-1 transition-all duration-300 ${
                isActive(link.path) ? "text-blue-400 scale-110" : "text-slate-400"
              }`}
            >
              <div className="text-2xl">{link.icon}</div>
              <span className="text-[10px] font-bold uppercase tracking-wider">{link.name.split(" ")[0]}</span>
              {isActive(link.path) && (
                <div className="absolute -top-1 w-1 h-1 bg-blue-400 rounded-full shadow-[0_0_10px_#60a5fa]"></div>
              )}
            </Link>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-10px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-slide-in {
          animation: slideIn 0.3s ease-out forwards;
        }
      `}</style>
    </>
  );
}

export default Navbar;