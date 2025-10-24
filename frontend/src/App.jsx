import React from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify"; // <-- import added
import "react-toastify/dist/ReactToastify.css"; // <-- also import CSS
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import Home from "./components/Home";
import AllVenues from "./components/AllVenues";
import BlogSection from "./components/BlogSection";
function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Home />} />
        <Route path="/venues" element={<AllVenues />} />
      </Routes>
      <BlogSection/>

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
