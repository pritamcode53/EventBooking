import React, { useState } from "react";
import axios from "axios";
import { IMAGE_BASE_URL, BASE_URL } from "../api/apiConstant";
import VenueDetails from "./VenueDetails";

const VenueCard = ({ venue }) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bookingData, setBookingData] = useState({
    bookingDate: new Date().toISOString().slice(0, 16),
    timeDuration: 2,
    durationHours: 1,
    durationDays: 1,
  });

  const durationOptions = [
    { label: "Per Hour", value: 0 },
    { label: "Per Day", value: 1 },
    { label: "Per Event", value: 2 },
  ];

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBookingData({ ...bookingData, [name]: value });
  };

  const handleBookNow = async () => {
    try {
      setLoading(true);
      const timeDuration = parseInt(bookingData.timeDuration);
      const payload = {
        venueId: venue.venueId,
        bookingDate: bookingData.bookingDate,
        timeDuration,
        durationHours: timeDuration === 0 ? parseInt(bookingData.durationHours) : 0,
        durationDays: timeDuration === 1 ? parseInt(bookingData.durationDays) : 0,
      };

      const res = await axios.post(`${BASE_URL}/booking/create`, payload, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      alert("Booking created successfully!");
      console.log(res.data);
      setIsBookingOpen(false);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Error creating booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <div
  className="
    backdrop-blur-sm 
    bg-white/70 
    border border-gray-200 
    rounded-2xl 
    shadow-md 
    hover:shadow-2xl 
    transition-all 
    duration-300 
    overflow-hidden 
    transform 
    hover:-translate-y-1 
    flex 
    flex-col 
    w-full
  "
>
        {/* Venue Image */}
        {venue.images && venue.images.length > 0 ? (
          <img
            src={`${IMAGE_BASE_URL}${venue.images[0]}`}
            alt={venue.name}
            className="w-full h-52 object-cover rounded-t-2xl"
          />
        ) : (
          <div className="w-full h-52 bg-gray-100 flex items-center justify-center text-gray-500 text-sm">
            No Image Available
          </div>
        )}

        {/* Venue Info */}
        <div className="p-5 flex-1 flex flex-col">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">{venue.name}</h2>
          <p className="text-gray-500 text-sm mb-2">{venue.location}</p>
          <p className="text-gray-700 text-sm font-medium mb-2">
            Capacity: <span className="text-gray-900 font-semibold">{venue.capacity}</span>
          </p>

          {/* Pricing Section */}
          {venue.pricings && venue.pricings.length > 0 ? (
            (() => {
              const latestPrices = {};
              venue.pricings.forEach((p) => (latestPrices[p.type] = p));

              const getTypeLabel = (type) => {
                switch (parseInt(type, 10)) {
                  case 0: return "Per Hour";
                  case 1: return "Per Day";
                  case 2: return "Per Event";
                  default: return "Unknown";
                }
              };

              return (
                <div className="text-gray-700 text-sm mb-3 bg-gray-50 p-3 rounded-lg">
                  <p className="font-semibold text-gray-800 mb-1">Pricing</p>
                  {Object.values(latestPrices).map((p) => (
                    <p key={p.type} className="flex justify-between">
                      <span>{getTypeLabel(p.type)}</span>
                      <span className="font-semibold text-green-700">₹{p.price.toLocaleString()}</span>
                    </p>
                  ))}
                </div>
              );
            })()
          ) : (
            <p className="text-gray-400 text-sm mb-2 italic">No pricing available</p>
          )}

          {/* Buttons */}
          <div className="flex gap-3 mt-auto">
            <button
              className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 rounded-lg shadow hover:opacity-90 transition"
              onClick={() => setIsDetailsOpen(true)}
            >
              View Details
            </button>
            <button
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 rounded-lg shadow hover:opacity-90 transition"
              onClick={() => setIsBookingOpen(true)}
            >
              Book Now
            </button>
          </div>
        </div>
      </div>

      {/* Venue Details Modal */}
      {isDetailsOpen && (
        <VenueDetails venue={venue} onClose={() => setIsDetailsOpen(false)} />
      )}

      {/* Booking Modal */}
      {isBookingOpen && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-96 p-6 relative shadow-xl">
            <button
              onClick={() => setIsBookingOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 font-bold text-xl"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-5 text-center text-gray-900">Book Venue</h2>

            <div className="space-y-4">
              <div>
                <label className="block mb-1 font-semibold text-gray-700">Booking Date</label>
                <input
                  type="datetime-local"
                  name="bookingDate"
                  value={bookingData.bookingDate}
                  onChange={handleBookingChange}
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="block mb-1 font-semibold text-gray-700">Time Duration</label>
                <select
                  name="timeDuration"
                  value={bookingData.timeDuration}
                  onChange={handleBookingChange}
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  {durationOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {parseInt(bookingData.timeDuration) === 0 && (
                <div>
                  <label className="block mb-1 font-semibold text-gray-700">Duration (Hours)</label>
                  <input
                    type="number"
                    name="durationHours"
                    value={bookingData.durationHours}
                    onChange={handleBookingChange}
                    className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              )}

              {parseInt(bookingData.timeDuration) === 1 && (
                <div>
                  <label className="block mb-1 font-semibold text-gray-700">Duration (Days)</label>
                  <input
                    type="number"
                    name="durationDays"
                    value={bookingData.durationDays}
                    onChange={handleBookingChange}
                    className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              )}

              <button
                onClick={handleBookNow}
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2.5 rounded-lg font-semibold hover:opacity-90 transition"
              >
                {loading ? "Booking..." : "Confirm Booking"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VenueCard;
