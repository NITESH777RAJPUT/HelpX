import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaGoogle
} from "react-icons/fa";

function Register({ switchToLogin }) {

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword,setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {

    if (!name.trim() || !email.trim() || !password) {
      setError("Please fill all required fields");
      return;
    }

    setLoading(true);
    setError("");

    try {

      const res = await axios.post(
        "https://backend2-3avp.onrender.com/api/auth/register",
        {
          name: name.trim(),
          email: email.trim(),
          password: password
        }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Account created successfully!");

      navigate("/dashboard");

    } catch (err) {

      const msg =
        err.response?.data?.message ||
        "Registration failed. Please try again.";

      setError(msg);

    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = () => {
    window.location.href = "https://backend2-3avp.onrender.com/api/auth/google";
  };

  return (

    <div className="w-full h-full flex flex-col justify-center px-8 md:px-12">

      <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gray-800">
        Create Account 🚀
      </h1>

      <p className="text-gray-500 mb-6">
        Join and start helping people
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* USERNAME */}

      <div className="relative mb-4">

        <FaUser className="absolute left-4 top-4 text-gray-400"/>

        <input
          type="text"
          placeholder="Username"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-100 focus:bg-white border border-transparent focus:border-blue-500 outline-none transition"
        />

      </div>

      {/* EMAIL */}

      <div className="relative mb-4">

        <FaEnvelope className="absolute left-4 top-4 text-gray-400"/>

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-100 focus:bg-white border border-transparent focus:border-blue-500 outline-none transition"
        />

      </div>

      {/* PASSWORD */}

      <div className="relative mb-6">

        <FaLock className="absolute left-4 top-4 text-gray-400"/>

        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full pl-12 pr-12 py-3 rounded-xl bg-gray-100 focus:bg-white border border-transparent focus:border-blue-500 outline-none transition"
        />

        <button
          onClick={()=>setShowPassword(!showPassword)}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          {showPassword ? <FaEyeSlash/> : <FaEye/>}
        </button>

      </div>

      {/* REGISTER BUTTON */}

      <button
        onClick={handleRegister}
        disabled={loading}
        className={`w-full py-3 rounded-xl font-semibold text-white transition ${
          loading
          ? "bg-blue-400 cursor-not-allowed"
          : "bg-blue-600 hover:bg-blue-700 active:scale-[0.98]"
        }`}
      >
        {loading ? "Creating Account..." : "Register"}
      </button>


      {/* DIVIDER */}

      <div className="relative my-6">

        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>

        <div className="relative flex justify-center text-sm">
          <span className="px-3 bg-white text-gray-500">
            Or continue with
          </span>
        </div>

      </div>


      {/* GOOGLE REGISTER */}

      <button
        onClick={handleGoogleRegister}
        className="w-full border border-gray-300 py-3 rounded-xl flex items-center justify-center gap-3 font-medium hover:bg-gray-100 transition"
      >
        <FaGoogle className="text-red-500"/>
        Continue with Google
      </button>


      {/* LOGIN */}

      <p className="mt-8 text-sm text-center text-gray-600">

        Already have an account?{" "}

        <button
          onClick={switchToLogin}
          className="text-blue-600 font-semibold hover:underline"
        >
          Login
        </button>

      </p>

    </div>
  );
}

export default Register;