import React from "react";
import "./Header.css";
import { FaUserCircle } from "react-icons/fa";

const Header = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  return (
    <header className="app-header">
      <h1>Engineer Dashboard</h1>
      <div className="user-profile">
        <FaUserCircle size={28} />
        <span>{currentUser?.email}</span>
      </div>
    </header>
  );
};

export default Header;
