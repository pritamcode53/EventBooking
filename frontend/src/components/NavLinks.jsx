import React from "react";

const NavLinks = ({ navigate, setMenuOpen }) => {
  const handleNav = (path) => {
    navigate(path);
    if (setMenuOpen) setMenuOpen(false);
  };

  return (
    <nav className="flex flex-col md:flex-row items-center gap-6">
      <button onClick={() => handleNav("/")} className="hover:text-green-600 cursor-pointer transition">
        Home
      </button>
      <button onClick={() => handleNav("#howToBook")} className="hover:text-green-600 cursor-pointer transition">
        How to Book
      </button>
      <button onClick={() => handleNav("/venues")} className="hover:text-green-600  cursor-pointer transition">
        Venues
      </button>
    </nav>
  );
};

export default NavLinks;
