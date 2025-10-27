import React, { useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const venues = [
  {
    id: 1,
    name: "Royal Palace Banquet Hall",
    image: "/images/venue1.jpg",
  },
  {
    id: 2,
    name: "The Orchid Garden",
    image: "/images/venue2.jpg",
  },
  {
    id: 3,
    name: "Golden Leaf Resort",
    image: "/images/venue3.jpg",
  },
  {
    id: 4,
    name: "Sunset Lawn",
    image: "/images/venue4.jpg",
  },
];

const TopRatedVenues = () => {
  const [activeVenue, setActiveVenue] = useState(null);

  const handleToggle = (id) => {
    if (window.innerWidth <= 768) {
      setActiveVenue(activeVenue === id ? null : id);
    }
  };

  return (
    <div className="px-6 py-12 bg-gray-50">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
           Top Rated Venues
        </h2>
        <p className="text-gray-500">
          Discover the most loved venues chosen by happy couples.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {venues.map((venue, index) => {
          const isActive = activeVenue === venue.id;
          return (
            <motion.div
              key={venue.id}
              className="relative rounded-2xl overflow-hidden shadow-lg cursor-pointer group"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              viewport={{ once: true }}
              onClick={() => handleToggle(venue.id)}
            >
              <img
                src={venue.image}
                alt={venue.name}
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
              />

              {/* Overlay */}
              <div
                className={`absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-white text-center transition-all duration-300 ${
                  isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                }`}
              >
                <h3 className="text-lg sm:text-xl font-semibold mb-3 px-3">
                  {venue.name}
                </h3>
                <button className="bg-pink-500 hover:bg-pink-600 px-4 py-2 rounded-full text-sm sm:text-base transition-all">
                  Book Now
                </button>
              </div>

              {/* Top-right badge */}
              <div className="absolute top-3 right-3 bg-white rounded-full px-3 py-1 flex items-center shadow-md">
                <Star className="w-4 h-4 text-yellow-500 mr-1" />
                <span className="text-sm font-medium text-gray-700">4.9</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default TopRatedVenues;
