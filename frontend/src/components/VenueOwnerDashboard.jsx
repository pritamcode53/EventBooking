import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  VENUE_BOOKINGS,
  UPDATE_BOOKING_STATUS,
  ALL_VENUE,
  ADD_VENUE,
  DELETE_VENUE,
  UPDATE_VENUE,
  UPLOAD_VENUE_IMAGES,
  APPROVED_VENUE,
} from "../api/apiConstant";

const ADD_VENUE_PRICING = (venueId) =>
  `http://localhost:5232/api/booking/admin/venue/${venueId}/pricing/add`;

const VenueOwnerDashboard = () => {
  const [venues, setVenues] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [approved, setApproved] = useState([]);
  const [loading, setLoading] = useState(false);

  const [newVenue, setNewVenue] = useState({
    name: "",
    location: "",
    capacity: "",
    description: "",
  });
  const [editVenue, setEditVenue] = useState(null);
  const [pricingVenueId, setPricingVenueId] = useState(null);
  const [pricingData, setPricingData] = useState([
    { type: 0, price: "" },
    { type: 1, price: "" },
    { type: 2, price: "" },
  ]);
  const [selectedFiles, setSelectedFiles] = useState([]);

  // ------------------- Fetch Venues -------------------
  const fetchVenues = async () => {
    try {
      setLoading(true);
      const res = await axios.get(ALL_VENUE, { withCredentials: true });
      setVenues(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load venues");
    } finally {
      setLoading(false);
    }
  };

  // ------------------- Fetch Bookings -------------------
  const fetchBookings = async () => {
    try {
      const res = await axios.get(VENUE_BOOKINGS, { withCredentials: true });
      setBookings(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load bookings");
    }
  };

  // ------------------- Fetch Approved Bookings -------------------
  const fetchApprovedBookings = async () => {
    try {
      const res = await axios.get(APPROVED_VENUE, { withCredentials: true });
      setApproved(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load approved bookings");
    }
  };

  useEffect(() => {
    fetchVenues();
    fetchBookings();
    fetchApprovedBookings();
  }, []);

  // ------------------- Venue Operations -------------------
  const handleAddVenue = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(ADD_VENUE, newVenue, {
        withCredentials: true,
      });
      alert("Venue added successfully!");
      setPricingVenueId(res.data.venueId);
      setNewVenue({ name: "", location: "", capacity: "", description: "" });
      fetchVenues();
    } catch (err) {
      console.error(err);
      alert("Failed to add venue");
    }
  };

  const handleUpdateVenue = async (e) => {
    e.preventDefault();
    try {
      await axios.put(UPDATE_VENUE(editVenue.venueId), editVenue, {
        withCredentials: true,
      });
      alert("Venue updated successfully!");
      setEditVenue(null);
      fetchVenues();
    } catch (err) {
      console.error(err);
      alert("Failed to update venue");
    }
  };

  const handleDeleteVenue = async (venueId) => {
    if (!window.confirm("Are you sure you want to delete this venue?")) return;
    try {
      await axios.delete(DELETE_VENUE(venueId), { withCredentials: true });
      alert("Venue deleted successfully!");
      fetchVenues();
    } catch (err) {
      console.error(err);
      alert("Failed to delete venue");
    }
  };

  const handleUploadImages = async (venueId) => {
    if (selectedFiles.length === 0)
      return alert("Please select files to upload");

    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append("files", file));

    try {
      await axios.post(UPLOAD_VENUE_IMAGES(venueId), formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      alert("Images uploaded successfully!");
      setSelectedFiles([]);
    } catch (err) {
      console.error(err);
      alert("Failed to upload images");
    }
  };

  const handleAddPricing = async (e) => {
    e.preventDefault();
    if (!pricingVenueId) return;

    try {
      await axios.post(ADD_VENUE_PRICING(pricingVenueId), pricingData, {
        withCredentials: true,
      });
      alert("Pricing added successfully!");
      setPricingVenueId(null);
      fetchVenues();
    } catch (err) {
      console.error(err);
      alert("Failed to add pricing");
    }
  };

  // ------------------- Booking Status -------------------
  const updateBookingStatus = async (bookingId, status) => {
    try {
      await axios.patch(
        UPDATE_BOOKING_STATUS(bookingId),
        { status },
        { withCredentials: true }
      );
      alert(`Booking ${status.toLowerCase()} successfully!`);
      fetchBookings();
      fetchApprovedBookings();
    } catch (err) {
      console.error(err);
      alert("Failed to update booking status");
    }
  };

  return (
    <div className="p-6 space-y-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Venue Owner Dashboard
      </h1>

      {/* Add Venue Form */}
      {!pricingVenueId && !editVenue && (
        <form
          onSubmit={handleAddVenue}
          className="bg-white p-6 shadow-md rounded-lg max-w-lg space-y-4"
        >
          <h2 className="text-xl font-semibold">Add New Venue</h2>
          <input
            type="text"
            placeholder="Name"
            value={newVenue.name}
            onChange={(e) => setNewVenue({ ...newVenue, name: e.target.value })}
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="Location"
            value={newVenue.location}
            onChange={(e) =>
              setNewVenue({ ...newVenue, location: e.target.value })
            }
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="number"
            placeholder="Capacity"
            value={newVenue.capacity}
            onChange={(e) =>
              setNewVenue({ ...newVenue, capacity: e.target.value })
            }
            className="w-full border p-2 rounded"
            required
          />
          <textarea
            placeholder="Description"
            value={newVenue.description}
            onChange={(e) =>
              setNewVenue({ ...newVenue, description: e.target.value })
            }
            className="w-full border p-2 rounded"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Venue
          </button>
        </form>
      )}

      {/* Edit Venue Form */}
      {editVenue && (
        <form
          onSubmit={handleUpdateVenue}
          className="bg-white p-6 shadow-md rounded-lg max-w-lg space-y-4"
        >
          <h2 className="text-xl font-semibold">Edit Venue</h2>
          <input
            type="text"
            value={editVenue.name}
            onChange={(e) =>
              setEditVenue({ ...editVenue, name: e.target.value })
            }
            className="w-full border p-2 rounded"
          />
          <input
            type="text"
            value={editVenue.location}
            onChange={(e) =>
              setEditVenue({ ...editVenue, location: e.target.value })
            }
            className="w-full border p-2 rounded"
          />
          <input
            type="number"
            value={editVenue.capacity}
            onChange={(e) =>
              setEditVenue({ ...editVenue, capacity: e.target.value })
            }
            className="w-full border p-2 rounded"
          />
          <textarea
            value={editVenue.description}
            onChange={(e) =>
              setEditVenue({ ...editVenue, description: e.target.value })
            }
            className="w-full border p-2 rounded"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Update
            </button>
            <button
              onClick={() => setEditVenue(null)}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Add Pricing Form */}
      {pricingVenueId && (
        <form
          onSubmit={handleAddPricing}
          className="bg-white p-6 shadow-md rounded-lg max-w-lg space-y-4"
        >
          <h2 className="text-xl font-semibold">
            Add Pricing for Venue ID: {pricingVenueId}
          </h2>
          {pricingData.map((p, index) => (
            <div key={index} className="flex gap-2 items-center">
              <label className="w-1/3">
                {p.type === 0
                  ? "Per Hour"
                  : p.type === 1
                  ? "Per Day"
                  : "Per Event"}
              </label>
              <input
                type="number"
                value={p.price}
                onChange={(e) => {
                  const newData = [...pricingData];
                  newData[index].price = e.target.value;
                  setPricingData(newData);
                }}
                placeholder="Enter price"
                className="border p-2 rounded w-2/3"
                required
              />
            </div>
          ))}
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Save Pricing
          </button>
        </form>
      )}

      {/* Venues List */}
      <div>
        <h2 className="text-2xl font-semibold mb-3">Your Venues</h2>
        {loading ? (
          <p>Loading...</p>
        ) : venues.length === 0 ? (
          <p>No venues found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {venues.map((v) => (
              <div
                key={v.venueId}
                className="bg-white p-4 shadow rounded space-y-2"
              >
                <h3 className="font-semibold text-lg">{v.name}</h3>
                <p>{v.location}</p>
                <p>Capacity: {v.capacity}</p>
                <p className="text-gray-600">{v.description}</p>

                {/* Image Upload */}
                <input
                  type="file"
                  multiple
                  onChange={(e) => setSelectedFiles([...e.target.files])}
                  className="mt-2"
                />
                <button
                  onClick={() => handleUploadImages(v.venueId)}
                  className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700 mt-1"
                >
                  Upload Images
                </button>

                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => setEditVenue(v)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteVenue(v.venueId)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pending Booking Requests */}
      <div>
        <h2 className="text-2xl font-semibold mb-3">Booking Requests</h2>
        {bookings.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => (
              <div
                key={b.bookingId}
                className="bg-white p-4 shadow rounded flex justify-between items-center"
              >
                <div>
                  <h3 className="font-semibold">{b.venue.name}</h3>
                  <p>Date: {new Date(b.bookingDate).toLocaleString()}</p>
                  <p>Customer: {b.customer.name}</p>
                  <p>Status: {b.status}</p>
                </div>
                {b.status === "Pending" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        updateBookingStatus(b.bookingId, "Approved")
                      }
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() =>
                        updateBookingStatus(b.bookingId, "Rejected")
                      }
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Approved Bookings */}
      <div>
        <h2 className="text-2xl font-semibold mb-3">
          Approved Bookings (Upcoming)
        </h2>
        {approved.length === 0 ? (
          <p>No approved bookings found.</p>
        ) : (
          <div className="space-y-4">
            {approved.map((b) => (
              <div
                key={b.bookingId}
                className="bg-white p-4 shadow rounded flex justify-between items-center"
              >
                <div>
                  <h3 className="font-semibold">{b.venue.name}</h3>
                  <p>Date: {new Date(b.bookingDate).toLocaleString()}</p>
                  <p>Customer: {b.customer.name}</p>
                  <p>Status: {b.status}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VenueOwnerDashboard;
