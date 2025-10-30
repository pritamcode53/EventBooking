import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import Home from "./components/Home/Home";
import AllVenues from "./components/AllVenues";
import BlogSection from "./components/BlogSection";
import DashboardHeader from "./components/DashboardHeader";
import StepsToBook from "./components/StepsToBook";
import TopRatedVenues from "./components/TopRatedVenues";
import Footer from "./components/Footer";
import Landing from "./components/Landing";
function App() {
  const location = useLocation();
  const isDashboardRoute =
    location.pathname.startsWith("/dashboard") ||
    location.pathname.startsWith("/venues");
  return (
    <div className="min-h-screen bg-gray-100">
      {/* <Header /> */}
      {isDashboardRoute ? <DashboardHeader /> : <Header />}
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Landing />
              <Home />
              {/* <BlogSection /> */}
              <StepsToBook />
              <TopRatedVenues/>
              <Footer />
              
            </>
          }
        />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/venues" element={<AllVenues />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default App;
