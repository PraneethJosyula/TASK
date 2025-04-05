// src/components/MetricCard.js
import React from 'react';
import './MetricCard.css';

const MetricCard = ({ title, value, unit }) => {
  return (
    <div className="metric-card">
      <h3>{title}</h3>
      <p>{value} <span>{unit}</span></p>
    </div>
  );
};

export default MetricCard;