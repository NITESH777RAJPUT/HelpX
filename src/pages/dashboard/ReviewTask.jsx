import { useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";

function ReviewTask({ taskId, helperId }) {

  const [rating,setRating] = useState(5);
  const [comment,setComment] = useState("");

  const submitReview = async () => {

    const token = localStorage.getItem("token");

    await axios.post(
      "https://backend2-3avp.onrender.com/api/reviews",
      {
        task: taskId,
        helper: helperId,
        rating,
        comment
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    alert("Review submitted!");

  };

  return (

    <div>

      <Navbar/>

      <div className="p-10">

        <h1 className="text-xl font-bold mb-4">
          Rate Helper
        </h1>

        <input
          type="number"
          min="1"
          max="5"
          value={rating}
          onChange={(e)=>setRating(e.target.value)}
          className="border p-2 mb-3"
        />

        <textarea
          placeholder="Write review"
          onChange={(e)=>setComment(e.target.value)}
          className="border p-2 mb-3 w-full"
        />

        <button
          onClick={submitReview}
          className="bg-blue-600 text-white px-4 py-2"
        >
          Submit Review
        </button>

      </div>

    </div>

  );

}

export default ReviewTask;