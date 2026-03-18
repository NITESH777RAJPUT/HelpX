import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";

import {
  FaTrash,
  FaComments,
  FaRupeeSign,
  FaStar,
  FaCheckCircle,
  FaSpinner,
  FaMapMarkerAlt
} from "react-icons/fa";

function MyTasks() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentTask, setSelectedPaymentTask] = useState(null);

  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  const calculateCharges = (amount) => {
    const platformFee = Math.ceil(amount * 0.1);
    const total = amount + platformFee;
    return { platformFee, total };
  };

  const handlePayment = async (task) => {
    try {
      console.log("Payment button clicked for task:", task._id);

      if (!window.Razorpay) {
        alert("Razorpay SDK not loaded. Please refresh the page.");
        return;
      }

      const paymentAmount = task.totalAmount || task.payment;

      const res = await axios.post(
        "https://backend2-3avp.onrender.com/api/payment/create-order",
        { amount: paymentAmount },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Order created:", res.data);

      const options = {
        key: "rzp_test_etV3KSpnoWM3Av",
        amount: res.data.amount,
        currency: "INR",
        name: "HelpX",
        description: "Task Payment",
        order_id: res.data.id,
        handler: async function (response) {
          try {
            console.log("Payment successful:", response);

            await axios.post(
              "https://backend2-3avp.onrender.com/api/payment/verify-payment",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                taskId: task._id
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            alert("Payment Successful & Wallet Updated 💸");
            fetchMyTasks();
          } catch (err) {
            console.error("Verification failed:", err);
            alert("Payment done but verification failed ❌. Contact support.");
          }
        },
        prefill: {
          name: currentUser?.name || "",
          email: currentUser?.email || ""
        },
        theme: {
          color: "#4f46e5"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment initiation error:", err);
      alert(err.response?.data?.message || "Payment failed ❌");
    }
  };

  const getLocationDisplay = (loc) => {
    if (!loc) return "Not specified";
    if (typeof loc === "string") return loc;
    if (loc.address) return loc.address;
    if (loc.coordinates && loc.coordinates.length === 2) {
      const [lng, lat] = loc.coordinates;
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
    return "Not specified";
  };

  const fetchMyTasks = async () => {
    if (!token) {
      alert("Please login first");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get("https://backend2-3avp.onrender.com/api/tasks/mytasks", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(res.data);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (taskId) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await axios.delete(`https://backend2-3avp.onrender.com/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchMyTasks();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete task");
    }
  };

  const openRatingModal = (task) => {
    if (!task.helper) {
      alert("No helper assigned yet");
      return;
    }
    setSelectedTask(task);
    setRating(0);
    setComment("");
    setShowModal(true);
  };

  const submitReview = async () => {
    if (rating === 0) {
      alert("Select rating");
      return;
    }

    setSubmitting(true);
    try {
      await axios.post(
        "https://backend2-3avp.onrender.com/api/reviews",
        {
          taskId: selectedTask._id,
          helperId: selectedTask.helper._id || selectedTask.helper,
          rating,
          comment: comment.trim()
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Review submitted!");
      setShowModal(false);
      fetchMyTasks();
    } catch (error) {
      alert(error.response?.data?.message || "Review failed");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    fetchMyTasks();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-indigo-950 to-slate-950 flex items-center justify-center">
        <div className="text-2xl font-bold text-indigo-400 animate-pulse flex items-center gap-3">
          <FaSpinner className="animate-spin text-3xl" />
          Loading your tasks...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-indigo-950 to-slate-950 text-gray-100 pb-20 lg:pb-8">

      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

        <h1 className="text-4xl md:text-5xl font-extrabold mb-10 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent text-center md:text-left">
          My Posted Tasks
        </h1>

        {tasks.length === 0 ? (
          <div className="bg-gray-900/70 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-12 text-center shadow-2xl">
            <FaCheckCircle className="text-7xl text-gray-500 mx-auto mb-6 opacity-60" />
            <h2 className="text-3xl font-bold text-gray-200 mb-3">
              No tasks posted yet
            </h2>
            <p className="text-gray-400 text-lg">
              Start posting tasks to see them here!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {tasks.map((task) => (
              <div
                key={task._id}
                className="bg-gray-900/70 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:shadow-indigo-500/20 hover:scale-[1.01] transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                  <h2 className="text-2xl font-bold text-gray-100 line-clamp-2">
                    {task.title}
                  </h2>

                  {task.status === "open" && (
                    <button
                      onClick={() => deleteTask(task._id)}
                      className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl font-semibold hover:from-red-700 hover:to-rose-700 shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      <FaTrash />
                      Delete
                    </button>
                  )}
                </div>

                <p className="text-gray-300 mb-5 leading-relaxed line-clamp-3">
                  {task.description}
                </p>

                <div className="flex flex-wrap gap-4 text-sm mb-5">
                  <span className="flex items-center gap-2 bg-gray-800/70 px-4 py-1.5 rounded-full border border-gray-600">
                    <FaMapMarkerAlt className="text-red-400" />
                    {getLocationDisplay(task.location)}
                  </span>

                  <span className="flex items-center gap-2 bg-gradient-to-r from-green-600/30 to-emerald-600/30 px-4 py-1.5 rounded-full border border-green-500/30 text-green-300 font-medium">
                    <FaRupeeSign className="text-green-400" />
                    {task.payment > 0 ? task.payment : "Negotiable"}
                  </span>

                  <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
                    task.status === "open" ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/40" :
                    task.status === "accepted" ? "bg-blue-500/20 text-blue-300 border border-blue-500/40" :
                    "bg-green-500/20 text-green-300 border border-green-500/40"
                  }`}>
                    {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                  </span>
                </div>

                {task.helper && (
                  <p className="text-gray-300 mb-5 flex items-center gap-2">
                    <span className="font-medium">Helper:</span> {task.helper.name}
                  </p>
                )}

                <div className="flex flex-wrap gap-4">
                  {task.status === "accepted" && (
                    <button
                      onClick={() => navigate(`/chat/${task._id}`)}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-violet-600 rounded-xl font-semibold text-white hover:from-purple-700 hover:to-violet-700 shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      <FaComments />
                      Chat
                    </button>
                  )}

                  {task.status === "accepted" && task.payment > 0 && task.paymentStatus === "pending" && (
                    <button
                      onClick={() => {
                        setSelectedPaymentTask(task);
                        setShowPaymentModal(true);
                      }}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl font-semibold text-white hover:from-green-700 hover:to-emerald-700 shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      <FaRupeeSign />
                      Pay ₹{task.payment}
                    </button>
                  )}

                  {task.status === "completed" && task.helper && !task.reviewed && (
                    <button
                      onClick={() => openRatingModal(task)}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-600 to-amber-600 rounded-xl font-semibold text-white hover:from-yellow-700 hover:to-amber-700 shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      <FaStar />
                      Rate Helper
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rating Modal - Dark Theme */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900/90 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 w-full max-w-md shadow-2xl shadow-indigo-500/20">
            <h2 className="text-2xl font-bold text-gray-100 mb-6 text-center">
              Rate Your Helper
            </h2>

            <div className="flex justify-center gap-4 text-5xl mb-6">
              {[1, 2, 3, 4, 5].map((s) => (
                <span
                  key={s}
                  onClick={() => setRating(s)}
                  className={`cursor-pointer transition-transform hover:scale-110 ${
                    s <= rating ? "text-yellow-400" : "text-gray-600"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience..."
              className="w-full p-4 bg-gray-800/70 border border-gray-700 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 h-32 resize-none mb-6"
            />

            <button
              onClick={submitReview}
              disabled={submitting || rating === 0}
              className={`w-full py-3.5 rounded-xl font-bold text-lg transition-all duration-300 ${
                submitting || rating === 0
                  ? "bg-gray-700 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl"
              }`}
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>

            <button
              onClick={() => setShowModal(false)}
              className="mt-4 w-full text-gray-400 hover:text-gray-200 transition py-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Payment Confirmation Modal - Dark Theme */}
      {showPaymentModal && selectedPaymentTask && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900/90 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 w-full max-w-md shadow-2xl shadow-green-500/20">
            <h2 className="text-2xl font-bold text-gray-100 mb-6 text-center">
              Payment Details 💸
            </h2>

            {(() => {
              const { platformFee, total } = calculateCharges(selectedPaymentTask.payment);

              return (
                <div className="space-y-4 mb-8 text-gray-200">
                  <div className="flex justify-between text-lg">
                    <span>Task Amount</span>
                    <span>₹{selectedPaymentTask.payment}</span>
                  </div>

                  <div className="flex justify-between text-gray-400">
                    <span>Platform Fee (10%)</span>
                    <span>₹{platformFee}</span>
                  </div>

                  <hr className="border-gray-700" />

                  <div className="flex justify-between text-2xl font-bold text-green-400">
                    <span>Total</span>
                    <span>₹{total}</span>
                  </div>
                </div>
              );
            })()}

            <button
              onClick={() => {
                setShowPaymentModal(false);
                handlePayment({
                  ...selectedPaymentTask,
                  totalAmount: calculateCharges(selectedPaymentTask.payment).total
                });
              }}
              className="w-full py-3.5 rounded-xl font-bold text-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Proceed to Pay
            </button>

            <button
              onClick={() => setShowPaymentModal(false)}
              className="mt-4 w-full text-gray-400 hover:text-gray-200 transition py-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyTasks;