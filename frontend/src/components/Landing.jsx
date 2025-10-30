import React from "react";
import { motion } from "framer-motion";
import Counter from "./Counter"; // ✅ import fixed Counter component

const Landing = () => {
  return (
    <div className="relative min-h-screen w-full bg-[radial-gradient(circle_at_center,_#d9f99d_0%,_#ffffff_100%)] overflow-hidden flex flex-col items-center justify-center text-center px-4">
      {/* 🌕 Floating Glass Balls */}
      <motion.div
        className="absolute w-40 h-40 bg-[rgba(255,255,255,0.5)] backdrop-blur-3xl rounded-full shadow-2xl"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), rgba(255,255,255,0.2))",
        }}
        initial={{ x: -250, y: -150, opacity: 0 }}
        animate={{ x: -100, y: 100, opacity: 1 }}
        transition={{ duration: 7, repeat: Infinity, repeatType: "reverse" }}
      />

      <motion.div
        className="absolute w-60 h-60 bg-[rgba(255,255,255,0.45)] backdrop-blur-3xl rounded-full shadow-2xl"
        style={{
          background:
            "radial-gradient(circle at 70% 70%, rgba(255,255,255,0.8), rgba(255,255,255,0.2))",
        }}
        initial={{ x: 350, y: 200, opacity: 0 }}
        animate={{ x: 200, y: -100, opacity: 1 }}
        transition={{ duration: 9, repeat: Infinity, repeatType: "reverse" }}
      />

      <motion.div
        className="absolute w-32 h-32 bg-[rgba(255,255,255,0.6)] backdrop-blur-2xl rounded-full shadow-xl"
        style={{
          background:
            "radial-gradient(circle at 40% 40%, rgba(255,255,255,0.9), rgba(255,255,255,0.3))",
        }}
        initial={{ x: -150, y: 250, opacity: 0 }}
        animate={{ x: 250, y: -120, opacity: 1 }}
        transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
      />

      {/* 🌿 Center Content */}
      <div className="relative z-10 max-w-2xl">
        <h1 className=" mt-10 text-5xl sm:text-6xl font-extrabold text-gray-800 drop-shadow-lg mb-4">
          Welcome to Your{" "}
          <span className="bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
            Perfect Venue
          </span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 mb-8">
          Discover and book your ideal space for every occasion.
        </p>

        {/* 🎯 Get Started Button */}
        <button
          onClick={() => {
            const section = document.getElementById("venues");
            section?.scrollIntoView({ behavior: "smooth" });
          }}
          className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full font-semibold hover:opacity-90 transition-all shadow-md"
        >
          Get Started
        </button>

        {/* 🧮 Live Counter Section */}
       <div className="mt-10 grid grid-cols-3 sm:grid-cols-3 gap-4 sm:gap-10 items-center justify-center">
  <Counter from={0} to={150} label="Projects Completed" />
  <Counter from={0} to={50} label="Trusted by Customers" />
  <Counter from={0} to={9} label="Foreign Clients" />
</div>

      </div>
    </div>
  );
};

export default Landing;
