import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminLogin() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {

      const res = await axios.post(
        "https://backend2-3avp.onrender.com/api/admin/login",
        { email, password }
      );

      localStorage.setItem("adminToken", res.data.token);

      alert("Admin Login Success 👑");

      navigate("/admin");

    } catch (err) {
      alert("Invalid admin credentials ❌");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">

      <div className="bg-white p-6 rounded-xl shadow w-80">

        <h2 className="text-xl font-bold mb-4 text-center">
          Admin Login 👑
        </h2>

        <input
          type="email"
          placeholder="Admin Email"
          className="border p-2 w-full mb-3"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-4"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="bg-black text-white w-full py-2 rounded"
        >
          Login
        </button>

      </div>

    </div>
  );
}

export default AdminLogin;