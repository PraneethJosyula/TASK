// src/pages/Home.js
import React from 'react';
import { Typography, Box } from '@mui/material';

const Home = () => {
  return (
    <Box sx={{ mt: 4, px: 2 }}>
      <Typography variant="h4" gutterBottom>
        Nutritionist Dashboard
      </Typography>
      <Typography variant="body1" gutterBottom>
        Welcome to the Nutritionist Dashboard! This application allows you to monitor and analyze food macro data and blood glucose levels for different individuals. Create tasks to retrieve and process data, then view interactive charts that display trends over time. Use the Analytics section to view detailed graphs based on the results of a specific task.
      </Typography>
      {/* Example Tasks Section */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Example Tasks:
        </Typography>
        <Box component="div" sx={{ pl: 2 }}>
          <ul>
            <li>
              <strong>January 2024 Overview (Both Persons):</strong> Start Date: 2024-01-01, End Date: 2024-01-31, Person: All.
            </li>
            <li>
              <strong>Spring Analysis for Person X:</strong> Start Date: 2024-03-01, End Date: 2024-05-31, Person: Person X.
            </li>
            <li>
              <strong>Summer Trends for Person Y:</strong> Start Date: 2024-06-01, End Date: 2024-08-31, Person: Person Y.
            </li>
            <li>
              <strong>Fall Comparison (Both Persons):</strong> Start Date: 2024-09-01, End Date: 2024-11-30, Person: All.
            </li>
            <li>
              <strong>Extended Analysis for Person Y into 2025:</strong> Start Date: 2024-12-01, End Date: 2025-05-14, Person: Person Y.
            </li>
          </ul>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;