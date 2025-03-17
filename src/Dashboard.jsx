import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Grid, Card, CardContent, CardActions, 
  Button, Box, CircularProgress, AppBar, Toolbar, IconButton, 
  Avatar, Menu, MenuItem, Divider, TextField, InputAdornment
} from '@mui/material';
import { Search as SearchIcon, LocationOn, Business, Work, Logout } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const open = Boolean(anchorEl);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        // API configuration for LinkedIn Bulk Data Scraper
        const options = {
          method: 'GET',
          url: 'https://linkedin-bulk-data-scraper.p.rapidapi.com/company_employee_companies',
          headers: {
            'X-RapidAPI-Key': '10ecef2d3bmsh4de9d4b4f522b4bp1469ffjsn6d7d3b89572c',
            'X-RapidAPI-Host': 'linkedin-bulk-data-scraper.p.rapidapi.com'
          }
        };

        // In a production environment, we would make the actual API call
        // For this demo, we'll use mock data to avoid API rate limits and costs
        // const response = await axios.request(options);
        // const apiData = response.data;
        
        // Mock data for demonstration
        const mockData = [
          {
            id: 1,
            companyName: 'Tech Innovations Inc.',
            jobTitle: 'Senior Frontend Developer',
            location: 'San Francisco, CA',
            description: 'We are looking for an experienced Frontend Developer with React expertise to join our growing team. You will be responsible for building user interfaces and implementing new features.',
            salary: '$120,000 - $150,000',
            postedDate: '2023-03-10'
          },
          {
            id: 2,
            companyName: 'Global Solutions',
            jobTitle: 'Full Stack Engineer',
            location: 'New York, NY (Remote)',
            description: 'Join our team as a Full Stack Engineer to work on challenging projects using modern technologies. Experience with Node.js and React required.',
            salary: '$110,000 - $140,000',
            postedDate: '2023-03-12'
          },
          {
            id: 3,
            companyName: 'Data Systems Corp',
            jobTitle: 'Data Scientist',
            location: 'Boston, MA',
            description: 'We are seeking a Data Scientist with strong analytical skills to join our data team. You will analyze complex datasets and build predictive models.',
            salary: '$130,000 - $160,000',
            postedDate: '2023-03-08'
          },
          {
            id: 4,
            companyName: 'Creative Digital Agency',
            jobTitle: 'UX/UI Designer',
            location: 'Austin, TX',
            description: 'Looking for a talented UX/UI Designer to create beautiful and functional user interfaces for our clients. Portfolio required.',
            salary: '$90,000 - $120,000',
            postedDate: '2023-03-15'
          },
          {
            id: 5,
            companyName: 'Cloud Services Ltd',
            jobTitle: 'DevOps Engineer',
            location: 'Seattle, WA',
            description: 'Join our DevOps team to build and maintain our cloud infrastructure. Experience with AWS, Docker, and Kubernetes is required.',
            salary: '$125,000 - $155,000',
            postedDate: '2023-03-11'
          },
          {
            id: 6,
            companyName: 'Fintech Solutions',
            jobTitle: 'Backend Developer',
            location: 'Chicago, IL',
            description: 'We are looking for a Backend Developer with experience in building scalable APIs and microservices. Knowledge of Java or Python required.',
            salary: '$115,000 - $145,000',
            postedDate: '2023-03-14'
          }
        ];
        
        // In a real application, we would save the API response to data.json
        try {
          // This is a simulated save - in a real app, this would be a server-side operation
          localStorage.setItem('jobData', JSON.stringify(mockData));
        } catch (err) {
          console.error('Error saving job data:', err);
        }
        
        setJobs(mockData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setError('Failed to fetch job listings. Please try again later.');
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredJobs = jobs.filter(job => 
    job.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <AppBar position="static" sx={{ bgcolor: '#1976d2' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            JobSeeker
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              onClick={handleProfileClick}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={open ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: '#0d47a1' }}>
                {localStorage.getItem('currentUser') 
                  ? JSON.parse(localStorage.getItem('currentUser')).username.charAt(0).toUpperCase() 
                  : 'U'}
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleClose}>
          Profile
        </MenuItem>
        <MenuItem onClick={handleClose}>
          My Applications
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <Logout fontSize="small" sx={{ mr: 1 }} />
          Logout
        </MenuItem>
      </Menu>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
          Job Listings
        </Typography>
        
        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            placeholder="Search for jobs by title, company, or location"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" align="center" sx={{ mt: 4 }}>
            {error}
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {filteredJobs.map((job) => (
              <Grid item xs={12} md={6} lg={4} key={job.id}>
                <Card 
                  elevation={3} 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="div" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                      {job.jobTitle}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Business fontSize="small" sx={{ mr: 1, color: '#757575' }} />
                      <Typography variant="body2" color="text.secondary">
                        {job.companyName}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationOn fontSize="small" sx={{ mr: 1, color: '#757575' }} />
                      <Typography variant="body2" color="text.secondary">
                        {job.location}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Work fontSize="small" sx={{ mr: 1, color: '#757575' }} />
                      <Typography variant="body2" color="text.secondary">
                        {job.salary}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {job.description}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Posted on: {job.postedDate}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button 
                      size="small" 
                      variant="contained" 
                      fullWidth
                      sx={{ 
                        bgcolor: '#1976d2', 
                        '&:hover': { bgcolor: '#0d47a1' } 
                      }}
                    >
                      Apply Now
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </>
  );
};

export default Dashboard; 