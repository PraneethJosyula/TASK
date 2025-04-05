// src/components/DashboardLayout.js
import React from 'react';
import { AppBar, Box, CssBaseline, Drawer, Toolbar, Typography, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Home, BarChart, History, Person } from '@mui/icons-material';
import { NavLink } from 'react-router-dom';

const drawerWidth = 240;
const menuItems = [
  { text: 'Home', icon: <Home />, path: '/' },
  { text: 'Analytics', icon: <BarChart />, path: '/analytics' },
  { text: 'Task History', icon: <History />, path: '/tasks' },
  { text: 'Profile', icon: <Person />, path: '/profile' },
];

const DashboardLayout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      {/* Top AppBar */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Nutritionist Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      {/* Sidebar Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {menuItems.map((item) => (
              <ListItem
                button
                key={item.text}
                component={NavLink}
                to={item.path}
                style={({ isActive }) => ({
                  backgroundColor: isActive ? '#e0e0e0' : 'transparent',
                })}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      {/* Main content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayout;