import React from "react";
import { Filter, X } from "lucide-react";

const HeaderSection = ({ isFilterOpen, toggleFilter }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
      <h1 className="text-3xl font-bold text-gray-800">Explore Venues</h1>
      <button
        onClick={toggleFilter}
        className="flex items-center justify-center gap-2 bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition font-semibold shadow-md w-full sm:w-auto"
      >
        {isFilterOpen ? (
          <>
            <X className="w-5 h-5" />
            <span>Hide Filters</span>
          </>
        ) : (
          <>
            <Filter className="w-5 h-5" />
            <span>Filters</span>
          </>
        )}
      </button>
    </div>
  );
};

export default HeaderSection;
