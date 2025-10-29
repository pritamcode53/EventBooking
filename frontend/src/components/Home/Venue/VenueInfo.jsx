import React from "react";

const VenueInfo = ({ venue }) => {
  const getTypeLabel = (type) => {
    switch (type) {
      case "PerHour": return "Per Hour";
      case "PerDay": return "Per Day";
      case "PerEvent": return "Per Event";
      default: return "Unknown";
    }
  };

  return (
    <div className="p-5 flex-1 flex flex-col">
      <h2 className="text-xl font-semibold text-gray-900 mb-1 truncate">{venue.name}</h2>
      <p className="text-gray-500 text-sm mb-2">{venue.location}</p>
      <p className="text-gray-700 text-sm font-medium mb-2">
        Capacity: <span className="text-gray-900 font-semibold">{venue.capacity}</span>
      </p>

      {venue.pricings && venue.pricings.length > 0 ? (
        <div className="text-gray-700 text-sm mb-3 bg-gray-50 p-3 rounded-lg">
          <p className="font-semibold text-gray-800 mb-1">Pricing</p>
          {venue.pricings.map((p) => (
            <p key={p.type} className="flex justify-between">
              <span>{getTypeLabel(p.type)}</span>
              <span className="font-semibold text-green-700">
                ₹{p.price.toLocaleString()}
              </span>
            </p>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-sm mb-2 italic">No pricing available</p>
      )}
    </div>
  );
};

export default VenueInfo;
