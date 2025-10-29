import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../../api/apiConstant";
import VenueImage from "./VenueImage";
import VenueInfo from "./VenueInfo";
import VenueActions from "./VenueActions";
import BookingModal from "./BookingModal";
import VenueDetails from "../VenueDetails";
import { toast } from "react-toastify";

const VenueCard = ({ venue }) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ratings, setRatings] = useState([]);
  const [bookingData, setBookingData] = useState({
    bookingDate: new Date().toISOString().slice(0, 16),
    timeDuration: 2,
    durationHours: 1,
    durationDays: 1,
  });

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/review/average-ratings`);
        setRatings(res.data || []);
      } catch {
        toast.error("Error fetching ratings");
      }
    };
    fetchRatings();
  }, []);

  const venueRating = ratings.find((r) => r.venueid === venue.venueId);
  const averageRating = venueRating ? Number(venueRating.averagerating).toFixed(1) : null;

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBookingData((prev) => ({ ...prev, [name]: value }));
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

      await axios.post(`${BASE_URL}/booking/create`, payload, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      toast.success("Booking created successfully!");
      setIsBookingOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error creating booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white/80 border border-gray-200 rounded-2xl shadow-md hover:shadow-2xl transition transform hover:-translate-y-1 flex flex-col w-full">
        <VenueImage venue={venue} averageRating={averageRating} />
        <VenueInfo venue={venue} />
        <VenueActions
          onViewDetails={() => setIsDetailsOpen(true)}
          onBookNow={() => setIsBookingOpen(true)}
        />
      </div>

      {isDetailsOpen && (
        <VenueDetails venue={venue} onClose={() => setIsDetailsOpen(false)} />
      )}

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        venue={venue}
        bookingData={bookingData}
        setBookingData={setBookingData}
        handleBookingChange={handleBookingChange}
        handleBookNow={handleBookNow}
        loading={loading}
      />
    </>
  );
};

export default VenueCard;
