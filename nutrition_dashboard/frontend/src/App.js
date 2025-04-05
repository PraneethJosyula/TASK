// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout';
import Home from './pages/Home';
import Analytics from './pages/Analytics';
import TaskHistory from './pages/TaskHistory';
import Profile from './pages/Profile';

function App() {
  return (
    <BrowserRouter>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/tasks" element={<TaskHistory />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </DashboardLayout>
    </BrowserRouter>
  );
}

export default App;