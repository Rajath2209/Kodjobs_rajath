import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Path to user.json file
const userFilePath = path.join(__dirname, 'src', 'user.json');
const dataFilePath = path.join(__dirname, 'src', 'data.json');

// Helper function to read user data
const readUserData = () => {
  try {
    const data = fs.readFileSync(userFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist or is empty, return empty array
    return [];
  }
};

// Helper function to write user data
const writeUserData = (data) => {
  fs.writeFileSync(userFilePath, JSON.stringify(data, null, 2), 'utf8');
};

// Helper function to calculate age from date of birth
const calculateAge = (dob) => {
  const birthDate = new Date(dob);
  const today = new Date();
  
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  
  // If birthday hasn't occurred yet this year, subtract 1 from age
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

// Get all users
app.get('/api/users', (req, res) => {
  const users = readUserData();
  // Don't send passwords to the client
  const safeUsers = users.map(({ password, ...user }) => user);
  res.json(safeUsers);
});

// Register new user
app.post('/api/users/register', (req, res) => {
  try {
    const users = readUserData();
    
    // Calculate age from date of birth
    const age = calculateAge(req.body.dob);
    
    const newUser = {
      id: Date.now(),
      ...req.body,
      age: age // Add calculated age
    };

    // Check if username already exists
    const userExists = users.some(user => user.username === newUser.username);
    if (userExists) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    users.push(newUser);
    writeUserData(users);

    // Don't send password back to client
    const { password, ...safeUser } = newUser;
    res.status(201).json(safeUser);
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// Login user
app.post('/api/users/login', (req, res) => {
  try {
    const { username, password } = req.body;
    const users = readUserData();

    const user = users.find(
      user => user.username === username && user.password === password
    );

    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Calculate age if not already present
    if (!user.age && user.dob) {
      user.age = calculateAge(user.dob);
    }

    // Don't send password back to client
    const { password: userPassword, ...safeUser } = user;
    res.json(safeUser);
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Failed to log in' });
  }
});

// Update existing users with age
app.get('/api/users/update-ages', (req, res) => {
  try {
    const users = readUserData();
    let updatedCount = 0;
    
    // Update each user's age based on their DOB
    users.forEach(user => {
      if (user.dob && !user.age) {
        user.age = calculateAge(user.dob);
        updatedCount++;
      }
    });
    
    // Save the updated users
    writeUserData(users);
    
    res.json({ 
      message: `Updated ages for ${updatedCount} users`,
      usersCount: users.length
    });
  } catch (error) {
    console.error('Error updating ages:', error);
    res.status(500).json({ error: 'Failed to update ages' });
  }
});

// Get a specific user by ID
app.get('/api/users/:id', (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const users = readUserData();
    
    const user = users.find(user => user.id === userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Don't send password back to client
    const { password, ...safeUser } = user;
    res.json(safeUser);
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Age calculation is enabled for all users`);
}); 