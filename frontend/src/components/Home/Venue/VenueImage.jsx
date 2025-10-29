import React from "react";
import { IMAGE_BASE_URL } from "../../../api/apiConstant";
import { Star } from "lucide-react";

const VenueImage = ({ venue, averageRating }) => (
  <div className="relative">
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

    {averageRating && (
      <div className="absolute top-3 right-3 bg-black/70 text-white flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-semibold shadow-lg">
        <Star size={16} className="text-yellow-400 fill-yellow-400" />
        {averageRating}
      </div>
    )}
  </div>
);

export default VenueImage;
