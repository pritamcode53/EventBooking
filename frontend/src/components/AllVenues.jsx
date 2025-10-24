import React, { useEffect, useState } from "react";
import axios from "axios";
import VenueCard from "./VenueCard";
import { GET_ALL_VENUES } from "../api/apiConstant";

const AllVenues = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        setLoading(true);
        const res = await axios.get(GET_ALL_VENUES);
        setVenues(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch venues", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, []);

  return (
    <div className="pt-24 px-6 pb-10 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">All Venues</h1>
      {loading ? (
        <div className="text-center">Loading venues...</div>
      ) : venues.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {venues.map(venue => (
            <VenueCard key={venue.venueId} venue={venue} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">No venues available</div>
      )}
    </div>
  );
};

export default AllVenues;
