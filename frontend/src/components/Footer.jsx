import React from "react";

const Footer = () => {
  return (
    <footer className="relative text-gray-800 ">
      {/*Radial Gradient Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#d9f99d_0%,_#ffffff_100%)] opacity-90"></div>
{/* style={{
        background: "radial-gradient(circle at center, #e8f5e9 0%, #ffffff 80%)",
      }} */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10 text-center">
        {/* Brand / Logo */}
        <h2 className="text-2xl font-bold text-green-700 mb-3">
          Event<span className="text-lime-500">Book</span>
        </h2>

        {/* Links */}
        <div className="flex justify-center flex-wrap gap-6 text-sm font-medium mb-4">
          <a
            href="/"
            className="hover:text-green-700 transition-all duration-200"
          >
            Home
          </a>
          <a
            href="/venues"
            className="hover:text-green-700 transition-all duration-200"
          >
            Venues
          </a>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-300 w-3/4 mx-auto my-4"></div>

        {/* Copyright */}
        <p className="text-sm text-gray-600">
          © {new Date().getFullYear()}{" "}
          <span className="text-green-700 font-medium">Nature Technologies Product</span>. All
          rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
