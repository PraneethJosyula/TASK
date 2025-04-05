// src/components/Sidebar.js
import React from 'react';
import './Sidebar.css';
import { FaHome, FaChartLine, FaUser } from 'react-icons/fa';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar__logo">Nutrition Dashboard</div>
      <ul className="sidebar__nav">
        <li><FaHome className="icon"/>Home</li>
        <li><FaChartLine className="icon"/>Analytics</li>
        <li><FaUser className="icon"/>Profile</li>
      </ul>
    </div>
  );
};

export default Sidebar;