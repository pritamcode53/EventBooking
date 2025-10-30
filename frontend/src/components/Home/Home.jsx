import React, { useEffect, useState } from "react";
import axios from "axios";
import { GET_ALL_VENUES, GET_LOCATIONS_BASED_VENUES } from "../../api/apiConstant";
import HeaderSection from "./HeaderSection";
import FilterPanel from "./FilterPanel";
import VenueGrid from "./VenueGrid";

const Home = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [locationOptions, setLocationOptions] = useState([]);
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
        const res = await axios.get(GET_LOCATIONS_BASED_VENUES);
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
      return current.includes(value)
        ? { ...prev, [category]: current.filter(v => v !== value) }
        : { ...prev, [category]: [...current, value] };
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

  return (
    <div className="relative pt-24 px-6 pb-10 min-h-screen bg-[radial-gradient(circle_at_center,_#d9f99d_0%,_#ffffff_100%)]">
      <HeaderSection
        isFilterOpen={isFilterOpen}
        toggleFilter={() => setIsFilterOpen(!isFilterOpen)}
      />

      <FilterPanel
        isFilterOpen={isFilterOpen}
        selectedFilters={selectedFilters}
        handleCheckboxChange={handleCheckboxChange}
        locationOptions={locationOptions}
        applyFilters={applyFilters}
        resetFilters={resetFilters}
      />

      {loading ? (
        <div className="text-center">Loading venues...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : venues.length > 0 ? (
        <VenueGrid venues={venues} firstRowCount={getFirstRowCount()} />
      ) : (
        <div className="text-center text-gray-500">No venues available</div>
      )}
    </div>
  );
};

export default Home;
