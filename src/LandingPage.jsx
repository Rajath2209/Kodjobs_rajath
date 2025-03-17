import React, { useState } from 'react';
import { 
  Container, Grid, Typography, Box, Tabs, Tab, Paper, 
  useMediaQuery, useTheme 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Login from './login/Login';
import Register from './register/Register';

// Import job search image
const jobSearchImage = 'https://img.freepik.com/free-vector/recruitment-concept-illustration_114360-6766.jpg';

const LandingPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="xl" sx={{ height: '100vh', py: 4 }}>
      <Grid container sx={{ height: '100%' }}>
        {/* Left side - Image (70% on desktop, 100% on mobile) */}
        {!isMobile && (
          <Grid 
            item 
            xs={12} 
            md={8} 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              p: 4
            }}
          >
            <Box
              component="img"
              src={jobSearchImage}
              alt="Job Search"
              sx={{
                maxWidth: '100%',
                maxHeight: '70vh',
                objectFit: 'contain',
                mb: 4
              }}
            />
            <Typography 
              variant="h3" 
              component="h1" 
              align="center" 
              gutterBottom
              sx={{ 
                fontWeight: 'bold',
                color: '#1976d2'
              }}
            >
              Find Your Dream Job Today
            </Typography>
            <Typography 
              variant="h6" 
              align="center" 
              color="text.secondary"
              sx={{ maxWidth: '80%' }}
            >
              Connect with top employers and discover opportunities that match your skills and career goals.
            </Typography>
          </Grid>
        )}

        {/* Right side - Login/Register Forms (30% on desktop, 100% on mobile) */}
        <Grid 
          item 
          xs={12} 
          md={4} 
          sx={{ 
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            p: 2
          }}
        >
          <Paper 
            elevation={6} 
            sx={{ 
              p: 3,
              borderRadius: 2,
              maxWidth: isMobile ? '100%' : '400px',
              mx: 'auto'
            }}
          >
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              variant="fullWidth" 
              sx={{ mb: 3 }}
            >
              <Tab label="Login" />
              <Tab label="Sign Up" />
            </Tabs>

            {tabValue === 0 ? (
              <Login />
            ) : (
              <Register />
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default LandingPage; 