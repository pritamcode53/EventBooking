// src/components/Dashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { USER_PROFILE } from "../api/apiConstant";
import AdminDashboard from "./AdminDashboard/AdminDashboard";
import VenueOwnerDashboard from "./VenueOwnerDashboard/VenueOwnerDashboard";
import UserDashboard from "./UserDashboard/UserDashboard";

const Dashboard = () => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(USER_PROFILE, { withCredentials: true });
        setRole(res.data.data.role); // get the role
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  // Conditional rendering based on role
  switch (role) {
    case "Admin":
      return <AdminDashboard />;
    case "VenueOwner":
      return <VenueOwnerDashboard />;
    case "Customer":
      return <UserDashboard />;
    default:
      return <div className="p-6">Unauthorized</div>;
  }
};

export default Dashboard;
