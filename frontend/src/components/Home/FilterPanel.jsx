import React from "react";

const FilterPanel = ({
  isFilterOpen,
  selectedFilters,
  handleCheckboxChange,
  locationOptions,
  applyFilters,
  resetFilters,
}) => {
  if (!isFilterOpen) return null;

  return (
    <div className="bg-white shadow p-4 mb-6 rounded grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Type */}
      <div>
        <h3 className="font-semibold mb-2">Type</h3>
        {[{ label: "Per Hour", value: "0" }, { label: "Per Day", value: "1" }, { label: "Per Event", value: "2" }]
          .map(type => (
            <label key={type.value} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedFilters.Type.includes(type.value)}
                onChange={() => handleCheckboxChange("Type", type.value)}
              />
              {type.label}
            </label>
          ))}
      </div>

      {/* Price */}
      <div>
        <h3 className="font-semibold mb-2">Price</h3>
        {[{ label: "0 - 500", value: "0-500" }, { label: "501 - 1000", value: "501-1000" },
          { label: "1001 - 5000", value: "1001-5000" }, { label: "5000+", value: "5001-100000" }]
          .map(range => (
            <label key={range.value} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedFilters.PriceRange.includes(range.value)}
                onChange={() => handleCheckboxChange("PriceRange", range.value)}
              />
              {range.label}
            </label>
          ))}
      </div>

      {/* Location */}
      <div>
        <h3 className="font-semibold mb-2">Location</h3>
        {locationOptions.map(loc => (
          <label key={loc} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedFilters.Location.includes(loc)}
              onChange={() => handleCheckboxChange("Location", loc)}
            />
            {loc}
          </label>
        ))}
      </div>

      {/* Capacity */}
      <div>
        <h3 className="font-semibold mb-2">Capacity</h3>
        {["0-10", "11-50", "51-100", "100+"].map(cap => (
          <label key={cap} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedFilters.Capacity.includes(cap)}
              onChange={() => handleCheckboxChange("Capacity", cap)}
            />
            {cap}
          </label>
        ))}
      </div>

      {/* Buttons */}
      <div className="col-span-full flex gap-2 mt-4">
        <button onClick={applyFilters} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          Apply
        </button>
        <button onClick={resetFilters} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">
          Reset
        </button>
      </div>
    </div>
  );
};

export default FilterPanel;
