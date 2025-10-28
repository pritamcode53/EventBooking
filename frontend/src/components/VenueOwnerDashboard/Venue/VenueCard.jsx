import React, { useState, useRef, useEffect } from "react";
import { MoreVertical, Edit3, Upload, DollarSign, Trash2, MoreHorizontal } from "lucide-react";
import axios from "axios";
import { IMAGE_BASE_URL, DELETE_VENUE } from "../../../api/apiConstant";

const VenueCard = ({
  venue,
  images = [],
  perHour,
  perDay,
  perEvent,
  onEdit,
  onUpload,
  onDelete,
  onPrice,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const imageUrl = images.length > 0 ? `${IMAGE_BASE_URL}${images[0]}` : null;

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this venue?")) return;
    try {
      await axios.delete(DELETE_VENUE(venue.venueId), {
        withCredentials: true,
      });
      onDelete(); // ✅ notify parent to refresh
    } catch (err) {
      console.error("Failed to delete venue:", err);
    }
  };

  const handleAction = (action) => {
    setIsMenuOpen(false);
    if (action === "price") onPrice();
    else if (action === "edit") onEdit();
    else if (action === "upload") onUpload();
    else if (action === "delete") handleDelete();
  };

  // ✅ Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <tr className="border-b hover:bg-gray-50 transition-all duration-200">
      <td className="px-4 py-3">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={venue.name}
            className="w-24 h-16 object-cover rounded-lg shadow-sm"
          />
        ) : (
          <div className="w-24 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-xs">
            No Image
          </div>
        )}
      </td>

      <td className="px-4 py-3 font-medium text-gray-900">{venue.name}</td>
      <td className="px-4 py-3 text-gray-700">{venue.location}</td>
      <td className="px-4 py-3 text-gray-700">{venue.capacity}</td>
      <td className="px-4 py-3 text-gray-700">
        <ul>
          <li>Per Hour: {venue.perHour}</li>
          <li>Per Day: {venue.perDay}</li>
          <li>Per Event: {venue.perEvent}</li>
        </ul>
      </td>
      <td className="px-4 py-3 text-gray-600 max-w-xs">{venue.description}</td>

      {/* ✅ Dropdown menu for actions */}
      <td className="px-4 py-3 relative" ref={menuRef}>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1.5 rounded-md flex items-center justify-center transition"
        >
          <MoreHorizontal size={18} />
        </button>

        {isMenuOpen && (
          <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-lg shadow-lg w-40 z-50">
            <button
              onClick={() => handleAction("price")}
              className="w-full flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm"
            >
              <DollarSign size={14} /> Update Pricing
            </button>
            <button
              onClick={() => handleAction("edit")}
              className="w-full flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm"
            >
              <Edit3 size={14} /> Edit Venue
            </button>
            <button
              onClick={() => handleAction("upload")}
              className="w-full flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm"
            >
              <Upload size={14} /> Upload Images
            </button>
            <button
              onClick={() => handleAction("delete")}
              className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 text-sm"
            >
              <Trash2 size={14} /> Delete Venue
            </button>
          </div>
        )}
      </td>
    </tr>
  );
};

export default VenueCard;
