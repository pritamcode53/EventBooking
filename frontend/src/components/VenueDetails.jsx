import React from "react";
import { IMAGE_BASE_URL } from "../api/apiConstant";

const VenueDetails = ({ venue, onClose }) => {
  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-lg max-w-3xl w-full p-6 relative shadow-lg overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 font-bold text-lg"
        >
          ×
        </button>

        <h2 className="text-2xl font-bold mb-4">{venue.name}</h2>
        <p className="text-gray-600 mb-2">{venue.location}</p>
        <p className="text-gray-600 mb-2">Capacity: {venue.capacity}</p>
        {venue.description && (
          <p className="text-gray-700 mb-4">{venue.description}</p>
        )}

        {/* All Images */}
        {venue.images && venue.images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
            {venue.images.map((img, idx) => (
              <img
                key={idx}
                src={`${IMAGE_BASE_URL}${img}`}
                alt={`${venue.name} ${idx}`}
                className="w-full h-32 object-cover rounded"
              />
            ))}
          </div>
        )}

        {/* Reviews */}
        {venue.reviews && venue.reviews.length > 0 && (
          <div>
            <h3 className="text-lg font-bold mb-2">Reviews</h3>
            {venue.reviews.map((review) => (
              <div key={review.reviewId} className="mb-2 p-2 border rounded">
                <p className="font-semibold">{review.reviewerName}</p>
                <p>Rating: {review.rating} ⭐</p>
                <p>{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VenueDetails;
