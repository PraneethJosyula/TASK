// src/components/TaskForm.js
import React, { useState, useEffect } from 'react';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import api from '../api';

const TaskForm = ({ onTaskComplete }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [person, setPerson] = useState('');
  const [taskId, setTaskId] = useState(null);
  const [status, setStatus] = useState('');
  const [polling, setPolling] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Append a default time for date parsing
      const isoStart = startDate + "T00:00:00";
      const isoEnd = endDate + "T00:00:00";
      const response = await api.post('/tasks/', {
        start_date: isoStart,
        end_date: isoEnd,
      });
      setTaskId(response.data.id);
      setStatus(response.data.status);
      setPolling(true);
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  useEffect(() => {
    let interval;
    if (polling && taskId) {
      interval = setInterval(async () => {
        try {
          const res = await api.get(`/tasks/${taskId}`);
          setStatus(res.data.status);
          if (res.data.status === 'completed') {
            setPolling(false);
            clearInterval(interval);
            onTaskComplete(taskId);
          }
        } catch (error) {
          console.error("Error fetching task status:", error);
        }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [polling, taskId, onTaskComplete]);

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Create a New Task
      </Typography>
      <TextField
        label="Start Date"
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        InputLabelProps={{ shrink: true }}
        sx={{ mr: 2, mb: 2 }}
        required
      />
      <TextField
        label="End Date"
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        InputLabelProps={{ shrink: true }}
        sx={{ mr: 2, mb: 2 }}
        required
      />
      <FormControl sx={{ minWidth: 120, mr: 2, mb: 2 }}>
        <InputLabel>Person (for filtering later)</InputLabel>
        <Select
          value={person}
          label="Person (for filtering later)"
          onChange={(e) => setPerson(e.target.value)}
        >
          <MenuItem value=""><em>All</em></MenuItem>
          <MenuItem value="Person X">Person X</MenuItem>
          <MenuItem value="Person Y">Person Y</MenuItem>
        </Select>
      </FormControl>
      <Box>
        <Button variant="contained" type="submit">
          Create Task
        </Button>
      </Box>
      {status && (
        <Typography variant="body1" sx={{ mt: 2 }}>
          Task Status: {status}
        </Typography>
      )}
    </Box>
  );
};

export default TaskForm;