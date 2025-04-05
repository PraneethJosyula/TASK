// src/pages/Profile.js
import React from 'react';
import { Container, Typography } from '@mui/material';

const Profile = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Profile
      </Typography>
      <Typography variant="body1">
        Profile details will be shown here.
      </Typography>
    </Container>
  );
};

export default Profile;