// src/pages/TaskHistory.js
import React, { useState, useEffect } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableHead, TableRow, Button, Paper } from '@mui/material';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import HistoryIcon from '@mui/icons-material/History';

const TaskHistory = () => {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  const fetchTasks = () => {
    api.get('/tasks/')
      .then(response => setTasks(response.data))
      .catch(error => console.error("Error fetching tasks:", error));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleViewAnalytics = (taskId) => {
    navigate(`/analytics?task_id=${taskId}`);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Task History
      </Typography>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Task ID</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map(task => (
              <TableRow key={task.id}>
                <TableCell>{task.id}</TableCell>
                <TableCell>{new Date(task.created_at).toLocaleString()}</TableCell>
                <TableCell>{task.status}</TableCell>
                <TableCell align="center">
                  <Button variant="contained" startIcon={<HistoryIcon />} onClick={() => handleViewAnalytics(task.id)}>
                    View Analytics
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
};

export default TaskHistory;