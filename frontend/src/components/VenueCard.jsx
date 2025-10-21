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
    timeDuration: 2, // default PerEvent
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
        timeDuration: timeDuration,
        durationHours:
          timeDuration === 0 ? parseInt(bookingData.durationHours) : 0,
        durationDays:
          timeDuration === 1 ? parseInt(bookingData.durationDays) : 0,
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
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition flex flex-col">
        {venue.images && venue.images.length > 0 ? (
          <img
            src={`${IMAGE_BASE_URL}${venue.images[0]}`}
            alt={venue.name}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
            No Image
          </div>
        )}

        <div className="p-4 flex-1 flex flex-col">
          <h2 className="text-lg font-bold mb-1">{venue.name}</h2>
          <p className="text-gray-600 text-sm mb-1 truncate">
            {venue.location}
          </p>
          <p className="text-gray-600 text-sm mb-2">
            Capacity: {venue.capacity}
          </p>
          {venue.pricings && venue.pricings.length > 0 ? (
            (() => {
              // Group by type and get the last (latest) entry for each
              const latestPrices = {};
              venue.pricings.forEach((p) => {
                latestPrices[p.type] = p; // overwrite to keep the latest per type
              });

              const getTypeLabel = (type) => {
                switch (parseInt(type, 10)) {
                  case 0:
                    return "Per Hour";
                  case 1:
                    return "Per Day";
                  case 2:
                    return "Per Event";
                  default:
                    return "Unknown";
                }
              };

              return (
                <div className="text-gray-700 text-sm mb-2 space-y-1">
                  <p className="font-semibold text-gray-800">Pricing:</p>
                  {Object.values(latestPrices).map((p) => (
                    <p key={p.type}>
                      {getTypeLabel(p.type)}: ₹{p.price.toLocaleString()}
                    </p>
                  ))}
                </div>
              );
            })()
          ) : (
            <p className="text-gray-500 text-sm mb-2">No pricing available</p>
          )}

          <div className="flex gap-2 mt-auto">
            <button
              className="bg-blue-600 text-white py-2 px-3 rounded hover:bg-blue-700 transition flex-1"
              onClick={() => setIsDetailsOpen(true)}
            >
              View Details
            </button>
            <button
              className="bg-green-600 text-white py-2 px-3 rounded hover:bg-green-700 transition flex-1"
              onClick={() => setIsBookingOpen(true)}
            >
              Book Now
            </button>
          </div>
        </div>
      </div>

      {isDetailsOpen && (
        <VenueDetails venue={venue} onClose={() => setIsDetailsOpen(false)} />
      )}

      {isBookingOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg w-96 p-6 relative shadow-lg">
            <button
              onClick={() => setIsBookingOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 font-bold text-lg"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center">Book Venue</h2>
            <div className="space-y-3">
              <div>
                <label className="block mb-1 font-semibold">Booking Date</label>
                <input
                  type="datetime-local"
                  name="bookingDate"
                  value={bookingData.bookingDate}
                  onChange={handleBookingChange}
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block mb-1 font-semibold">
                  Time Duration
                </label>
                <select
                  name="timeDuration"
                  value={bookingData.timeDuration}
                  onChange={handleBookingChange}
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  <label className="block mb-1 font-semibold">
                    Duration Hours
                  </label>
                  <input
                    type="number"
                    name="durationHours"
                    value={bookingData.durationHours}
                    onChange={handleBookingChange}
                    className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              {parseInt(bookingData.timeDuration) === 1 && (
                <div>
                  <label className="block mb-1 font-semibold">
                    Duration Days
                  </label>
                  <input
                    type="number"
                    name="durationDays"
                    value={bookingData.durationDays}
                    onChange={handleBookingChange}
                    className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              <button
                onClick={handleBookNow}
                disabled={loading}
                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
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
