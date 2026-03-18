import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";

function Login({ switchToRegister }) {

  const navigate = useNavigate();

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [showPassword,setShowPassword] = useState(false);
  const [loading,setLoading] = useState(false);

  const handleLogin = async () => {

    if(!email || !password){
      alert("Please enter email and password");
      return;
    }

    try{

      setLoading(true);

      const res = await axios.post("https://backend2-3avp.onrender.com/api/auth/login",{
        email,
        password
      });

      localStorage.setItem("token",res.data.token);
      localStorage.setItem("user",JSON.stringify(res.data.user));

      navigate("/dashboard");

    }catch(error){

      const message = error.response?.data?.message || "Login failed";
      alert(message);

    }finally{
      setLoading(false);
    }

  };

  const handleEnter = (e) => {

    if(e.key === "Enter"){
      handleLogin();
    }

  };

  const handleGoogleLogin = () => {

    window.location.href = "https://backend2-3avp.onrender.com/api/auth/google";

  };

  return (

    <div className="w-full h-full flex flex-col justify-center px-8 md:px-12">

      <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gray-800">
        Welcome Back 👋
      </h1>

      <p className="text-gray-500 mb-8">
        Login to continue helping people
      </p>

      {/* EMAIL */}

      <div className="relative mb-4">

        <FaEnvelope className="absolute left-4 top-4 text-gray-400"/>

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          onKeyDown={handleEnter}
          className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-100 focus:bg-white border border-transparent focus:border-blue-500 outline-none transition"
        />

      </div>


      {/* PASSWORD */}

      <div className="relative mb-2">

        <FaLock className="absolute left-4 top-4 text-gray-400"/>

        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          onKeyDown={handleEnter}
          className="w-full pl-12 pr-12 py-3 rounded-xl bg-gray-100 focus:bg-white border border-transparent focus:border-blue-500 outline-none transition"
        />

        <button
          onClick={()=>setShowPassword(!showPassword)}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          {showPassword ? <FaEyeSlash/> : <FaEye/>}
        </button>

      </div>


      {/* FORGOT PASSWORD */}

      <p className="text-sm mb-6 cursor-pointer text-blue-600 hover:underline">
        Forgot Password?
      </p>


      {/* LOGIN BUTTON */}

      <button
        onClick={handleLogin}
        disabled={loading}
        className={`w-full py-3 rounded-xl font-semibold text-white transition ${
          loading
          ? "bg-blue-400 cursor-not-allowed"
          : "bg-blue-600 hover:bg-blue-700 active:scale-[0.98]"
        }`}
      >
        {loading ? "Logging in..." : "Login"}
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


      {/* GOOGLE LOGIN */}

      <button
        onClick={handleGoogleLogin}
        className="w-full border border-gray-300 py-3 rounded-xl flex items-center justify-center gap-3 font-medium hover:bg-gray-100 transition"
      >
        <FaGoogle className="text-red-500"/>
        Continue with Google
      </button>


      {/* REGISTER */}

      <p className="mt-8 text-sm text-center text-gray-600">

        Don't have an account?{" "}

        <button
          onClick={switchToRegister}
          className="text-blue-600 font-semibold hover:underline"
        >
          Register
        </button>

      </p>

    </div>

  );

}

export default Login;