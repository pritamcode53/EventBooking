import React, { useEffect, useState } from "react";
import axios from "axios";
import { APPROVED_VENUE } from "../../../api/apiConstant";
import { Calendar, User, MapPin, CheckCircle } from "lucide-react";

const ApprovedList = () => {
  const [approvedBookings, setApprovedBookings] = useState([]);

  const fetchApprovedBookings = async () => {
    const res = await axios.get(APPROVED_VENUE, { withCredentials: true });
    const filtered = res.data.filter((b) => b.status === "Approved");
    setApprovedBookings(filtered);
  };

  useEffect(() => {
    fetchApprovedBookings();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {approvedBookings.length === 0 ? (
        <p className="text-gray-500 text-center w-full">No Approved Bookings</p>
      ) : (
        approvedBookings.map((b) => (
          <div
            key={b.bookingId}
            className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all p-5 border border-gray-100"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-gray-800">
                {b.venue?.name || "Unknown Venue"}
              </h3>
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-green-100 text-green-600">
                Approved
              </span>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <p className="flex items-center gap-2">
                <Calendar size={16} />{" "}
                {new Date(b.bookingDate).toLocaleString()}
              </p>
              <p className="flex items-center gap-2">
                <User size={16} /> {b.customer?.name || "Guest User"}
              </p>
              <p className="flex items-center gap-2">
                <MapPin size={16} /> {b.venue?.location || "Location not found"}
              </p>
              <p className="font-semibold text-gray-900">
                ₹{b.totalPrice?.toLocaleString()}
              </p>
            </div>

            <div className="flex justify-end mt-4">
              <CheckCircle className="text-green-500" size={20} />
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ApprovedList;
