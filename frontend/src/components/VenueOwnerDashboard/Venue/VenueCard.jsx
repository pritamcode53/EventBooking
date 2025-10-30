import React, { useState, useRef, useEffect } from "react";
import {
  Edit3,
  Upload,
  DollarSign,
  Trash2,
  MoreHorizontal,
  XCircle,
} from "lucide-react";
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const menuRef = useRef(null);

  const imageUrl = images.length > 0 ? `${IMAGE_BASE_URL}${images[0]}` : null;

  const handleDeleteConfirm = async () => {
    setLoading(true);
    try {
      await axios.delete(DELETE_VENUE(venue.venueId), { withCredentials: true });
      onDelete(); // ✅ notify parent
      setShowDeleteModal(false);
    } catch (err) {
      console.error("Failed to delete venue:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (action) => {
    setIsMenuOpen(false);
    if (action === "price") onPrice();
    else if (action === "edit") onEdit();
    else if (action === "upload") onUpload();
    else if (action === "delete") setShowDeleteModal(true);
  };

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
    <>
      {/* ✅ Venue Row */}
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

        {/* ✅ Dropdown Menu */}
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

      {/* ✅ Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-transparent bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-96 relative animate-fadeIn">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <XCircle size={20} />
            </button>
            <div className="flex flex-col items-center text-center">
              <Trash2 className="text-red-500 mb-3" size={40} />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Delete Venue
              </h2>
              <p className="text-gray-600 mb-5 text-sm">
                Are you sure you want to delete <b>{venue.name}</b>? This action
                cannot be undone.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={loading}
                  className={`px-5 py-2 rounded-lg text-white transition ${
                    loading
                      ? "bg-red-400 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {loading ? "Deleting..." : "Yes, Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VenueCard;
