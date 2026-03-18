import { Routes, Route } from "react-router-dom";

import AuthPage from "./components/AuthPage";

import Dashboard from "./pages/dashboard/Dashboard";
import PostTask from "./pages/dashboard/PostTask";
import BrowseTasks from "./pages/dashboard/BrowseTasks";
import MyTasks from "./pages/dashboard/MyTasks";
import AcceptedTasks from "./pages/dashboard/AcceptedTasks";
import NearbyHelpers from "./pages/dashboard/NearbyHelpers";
import Profile from "./pages/dashboard/Profile";
import Chat from "./pages/dashboard/Chat";
import Wallet from "./pages/dashboard/Wallet";

import GoogleSuccess from "./pages/GoogleSuccess";

import ProtectedRoute from "./utils/ProtectedRoute";

// 🔥 ADMIN IMPORTS
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminTasks from "./pages/admin/AdminTasks";        // ✅ ADD THIS
import AdminEarnings from "./pages/admin/AdminEarnings";  // ✅ ADD THIS
import AdminRoute from "./components/AdminRoute";

function App() {

  return (

    <Routes>

      {/* ================= AUTH ================= */}
      <Route path="/" element={<AuthPage />} />
      <Route path="/google-success" element={<GoogleSuccess />} />

      {/* ================= USER ROUTES ================= */}

      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />

      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />

      <Route path="/wallet" element={
        <ProtectedRoute>
          <Wallet />
        </ProtectedRoute>
      } />

      <Route path="/post-task" element={
        <ProtectedRoute>
          <PostTask />
        </ProtectedRoute>
      } />

      <Route path="/browse-tasks" element={
        <ProtectedRoute>
          <BrowseTasks />
        </ProtectedRoute>
      } />

      <Route path="/my-tasks" element={
        <ProtectedRoute>
          <MyTasks />
        </ProtectedRoute>
      } />

      <Route path="/accepted-tasks" element={
        <ProtectedRoute>
          <AcceptedTasks />
        </ProtectedRoute>
      } />

      <Route path="/nearby-helpers" element={
        <ProtectedRoute>
          <NearbyHelpers />
        </ProtectedRoute>
      } />

      {/* CHAT */}
      <Route path="/chat/:taskId" element={
        <ProtectedRoute>
          <Chat />
        </ProtectedRoute>
      } />

      {/* ================= ADMIN ROUTES ================= */}

      {/* 🔐 Admin Login */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* 👑 Admin Dashboard */}
      <Route path="/admin" element={
        <AdminRoute>
          <AdminDashboard />
        </AdminRoute>
      } />

      {/* 👥 Admin Users */}
      <Route path="/admin/users" element={
        <AdminRoute>
          <AdminUsers />
        </AdminRoute>
      } />

      {/* 📋 Admin Tasks */}
      <Route path="/admin/tasks" element={
        <AdminRoute>
          <AdminTasks />
        </AdminRoute>
      } />

      {/* 💸 Admin Earnings */}
      <Route path="/admin/earnings" element={
        <AdminRoute>
          <AdminEarnings />
        </AdminRoute>
      } />

    </Routes>

  );

}

export default App;