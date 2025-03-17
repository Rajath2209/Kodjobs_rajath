import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Fallback login function that uses localStorage if the server is unavailable
  const loginWithLocalStorage = (credentials) => {
    try {
      // Get users from localStorage
      const storedUsers = localStorage.getItem('users');
      if (!storedUsers) {
        // If no users exist, create a demo user
        const demoUser = {
          id: 1,
          username: 'demo',
          password: 'password',
          email: 'demo@example.com',
          dob: '1990-01-01'
        };
        
        localStorage.setItem('users', JSON.stringify([demoUser]));
        
        // Check if the credentials match the demo user
        if (credentials.username === 'demo' && credentials.password === 'password') {
          const { password, ...safeUser } = demoUser;
          localStorage.setItem('currentUser', JSON.stringify(safeUser));
          return true;
        }
        
        return false;
      }
      
      // Find user with matching credentials
      const users = JSON.parse(storedUsers);
      const user = users.find(
        user => user.username === credentials.username && user.password === credentials.password
      );
      
      if (user) {
        // Store user info in localStorage (without password)
        const { password, ...safeUser } = user;
        localStorage.setItem('currentUser', JSON.stringify(safeUser));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error with localStorage login:', error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    // Basic validation
    if (!formData.username || !formData.password) {
      setError('Username and password are required');
      setIsLoading(false);
      return;
    }
    
    try {
      // Try to login with the server
      try {
        // Send login request to our API
        const response = await axios.post('http://localhost:3001/api/users/login', formData);
        
        // Store user info in localStorage for client-side auth
        localStorage.setItem('currentUser', JSON.stringify(response.data));
        
        // Navigate to dashboard
        navigate('/dashboard');
      } catch (serverError) {
        // If server error is due to invalid credentials
        if (serverError.response && serverError.response.status === 401) {
          setError('Invalid username or password');
          setIsLoading(false);
          return;
        }
        
        // If server is unavailable, fall back to localStorage
        console.warn('Server unavailable, falling back to localStorage:', serverError);
        
        // Try localStorage login
        const success = loginWithLocalStorage(formData);
        
        if (success) {
          navigate('/dashboard');
        } else {
          setError('Invalid username or password');
        }
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      console.error('Login error:', error);
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
        autoComplete="current-password"
        value={formData.password}
        onChange={handleChange}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={isLoading}
        sx={{ mt: 3, mb: 2, py: 1.5, bgcolor: '#1e88e5', '&:hover': { bgcolor: '#1565c0' } }}
      >
        {isLoading ? 'Logging In...' : 'Log In'}
      </Button>
    </Box>
  );
};

export default Login; 