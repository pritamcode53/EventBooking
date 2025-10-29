import React from "react";
import VenueCard from "./Venue/VenueCard";
import { useNavigate } from "react-router-dom";

const VenueGrid = ({ venues, firstRowCount }) => {
  const navigate = useNavigate();
  const displayedVenues = venues.slice(0, firstRowCount);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {displayedVenues.map(venue => (
          <VenueCard key={venue.venueId} venue={venue} />
        ))}
      </div>

      {venues.length > firstRowCount && (
        <div className="flex justify-center mt-6">
          <button
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition font-semibold"
            onClick={() => navigate("/venues")}
          >
            Explore More
          </button>
        </div>
      )}
    </>
  );
};

export default VenueGrid;
