import { useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import {
  FaMapMarkerAlt,
  FaRupeeSign,
  FaCheckCircle,
  FaLocationArrow,
  FaSpinner
} from "react-icons/fa";

function PostTask() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [taskType, setTaskType] = useState("global");
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [locationLoading, setLocationLoading] = useState(false);
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const token = localStorage.getItem("token");

  const categories = [
    "Delivery",
    "Cleaning",
    "Technical",
    "Writing",
    "Design",
    "Other"
  ];

  const fetchCurrentLocation = () => {
    setLocationLoading(true);
    setError("");
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        setLat(latitude);
        setLng(longitude);

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();
          const fetchedAddress =
            data.display_name ||
            `Lat: ${latitude.toFixed(5)}, Lng: ${longitude.toFixed(5)}`;
          setAddress(fetchedAddress);
        } catch {
          setAddress(`Lat: ${latitude.toFixed(5)}, Lng: ${longitude.toFixed(5)}`);
        }
        setLocationLoading(false);
      },
      () => {
        setError("Location access denied. Please allow location or enter address manually.");
        setLocationLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const postTask = async () => {
    if (!title.trim() || !description.trim()) {
      setError("Title and Description are required");
      return;
    }

    const paymentNum = parseFloat(payment) || 0;

    // ────────────────────────────────────────────────
    //          IMPROVED LOCATION VALIDATION & OBJECT
    // ────────────────────────────────────────────────
    let locationObj = {
      type: "Point",
      coordinates: [0, 0],
      address: ""
    };

    if (taskType === "nearby") {
      if (!lat || !lng) {
        setError("Nearby tasks require a valid location. Please use 'Current Location' or enter address and fetch coordinates.");
        return;
      }

      locationObj = {
        type: "Point",
        coordinates: [parseFloat(lng), parseFloat(lat)], // IMPORTANT: lng first (GeoJSON standard)
        address: address.trim()
      };
    }
    // ────────────────────────────────────────────────

    setLoading(true);
    setError("");

    try {
      await axios.post(
        "https://backend2-3avp.onrender.com/api/tasks",
        {
          title: title.trim(),
          description: description.trim(),
          category: category.trim() || undefined,
          taskType,
          payment: paymentNum,
          exactAddress: address.trim(),
          location: locationObj
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setIsSuccess(true);
      setTitle("");
      setDescription("");
      setCategory("");
      setPayment("");
      setAddress("");
      setLat(null);
      setLng(null);

      setTimeout(() => setIsSuccess(false), 5000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to post task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-indigo-950 to-slate-950 text-gray-100 pb-20 lg:pb-8">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        <div className="bg-gray-900/70 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl shadow-black/40 p-6 sm:p-8">
          {isSuccess ? (
            <div className="flex flex-col items-center text-center py-12 animate-fade-in">
              <FaCheckCircle className="text-green-400 text-7xl mb-6 animate-pulse" />
              <h2 className="text-3xl font-bold text-gray-100 mb-3">
                Task Posted Successfully!
              </h2>
              <p className="text-gray-300 text-lg">
                Helpers will see it soon. Great job!
              </p>
            </div>
          ) : (
            <>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-8 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Post a New Task
              </h1>

              {error && (
                <div className="bg-red-900/40 border border-red-700/50 text-red-300 p-4 rounded-xl mb-6 text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-6">
                {/* Task Type Toggle */}
                <div className="flex gap-3 bg-gray-800/50 p-1.5 rounded-xl border border-gray-700/50">
                  <button
                    onClick={() => setTaskType("global")}
                    className={`flex-1 py-3 rounded-lg font-semibold transition-all duration-300 ${
                      taskType === "global"
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30"
                        : "text-gray-300 hover:bg-gray-700/50"
                    }`}
                  >
                    🌍 Global
                  </button>
                  <button
                    onClick={() => setTaskType("nearby")}
                    className={`flex-1 py-3 rounded-lg font-semibold transition-all duration-300 ${
                      taskType === "nearby"
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30"
                        : "text-gray-300 hover:bg-gray-700/50"
                    }`}
                  >
                    📍 Nearby
                  </button>
                </div>

                {/* Title */}
                <input
                  className="w-full px-5 py-4 bg-gray-800/60 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-inner text-gray-100 placeholder-gray-400"
                  placeholder="What needs to be done? (e.g. Fix my AC)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />

                {/* Description */}
                <textarea
                  className="w-full px-5 py-4 bg-gray-800/60 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-inner text-gray-100 placeholder-gray-400 h-32 resize-none"
                  placeholder="Describe the task in detail..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />

                {/* Category Chips */}
                <div className="flex flex-wrap gap-2.5">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`px-5 py-2.5 text-sm font-medium rounded-full transition-all duration-300 ${
                        category === cat
                          ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                          : "bg-gray-800/60 text-gray-300 hover:bg-gray-700/70 border border-gray-600"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Payment */}
                <div className="relative">
                  <FaRupeeSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    className="w-full pl-11 pr-5 py-4 bg-gray-800/60 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-inner text-gray-100 placeholder-gray-400"
                    placeholder="Budget (₹)"
                    value={payment}
                    onChange={(e) => setPayment(e.target.value)}
                  />
                </div>

                {/* Location - Nearby only */}
                {taskType === "nearby" && (
                  <div className="space-y-4 bg-gray-800/40 p-6 rounded-xl border border-gray-700/50">
                    <div className="relative">
                      <FaMapMarkerAlt className="absolute left-4 top-4 text-gray-400" />
                      <input
                        className="w-full pl-11 pr-4 py-4 bg-gray-800/60 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-inner text-gray-100 placeholder-gray-400"
                        placeholder="Enter address or use current location"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </div>

                    <button
                      onClick={fetchCurrentLocation}
                      disabled={locationLoading}
                      className={`w-full flex items-center justify-center gap-3 py-3.5 rounded-xl font-semibold transition-all duration-300 shadow-md ${
                        locationLoading
                          ? "bg-gray-700 text-gray-300 cursor-wait"
                          : "bg-gradient-to-r from-indigo-600/80 to-purple-600/80 text-white hover:from-indigo-600 hover:to-purple-600 border border-indigo-500/30"
                      }`}
                    >
                      {locationLoading ? (
                        <>
                          <FaSpinner className="animate-spin text-xl" />
                          Fetching Location...
                        </>
                      ) : (
                        <>
                          <FaLocationArrow className="text-lg" />
                          Use Current Location
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  onClick={postTask}
                  disabled={loading}
                  className={`w-full py-4 rounded-xl font-bold text-white text-lg transition-all duration-300 shadow-xl ${
                    loading
                      ? "bg-gray-700 cursor-wait"
                      : "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 hover:shadow-2xl hover:shadow-indigo-500/30 active:scale-[0.98]"
                  }`}
                >
                  {loading ? "Posting Task..." : "Post Task"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Fade-in animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default PostTask;