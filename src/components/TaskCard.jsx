import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  FaMapMarkerAlt,
  FaRupeeSign,
  FaTag,
  FaRoute,
  FaComments
} from "react-icons/fa";

function TaskCard({ task, refreshTasks, userLocation, activeTab }) {

  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");

  const acceptTask = async () => {

    if (!token) {
      alert("Please login to accept tasks");
      return;
    }

    try {

      await axios.put(
        `https://backend2-3avp.onrender.com/api/tasks/${task._id}/accept`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      alert("Task accepted successfully 🎉");

      refreshTasks();

    } catch (error) {

      const msg =
        error.response?.data?.message ||
        "Something went wrong. Try again.";

      alert(msg);

    }

  };

  const openChat = () => {
    navigate(`/chat/${task._id}`);
  };

  const postedById = task.postedBy?._id || task.postedBy;
  const currentUserId = currentUser?.id;

  const isOwnTask = postedById === currentUserId;

  const canAccept =
    !isOwnTask &&
    task.status === "open" &&
    !!token &&
    !!currentUserId;

  const getLocationDisplay = (loc) => {

    if (!loc) return "Location not specified";

    if (typeof loc === "string") return loc;

    if (loc.address) return loc.address;

    if (loc.coordinates && loc.coordinates.length === 2) {

      const [lng, lat] = loc.coordinates;

      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;

    }

    return "Location not specified";

  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {

    if (!lat1 || !lon1 || !lat2 || !lon2) return null;

    const R = 6371;

    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c;

    return distance < 1
      ? `${(distance * 1000).toFixed(0)} m`
      : `${distance.toFixed(1)} km`;

  };

  const openMap = () => {

    if (!userLocation) {
      alert("Enable location to see route");
      return;
    }

    if (!task.location?.coordinates) {
      alert("Task location unavailable");
      return;
    }

    const [taskLng, taskLat] = task.location.coordinates;

    const origin = `${userLocation.lat},${userLocation.lng}`;
    const destination = `${taskLat},${taskLng}`;

    const destParam = task.exactAddress
      ? encodeURIComponent(task.exactAddress)
      : destination;

    const mapUrl =
      `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destParam}&travelmode=driving`;

    window.open(mapUrl, "_blank");

  };

  const distanceText =
    task.taskType === "nearby" &&
    userLocation &&
    task.location?.coordinates
      ? calculateDistance(
          userLocation.lat,
          userLocation.lng,
          task.location.coordinates[1],
          task.location.coordinates[0]
        )
      : null;

  return (

    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all">

      {/* TITLE */}

      <h2 className="text-lg font-bold text-slate-900 mb-2">
        {task.title}
      </h2>

      {/* DESCRIPTION */}

      <p className="text-slate-600 text-sm mb-4 line-clamp-3">
        {task.description}
      </p>


      {/* TAGS */}

      <div className="flex flex-wrap gap-3 text-sm mb-4">

        <span className="flex items-center gap-1 text-slate-600">
          <FaMapMarkerAlt className="text-red-500"/>
          {getLocationDisplay(task.location)}
        </span>

        {task.payment > 0 && (

          <span className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-lg font-semibold">
            <FaRupeeSign />
            {task.payment}
          </span>

        )}

        {task.category && (

          <span className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-lg">
            <FaTag />
            {task.category}
          </span>

        )}

      </div>


      {/* DISTANCE */}

      {task.taskType === "nearby" && (

        <div className="mb-4 text-sm">

          {distanceText ? (

            <p className="text-orange-600 font-medium">
              📍 {distanceText} away
            </p>

          ) : (

            <p className="text-slate-400 italic">
              Distance calculating...
            </p>

          )}

          {task.status === "open" && !isOwnTask && (

            <button
              onClick={openMap}
              className="mt-2 flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm"
            >
              <FaRoute />
              Open Route
            </button>

          )}

        </div>

      )}


      {/* FOOTER */}

      <div className="flex items-center justify-between mt-4">

        {task.status === "open" ? (

          isOwnTask ? (

            <span className="text-slate-400 italic">
              Your posted task
            </span>

          ) : (

            <button
              onClick={acceptTask}
              disabled={!canAccept}
              className={`px-5 py-2 rounded-lg font-medium text-white ${
                canAccept
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-blue-300 cursor-not-allowed"
              }`}
            >
              Accept Task
            </button>

          )

        ) : (

          <div className="flex items-center gap-3">

            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                task.status === "accepted"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
            </span>

            {task.helper?.name && (

              <span className="text-sm text-slate-500">
                {task.helper.name}
              </span>

            )}

            {task.status === "accepted" && (

              <button
                onClick={openChat}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-lg text-sm"
              >
                <FaComments />
                Chat
              </button>

            )}

          </div>

        )}

      </div>

    </div>

  );

}

export default TaskCard;