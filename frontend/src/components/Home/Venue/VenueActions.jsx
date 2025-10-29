import React from "react";

const VenueActions = ({ onViewDetails, onBookNow }) => (
  <div className="flex gap-3 px-5 pb-4 mt-auto">
    <button
      className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 rounded-lg shadow hover:opacity-90 transition"
      onClick={onViewDetails}
    >
      View Details
    </button>
    <button
      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 rounded-lg shadow hover:opacity-90 transition"
      onClick={onBookNow}
    >
      Book Now
    </button>
  </div>
);

export default VenueActions;
