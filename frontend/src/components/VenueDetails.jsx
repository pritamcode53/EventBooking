import React from "react";
import { IMAGE_BASE_URL } from "../api/apiConstant";

const VenueDetails = ({ venue, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-4xl p-6 relative shadow-xl overflow-y-auto max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
        >
          ×
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">{venue.name}</h2>
          <p className="text-gray-600">{venue.location}</p>
          <p className="text-gray-600">Capacity: {venue.capacity}</p>
        </div>

        {/* Photos Gallery */}
        {venue.images && venue.images.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-3 text-center">
              Gallery
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {venue.images.map((img, idx) => (
                <img
                  key={idx}
                  src={`${IMAGE_BASE_URL}${img}`}
                  alt={`${venue.name} ${idx}`}
                  className="w-full h-32 object-cover rounded-lg shadow-md hover:scale-105 transform transition duration-300"
                />
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        {venue.description && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Description</h3>
            <p className="text-gray-700">{venue.description}</p>
          </div>
        )}

        {/* Reviews */}
        {venue.reviews && venue.reviews.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4 text-center">
              Reviews
            </h3>
            <div className="space-y-4">
              {venue.reviews.map((review) => {
                // Debug: check if images exist
                console.log("Review Images:", review.ImagePath);

                return (
                  <div
                    key={review.reviewId}
                    className="p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition bg-gray-50"
                  >
                    <div className="flex items-center mb-2">
                      {review.reviewerImage && (
                        <img
                          src={`${IMAGE_BASE_URL}${review.reviewerImage}`}
                          alt={review.reviewerName}
                          className="w-10 h-10 rounded-full mr-3 object-cover"
                        />
                      )}
                      <div>
                        <p className="font-semibold text-gray-800">{review.reviewerName}</p>
                        <p className="flex text-yellow-500">
                          {"★".repeat(review.rating)}
                          {"☆".repeat(5 - review.rating)}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-2">{review.comment}</p>

                    {/* Review Images */}
                    {review.ImageUrl && review.ImageUrl.length > 0 && (
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-2">
                        {(Array.isArray(review.ImageUrl) ? review.ImageUrl : [review.ImageUrl]).map((img, idx) => (
                          <img
                            key={idx}
                            src={`${IMAGE_BASE_URL}${img}`}
                            alt={`Review ${idx}`}
                            className="w-full h-20 object-cover rounded-lg shadow-sm"
                          />
                        ))}
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VenueDetails;
