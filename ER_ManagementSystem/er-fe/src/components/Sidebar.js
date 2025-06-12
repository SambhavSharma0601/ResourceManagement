import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <aside className="app-sidebar">
      <nav>
        <ul>
          <li><Link to="/">Dashboard</Link></li>
          <li><Link to="/manager-stats">View Stats</Link></li>
          <li><button onClick={() => {
            localStorage.clear();
            window.location.href = "/";
          }}>Logout</button></li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
