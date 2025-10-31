import React, { useState } from "react";
import axios from "axios";

const ReviewModal = ({ data, onClose, refresh }) => {
  const [reviewData, setReviewData] = useState({
    venueId: data.venueId,
    rating: 0,
    comment: "",
    image: null,
  });

  const submitReview = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("VenueId", reviewData.venueId);
    formData.append("Rating", reviewData.rating);
    formData.append("Comment", reviewData.comment);
    if (reviewData.image) formData.append("Image", reviewData.image);

    try {
      await axios.post("http://localhost:5232/api/review/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      alert("Review submitted!");
      onClose();
      refresh();
    } catch {
      alert("Error submitting review");
    }
  };

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-96">
        <form onSubmit={submitReview}>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Submit Review
          </h2>

          <div className="flex gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() =>
                  setReviewData((p) => ({ ...p, rating: star }))
                }
                className={`cursor-pointer text-2xl ${
                  star <= reviewData.rating ? "text-yellow-500" : "text-gray-300"
                }`}
              >
                ★
              </span>
            ))}
          </div>

          <textarea
            placeholder="Write your review..."
            value={reviewData.comment}
            onChange={(e) =>
              setReviewData((p) => ({ ...p, comment: e.target.value }))
            }
            className="border rounded-lg p-2 w-full mb-3"
          />

          <input
            type="file"
            onChange={(e) =>
              setReviewData((p) => ({ ...p, image: e.target.files[0] }))
            }
            className="w-full border p-2 rounded mb-3"
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
