import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { GET_ALL_TOP_RATED_VENUES, IMAGE_BASE_URL } from "../api/apiConstant";

const TopRatedVenues = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const res = await axios.get(GET_ALL_TOP_RATED_VENUES);
        setVenues(res.data || []);
      } catch (err) {
        console.error("Error fetching top-rated venues:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVenues();
  }, []);

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Loading top rated venues...</p>
      </div>
    );
  }

  return (
    <div
      className="relative px-6 py-16 overflow-hidden absolute inset-0 bg-[radial-gradient(circle_at_center,_#d9f99d_0%,_#ffffff_100%)]"
      // style={{
      //   background: "radial-gradient(circle at center, #e8f5e9 0%, #ffffff 80%)",
      // }}
    >
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Top Rated Venues
        </h2>
        <p className="text-gray-600">
          Discover the most loved venues chosen by our guests.
        </p>
      </div>

      {/* Scroll Buttons */}
      <button
        onClick={scrollLeft}
        className="hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 shadow-md rounded-full p-2 z-10 hover:bg-gray-100 transition"
      >
        <ChevronLeft className="w-6 h-6 text-gray-700" />
      </button>

      <button
        onClick={scrollRight}
        className="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 shadow-md rounded-full p-2 z-10 hover:bg-gray-100 transition"
      >
        <ChevronRight className="w-6 h-6 text-gray-700" />
      </button>

      {/* Venue Cards */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth px-2"
      >
        {venues
          .filter((venue) => venue.averagerating > 0)
          .map((venue, index) => (
            <motion.div
              key={venue.venueid}
              className="relative min-w-[260px] sm:min-w-[300px] rounded-2xl overflow-hidden shadow-lg bg-white cursor-pointer group flex-shrink-0"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <img
                src={`${IMAGE_BASE_URL}${venue.venueimage}`}
                alt={venue.venuename}
                className="w-full h-56 sm:h-64 object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-center items-center text-center text-white">
                <h3 className="text-lg font-semibold mb-2 px-3">
                  {venue.venuename}
                </h3>
                <button className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-full text-sm transition">
                  Book Now
                </button>
              </div>

              {/* Rating Badge */}
              <div className="absolute top-3 right-3 bg-white rounded-full px-3 py-1 flex items-center shadow-md">
                <Star className="w-4 h-4 text-yellow-500 mr-1" />
                <span className="text-sm font-medium text-gray-700">
                  {venue.averagerating?.toFixed(1)}
                </span>
              </div>
            </motion.div>
          ))}
      </div>
    </div>
  );
};

export default TopRatedVenues;
