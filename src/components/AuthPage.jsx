import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { FaHandshake, FaCoins, FaChartLine, FaHeart, FaUserPlus, FaSignInAlt } from "react-icons/fa";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

function AuthPage() {
  const [isRegister, setIsRegister] = useState(false);
  const shouldReduceMotion = useReducedMotion(); // respect user preference

  const floatingIcons = [
    { icon: <FaCoins className="text-yellow-400/70" />, x: "8%", y: "18%", delay: 0.5, size: "text-5xl" },
    { icon: <FaHandshake className="text-emerald-400/70" />, x: "88%", y: "12%", delay: 1.8, size: "text-6xl" },
    { icon: <FaChartLine className="text-blue-400/70" />, x: "12%", y: "82%", delay: 3.2, size: "text-5xl" },
    { icon: <FaHeart className="text-pink-400/70" />, x: "82%", y: "78%", delay: 0.8, size: "text-6xl" },
    { icon: <FaUserPlus className="text-purple-400/60" />, x: "45%", y: "35%", delay: 2.5, size: "text-4xl" },
  ];

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.92 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.9, ease: "easeOut" } },
  };

  const overlayVariants = {
    login: { x: "0%", background: "linear-gradient(to bottom right, #0ea5e9, #10b981)" },
    register: { x: "-100%", background: "linear-gradient(to bottom right, #8b5cf6, #ec4899)" },
    transition: { type: "spring", stiffness: 70, damping: 18, duration: 0.8 },
  };

  const formVariants = {
    initial: { opacity: 0, x: -40, filter: "blur(4px)" },
    animate: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: "easeOut" } },
    exit: { opacity: 0, x: 40, filter: "blur(4px)", transition: { duration: 0.5 } },
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#020617]">

      {/* Enhanced Animated Background Blobs + subtle mesh */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div
          animate={shouldReduceMotion ? {} : { scale: [1, 1.25, 1], rotate: [0, 80, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[15%] -left-[15%] w-[80%] h-[80%] bg-gradient-to-br from-blue-600/25 to-cyan-500/15 blur-[140px] rounded-full"
        />
        <motion.div
          animate={shouldReduceMotion ? {} : { scale: [1, 1.35, 1], rotate: [0, -70, 0] }}
          transition={{ duration: 19, repeat: Infinity, ease: "linear", delay: 2 }}
          className="absolute -bottom-[15%] -right-[15%] w-[80%] h-[80%] bg-gradient-to-br from-emerald-500/25 to-teal-600/15 blur-[140px] rounded-full"
        />
        {/* subtle noise/mesh overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff11_1px,transparent_1px)] bg-[length:20px_20px] opacity-30" />
      </div>

      {/* Floating Icons – more dynamic */}
      {floatingIcons.map((item, i) => (
        <motion.div
          key={i}
          initial={{ y: 0, opacity: 0.4 }}
          animate={shouldReduceMotion ? {} : { y: [0, -35, 0], opacity: [0.4, 0.8, 0.4], rotate: [0, 8, -8, 0] }}
          transition={{
            duration: 6 + i * 0.8,
            delay: item.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className={`absolute ${item.size} drop-shadow-lg hidden lg:block z-10`}
          style={{ left: item.x, top: item.y }}
        >
          {item.icon}
        </motion.div>
      ))}

      {/* Main Glassmorphic + Neumorphic Container */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative w-full max-w-5xl lg:h-[680px] bg-white/10 backdrop-blur-2xl 
          border border-white/15 rounded-3xl lg:rounded-4xl shadow-[0_30px_80px_rgba(0,0,0,0.5),inset_0_2px_10px_rgba(255,255,255,0.12)]
          flex flex-col lg:flex-row overflow-hidden z-10 mx-5 lg:mx-0"
      >

        {/* Mobile Header – neumorphic feel */}
        <div className="lg:hidden w-full bg-gradient-to-r from-blue-700/80 to-emerald-600/80 backdrop-blur-md text-white text-center py-7 border-b border-white/10">
          <h1 className="text-3xl font-extrabold tracking-tight drop-shadow-md">
            {isRegister ? "Join HelpX 🚀" : "Welcome Back 👋"}
          </h1>
          <p className="text-base mt-1.5 opacity-90 px-6">
            {isRegister ? "Start helping people & earn rewards" : "Access your community dashboard"}
          </p>
        </div>

        {/* Form Section – with stagger children possible in child components */}
        <div className={`w-full lg:w-1/2 h-full transition-all duration-700 ease-out ${isRegister ? "lg:translate-x-full" : ""}`}>
          <AnimatePresence mode="wait">
            {!isRegister ? (
              <motion.div
                key="login"
                variants={formVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="h-full flex items-center"
              >
                <Login switchToRegister={() => setIsRegister(true)} />
              </motion.div>
            ) : (
              <motion.div
                key="register"
                variants={formVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="h-full flex items-center"
              >
                <Register switchToLogin={() => setIsRegister(false)} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Desktop Sliding Overlay – glass + neumorph hybrid */}
        <motion.div
          animate={isRegister ? "register" : "login"}
          variants={overlayVariants}
          transition={overlayVariants.transition}
          className="absolute right-0 w-1/2 h-full hidden lg:flex flex-col items-center justify-center text-white p-14 text-center backdrop-blur-lg border-l border-white/10"
          style={{ boxShadow: "inset -12px 0 20px rgba(0,0,0,0.3)" }}
        >
          <motion.div
            key={isRegister ? "reg" : "log"}
            initial={{ opacity: 0, y: 30, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.25, duration: 0.8, type: "spring" }}
            className="space-y-6 max-w-md"
          >
            <div className="text-5xl font-black tracking-tight drop-shadow-2xl">
              {isRegister ? "Launch Your Impact 🚀" : "Hey, Welcome Back 👋"}
            </div>

            <p className="text-lg leading-relaxed text-white/90 drop-shadow-md">
              {isRegister
                ? "Create your HelpX account — help others, earn coins, build reputation."
                : "Continue where you left off. Your community is waiting."}
            </p>

            <motion.button
              whileHover={{ scale: 1.08, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setIsRegister(!isRegister)}
              className="px-14 py-4 bg-white/95 text-indigo-700 font-bold text-lg rounded-full shadow-2xl hover:bg-white transition-all flex items-center gap-3 mx-auto"
            >
              {isRegister ? <FaSignInAlt /> : <FaUserPlus />}
              {isRegister ? "Switch to Login" : "Create Account"}
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default AuthPage;