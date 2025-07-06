import React from "react";
import { Link } from "react-router-dom";
import "../css/Navbar.css"; // Assuming you have a CSS file for styling

function NavBar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Movie App</Link>
      </div>
      <div className="navbar-links">
        <Link to="/" className="nav-link">Movie App</Link>
        <Link to="/favourites" className="nav-link">Favourites</Link>
      </div>
    </nav>
  );
}

export default NavBar;
