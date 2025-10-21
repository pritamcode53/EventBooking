import React, { useEffect, useState } from "react";
import axios from "axios";
import VenueCard from "./VenueCard";
import { GET_ALL_VENUES } from "../api/apiConstant";

const Home = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const res = await axios.get(GET_ALL_VENUES);
        setVenues(res.data.data || []); // safe fallback
      } catch (err) {
        setError("Failed to load venues");
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, []);

  if (loading) return <div className="p-6 text-center">Loading venues...</div>;
  if (error) return <div className="p-6 text-red-600 text-center">{error}</div>;

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {venues.length > 0 ? (
        venues.map((venue) => <VenueCard key={venue.venueId} venue={venue} />)
      ) : (
        <div className="col-span-full text-center text-gray-500">
          No venues available
        </div>
      )}
    </div>
  );
};

export default Home;
