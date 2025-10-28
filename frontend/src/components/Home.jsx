import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import VenueCard from "./VenueCard";
import { GET_ALL_VENUES } from "../api/apiConstant";
import { Filter, X } from "lucide-react";

const Home = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [locationOptions, setLocationOptions] = useState([]);
  const navigate = useNavigate();

  const [selectedFilters, setSelectedFilters] = useState({
    Type: [],
    PriceRange: [],
    Location: [],
    Capacity: [],
  });

  const fetchVenues = async (filters = {}) => {
    try {
      setLoading(true);

      const params = {
        MinPrice: filters.PriceRange?.length
          ? Math.min(...filters.PriceRange.map(r => parseInt(r.split("-")[0])))
          : undefined,
        MaxPrice: filters.PriceRange?.length
          ? Math.max(...filters.PriceRange.map(r => parseInt(r.split("-")[1])))
          : undefined,
        Type: filters.Type?.length ? filters.Type.join(",") : undefined,
        Location: filters.Location?.length ? filters.Location.join(",") : undefined,
        MinCapacity: filters.Capacity?.length
          ? Math.min(...filters.Capacity.map(c => parseInt(c.split("-")[0])))
          : undefined,
        MaxCapacity: filters.Capacity?.length
          ? Math.max(...filters.Capacity.map(c => parseInt(c.split("-")[1])))
          : undefined,
      };

      const res = await axios.get(GET_ALL_VENUES, { params });
      setVenues(res.data.data || []);
    } catch (err) {
      setError("Failed to load venues");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await axios.get("http://localhost:5232/api/home/locations");
        setLocationOptions(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch locations", err);
      }
    };

    fetchLocations();
    fetchVenues();
  }, []);

  const handleCheckboxChange = (category, value) => {
    setSelectedFilters(prev => {
      const current = prev[category] || [];
      if (current.includes(value)) {
        return { ...prev, [category]: current.filter(v => v !== value) };
      } else {
        return { ...prev, [category]: [...current, value] };
      }
    });
  };

  const applyFilters = () => {
    fetchVenues(selectedFilters);
    setIsFilterOpen(false);
  };

  const resetFilters = () => {
    setSelectedFilters({ Type: [], PriceRange: [], Location: [], Capacity: [] });
    fetchVenues();
  };

  const getFirstRowCount = () => {
    if (window.innerWidth >= 1280) return 4;
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 768) return 2;
    return 1;
  };

  const firstRowCount = getFirstRowCount();
  const displayedVenues = venues.slice(0, firstRowCount);

  return (
   <div className="relative pt-24 px-6 pb-10 min-h-screen absolute inset-0 bg-[radial-gradient(circle_at_center,_#d9f99d_0%,_#ffffff_100%)]">
      {/* 🌿 Radial Gradient Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#d9f99d_0%,_#ffffff_100%)] -z-10"></div>

      {/* Header + Filter Toggle */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <h1 className="text-3xl font-bold text-gray-800">Explore Venues</h1>
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
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

      {/* Filter Panel */}
      {isFilterOpen && (
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
            {[{ label: "0 - 500", value: "0-500" }, { label: "501 - 1000", value: "501-1000" }, { label: "1001 - 5000", value: "1001-5000" }, { label: "5000+", value: "5001-100000" }]
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

          {/* Apply / Reset */}
          <div className="col-span-full flex gap-2 mt-4">
            <button onClick={applyFilters} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
              Apply
            </button>
            <button onClick={resetFilters} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">
              Reset
            </button>
          </div>
        </div>
      )}

      {/* Venues Grid */}
      {loading ? (
        <div className="text-center">Loading venues...</div>
      ) : venues.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedVenues.map(venue => (
              <VenueCard key={venue.venueId} venue={venue} />
            ))}
          </div>

          {/* Explore More Button */}
          {venues.length > firstRowCount && (
            <div className="flex justify-center mt-6">
              <button
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition font-semibold"
                onClick={() => navigate("/venues")}
              >
                Explore More
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center text-gray-500">No venues available</div>
      )}
    </div>
  );
};

export default Home;
