// src/pages/Analytics.js
import React, { useState, useEffect, useCallback } from 'react';
import { Container, Box, Typography, Grid, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import api from '../api';
import TaskForm from '../components/TaskForm';
import GlucoseChart from '../components/GlucoseChart';
import MacroChart from '../components/MacroChart';
import GlucoseRangeChart from '../components/GlucoseRangeChart';

const Analytics = () => {
  // Read URL query parameters
  const [searchParams] = useSearchParams();
  // taskId state will be set from the query parameter if it exists
  const [taskId, setTaskId] = useState(null);
  const [data, setData] = useState([]);
  const [personFilter, setPersonFilter] = useState("");

  // On mount, check if a task_id query parameter exists
  useEffect(() => {
    const queryTaskId = searchParams.get('task_id');
    if (queryTaskId) {
      setTaskId(parseInt(queryTaskId, 10));
    }
  }, [searchParams]);

  // Fetch data for a specific task ID and optional person filter
  const fetchData = useCallback(() => {
    if (!taskId) return;
    const params = { task_id: taskId };
    if (personFilter) params.person = personFilter;
    api.get('/data', { params })
      .then((response) => setData(response.data))
      .catch((error) => console.error("Error fetching data:", error));
  }, [taskId, personFilter]);

  // Re-fetch data whenever taskId or personFilter changes
  useEffect(() => {
    if (taskId) fetchData();
  }, [taskId, personFilter, fetchData]);

  // Callback for TaskForm when a new task is created
  const handleTaskComplete = (newTaskId) => {
    setTaskId(newTaskId);
    fetchData();
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Analytics
      </Typography>
      <TaskForm onTaskComplete={handleTaskComplete} />

      {/* Filtering Controls */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6">Filter by Person</Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Person</InputLabel>
              <Select
                label="Person"
                value={personFilter}
                onChange={(e) => setPersonFilter(e.target.value)}
              >
                <MenuItem value=""><em>All</em></MenuItem>
                <MenuItem value="Person X">Person X</MenuItem>
                <MenuItem value="Person Y">Person Y</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid xs={12}>
            <Button variant="outlined" onClick={fetchData}>
              Apply Filter
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Charts */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6">Glucose Levels</Typography>
        <GlucoseChart data={data} />
      </Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6">Food Macros</Typography>
        <MacroChart data={data} />
      </Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6">Glucose Range Breakdown</Typography>
        <GlucoseRangeChart data={data} />
      </Box>
    </Container>
  );
};

export default Analytics;