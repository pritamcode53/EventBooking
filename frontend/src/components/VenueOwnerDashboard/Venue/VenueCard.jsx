import React from "react";
import { Trash2, Edit3, DollarSign, Upload } from "lucide-react";
import axios from "axios";
import { IMAGE_BASE_URL, DELETE_VENUE } from "../../../api/apiConstant";

const VenueCard = ({
  venue,
  images = [],
  onEdit,
  onUpload,
  onDelete,
  onPrice,
}) => {
  const imageUrl = images.length > 0 ? images[0] : null;

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

  return (
    <div
      className="bg-white rounded-lg shadow p-3 sm:p-4 flex flex-col gap-2 relative overflow-hidden cursor-pointer"
      style={{
        backgroundImage: imageUrl
          ? `url(${IMAGE_BASE_URL}${imageUrl})`
          : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(61, 87, 84, 0.4)" }}
      ></div>

      <div className="relative z-10 flex flex-col gap-1">
        <h3 className="font-semibold text-base sm:text-lg text-gray-100 truncate">
          {venue.name}
        </h3>
        <p className="text-gray-100 text-sm sm:text-base truncate">
          {venue.location}
        </p>
        <p className="text-gray-100 text-sm sm:text-base">
          Capacity: {venue.capacity}
        </p>
        <p className="text-gray-200 text-sm sm:text-base line-clamp-3">
          {venue.description}
        </p>

        <div className="flex flex-wrap gap-2 mt-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPrice();
            }}
            className="bg-green-600 text-white px-2 sm:px-3 py-1 rounded hover:bg-green-700 flex items-center gap-1 text-xs sm:text-sm"
          >
            <DollarSign className="w-3 h-3 sm:w-4 sm:h-4" /> Price
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="bg-blue-600 text-white px-2 sm:px-3 py-1 rounded hover:bg-blue-700 flex items-center gap-1 text-xs sm:text-sm"
          >
            <Edit3 className="w-3 h-3 sm:w-4 sm:h-4" /> Edit
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onUpload();
            }}
            className="bg-yellow-600 text-white px-2 sm:px-3 py-1 rounded hover:bg-yellow-700 flex items-center gap-1 text-xs sm:text-sm"
          >
            <Upload className="w-3 h-3 sm:w-4 sm:h-4" /> Upload
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            className="bg-red-600 text-white px-2 sm:px-3 py-1 rounded hover:bg-red-700 flex items-center gap-1 text-xs sm:text-sm"
          >
            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default VenueCard;
