import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Alert, FormControl, InputLabel, Select, MenuItem, FormHelperText, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  // Get today's date in YYYY-MM-DD format for the max date attribute
  const today = new Date().toISOString().split('T')[0];
  const navigate = useNavigate();
  
  // Calculate a reasonable minimum date (100 years ago)
  const minDate = new Date();
  minDate.setFullYear(minDate.getFullYear() - 100);
  const minDateStr = minDate.toISOString().split('T')[0];
  
  // Generate year, month, and day options for dropdowns
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
  const months = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ];
  const days = Array.from({ length: 31 }, (_, i) => {
    const day = i + 1;
    return day < 10 ? `0${day}` : `${day}`;
  });
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    dobYear: '',
    dobMonth: '',
    dobDay: '',
    dob: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [calculatedAge, setCalculatedAge] = useState(null);

  // Calculate age whenever DOB changes
  useEffect(() => {
    if (formData.dob) {
      try {
        const birthDate = new Date(formData.dob);
        const today = new Date();
        
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
        
        // If birthday hasn't occurred yet this year, subtract 1 from age
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        
        setCalculatedAge(age);
      } catch (err) {
        setCalculatedAge(null);
      }
    } else {
      setCalculatedAge(null);
    }
  }, [formData.dob]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Update the form data
    const updatedFormData = {
      ...formData,
      [name]: value
    };
    
    // If one of the DOB fields changed, update the combined dob field
    if (name === 'dobYear' || name === 'dobMonth' || name === 'dobDay') {
      const { dobYear, dobMonth, dobDay } = updatedFormData;
      
      // Only set the dob if all parts are selected
      if (dobYear && dobMonth && dobDay) {
        updatedFormData.dob = `${dobYear}-${dobMonth}-${dobDay}`;
      }
    }
    
    setFormData(updatedFormData);
  };

  // Fallback registration function that uses localStorage if the server is unavailable
  const registerWithLocalStorage = (userData) => {
    try {
      // Get existing users from localStorage or initialize with empty array
      const storedUsers = localStorage.getItem('users');
      let users = storedUsers ? JSON.parse(storedUsers) : [];
      
      // Check if username already exists
      const userExists = users.some(user => user.username === userData.username);
      if (userExists) {
        setError('Username already exists');
        return false;
      }
      
      // Calculate age
      const birthDate = new Date(userData.dob);
      const today = new Date();
      
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();
      
      // If birthday hasn't occurred yet this year, subtract 1 from age
      if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      // Add new user with age
      const newUser = {
        id: Date.now(),
        ...userData,
        age: age
      };
      
      users.push(newUser);
      
      // Save updated users to localStorage
      localStorage.setItem('users', JSON.stringify(users));
      
      // Store current user
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      
      return true;
    } catch (error) {
      console.error('Error with localStorage registration:', error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);
    
    // Basic validation
    if (!formData.username || !formData.password || !formData.email || !formData.dob) {
      setError('All fields are required');
      setIsLoading(false);
      return;
    }
    
    // Validate date of birth
    try {
      const dobDate = new Date(formData.dob);
      
      // Check if date is valid
      if (isNaN(dobDate.getTime())) {
        setError('Please enter a valid date of birth');
        setIsLoading(false);
        return;
      }
      
      // Check if date is in the future
      if (dobDate > new Date()) {
        setError('Date of birth cannot be in the future');
        setIsLoading(false);
        return;
      }
      
      // Check if user is at least 13 years old
      if (calculatedAge < 13) {
        setError('You must be at least 13 years old to register');
        setIsLoading(false);
        return;
      }
    } catch (err) {
      setError('Please enter a valid date of birth');
      setIsLoading(false);
      return;
    }
    
    try {
      // Extract only the data we want to send to the server
      const { dobYear, dobMonth, dobDay, ...userData } = formData;
      
      // Try to register with the server
      try {
        // Send registration request to our API
        const response = await axios.post('http://localhost:3001/api/users/register', userData);
        
        // Store user info in localStorage for client-side auth
        localStorage.setItem('currentUser', JSON.stringify(response.data));
        
        setSuccess(`Registration successful! Your age is ${response.data.age}. Redirecting to dashboard...`);
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } catch (serverError) {
        // If server error is due to username already exists
        if (serverError.response && serverError.response.status === 400 && 
            serverError.response.data.error === 'Username already exists') {
          setError('Username already exists');
          setIsLoading(false);
          return;
        }
        
        // If server is unavailable, fall back to localStorage
        console.warn('Server unavailable, falling back to localStorage:', serverError);
        
        // Try localStorage registration
        const success = registerWithLocalStorage(userData);
        
        if (success) {
          setSuccess(`Registration successful! Your age is ${calculatedAge}. Redirecting to dashboard...`);
          
          // Redirect to dashboard after a short delay
          setTimeout(() => {
            navigate('/dashboard');
          }, 2000);
        } else {
          setError('Registration failed. Please try again.');
        }
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}
      
      <TextField
        margin="normal"
        required
        fullWidth
        id="username"
        label="Username"
        name="username"
        autoComplete="username"
        autoFocus
        value={formData.username}
        onChange={handleChange}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
        autoComplete="new-password"
        value={formData.password}
        onChange={handleChange}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="email"
        label="Email Address"
        type="email"
        id="email"
        autoComplete="email"
        value={formData.email}
        onChange={handleChange}
      />
      
      {/* Date of Birth Dropdown Selectors */}
      <Box sx={{ mt: 2, mb: 1 }}>
        <FormHelperText sx={{ mb: 1, ml: 0 }}>Date of Birth (required)</FormHelperText>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <FormControl fullWidth required>
              <InputLabel id="dob-month-label">Month</InputLabel>
              <Select
                labelId="dob-month-label"
                id="dobMonth"
                name="dobMonth"
                value={formData.dobMonth}
                label="Month"
                onChange={handleChange}
              >
                {months.map(month => (
                  <MenuItem key={month.value} value={month.value}>
                    {month.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth required>
              <InputLabel id="dob-day-label">Day</InputLabel>
              <Select
                labelId="dob-day-label"
                id="dobDay"
                name="dobDay"
                value={formData.dobDay}
                label="Day"
                onChange={handleChange}
              >
                {days.map(day => (
                  <MenuItem key={day} value={day}>
                    {day}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth required>
              <InputLabel id="dob-year-label">Year</InputLabel>
              <Select
                labelId="dob-year-label"
                id="dobYear"
                name="dobYear"
                value={formData.dobYear}
                label="Year"
                onChange={handleChange}
              >
                {years.map(year => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        
        {calculatedAge !== null && (
          <Typography 
            variant="body2" 
            sx={{ mt: 1, color: calculatedAge < 13 ? 'error.main' : 'text.secondary' }}
          >
            {calculatedAge < 13 
              ? `You must be at least 13 years old to register (current age: ${calculatedAge})`
              : `Your age: ${calculatedAge} years`
            }
          </Typography>
        )}
      </Box>
      
      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={isLoading}
        sx={{ mt: 3, mb: 2, py: 1.5, bgcolor: '#4caf50', '&:hover': { bgcolor: '#388e3c' } }}
      >
        {isLoading ? 'Signing Up...' : 'Sign Up'}
      </Button>
    </Box>
  );
};

export default Register; 