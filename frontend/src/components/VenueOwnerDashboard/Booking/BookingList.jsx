import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  VENUE_BOOKINGS,
  UPDATE_BOOKING_STATUS,
} from "../../../api/apiConstant";
import BookingCard from "./BookingCard";

const BookingList = () => {
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    const res = await axios.get(VENUE_BOOKINGS, { withCredentials: true });
    setBookings(res.data);
  };

  const updateStatus = async (id, status) => {
    await axios.patch(
      UPDATE_BOOKING_STATUS(id),
      { status },
      { withCredentials: true }
    );
    fetchBookings();
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {bookings.length === 0 ? (
        <p className="text-gray-500 text-center w-full">No Pending Requests</p>
      ) : (
        bookings.map((b) => (
          <BookingCard key={b.bookingId} booking={b} onUpdate={updateStatus} />
        ))
      )}
    </div>
  );
};

export default BookingList;
