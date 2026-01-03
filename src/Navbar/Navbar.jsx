
import React, { useState, useEffect } from "react";
import "./Navbar.css";
import { FaBars, FaTimes } from "react-icons/fa";
import { NavLink, Link } from "react-router-dom";
import logo from "../image/logo-travel.svg";
import defaultAvatar from "../image/avatar.png";

export default function Navbar({ loggedInUser, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [menuOpen]);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <Link to="/" className="navbar-place" onClick={closeMenu}>
            {/* <img src={logo} alt="logo" /> */}
            WellGo
          </Link>
    
        </div>

        <div className={`navbar-links ${menuOpen ? "active" : ""}`}>
          {["/wellgo/", "/wellgo/explore", "/wellgo/planner", "/wellgo/map", "/wellgo/reviews"].map((path, index) => (
            <NavLink
              key={index}
              to={path}
              end={path === "/wellgo/"}
              className={({ isActive }) =>
                `navlink-style ${isActive ? "active-link" : ""}`
              }
              onClick={closeMenu}
            >
              {{
                "/wellgo/": "Home",
                "/wellgo/explore": "Explore",
                "/wellgo/planner": "Journey",
                "/wellgo/map": "Map",
                "/wellgo/reviews": "Reviews",
              }[path]}
            </NavLink>
          ))}
        </div>

        <div className="navbar-right profile-login">
          {loggedInUser ? (
            <>
              <NavLink
                to="/wellgo/profile"
                className={({ isActive }) =>
                  `profile-icon ${isActive ? "active-link" : ""}`
                }
                onClick={closeMenu}
              >
                <img
                  className="avatar"
                  src={loggedInUser.avatarUrl || defaultAvatar}
                  alt="avatar"
                />
              </NavLink>
              <button type="button" onClick={onLogout} className="logout-button">
                Logout
              </button>
            </>
          ) : (
            <NavLink
              to="/wellgo/login"
              className={({ isActive }) =>
                `navlink-style ${isActive ? "active-link" : ""}`
              }
              onClick={closeMenu}
            >
              Login
            </NavLink>
          )}
          <div
            className="burger-menu"
            onClick={toggleMenu}
            aria-label="Toggle menu"
            role="button"
            tabIndex={0}
          >
            {menuOpen ? <FaTimes size={25} /> : <FaBars size={25} />}
          </div>
        </div>
      </nav>

      {menuOpen && <div className="overlay" onClick={closeMenu} />}
    </>
  );
}
