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
      <td className="px-4 py-3 text-gray-600 max-w-xs">{venue.description}</td>

      <td className="px-4 py-3">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPrice();
            }}
            className="bg-green-600 text-white px-3 py-1.5 rounded-md hover:bg-green-700 flex items-center gap-1 text-xs transition"
          >
            <DollarSign className="w-3 h-3" /> Price
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 flex items-center gap-1 text-xs transition"
          >
            <Edit3 className="w-3 h-3" /> Edit
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onUpload();
            }}
            className="bg-yellow-600 text-white px-3 py-1.5 rounded-md hover:bg-yellow-700 flex items-center gap-1 text-xs transition"
          >
            <Upload className="w-3 h-3" /> Upload
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            className="bg-red-600 text-white px-3 py-1.5 rounded-md hover:bg-red-700 flex items-center gap-1 text-xs transition"
          >
            <Trash2 className="w-3 h-3" /> Delete
          </button>
        </div>
      </td>
    </tr>
  );
};

export default VenueCard;
