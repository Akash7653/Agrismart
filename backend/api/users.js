import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDatabase } from '../db-client.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-key-change-me';

// Sample users for testing
const sampleUsers = [
  {
    name: 'Ramesh Kumar',
    email: 'ramesh.kumar@agrismart.com',
    phone: '+919876543201',
    country: 'India',
    language: 'hi',
    joinDate: new Date('2023-01-15'),
    isVerified: true,
    password: 'password123'
  },
  {
    name: 'Priya Patel',
    email: 'priya.patel@agrismart.com',
    phone: '+919876543202',
    country: 'India',
    language: 'gu',
    joinDate: new Date('2023-02-20'),
    isVerified: true,
    password: 'password123'
  },
  {
    name: 'Amit Singh',
    email: 'amit.singh@agrismart.com',
    phone: '+919876543203',
    country: 'India',
    language: 'pa',
    joinDate: new Date('2023-03-10'),
    isVerified: true,
    password: 'password123'
  },
  {
    name: 'Sunita Devi',
    email: 'sunita.devi@agrismart.com',
    phone: '+919876543204',
    country: 'India',
    language: 'hi',
    joinDate: new Date('2023-04-05'),
    isVerified: true,
    password: 'password123'
  },
  {
    name: 'Rahul Sharma',
    email: 'rahul.sharma@agrismart.com',
    phone: '+919876543205',
    country: 'India',
    language: 'en',
    joinDate: new Date('2023-05-12'),
    isVerified: true,
    password: 'password123'
  }
];

// Initialize sample users
async function initializeUsers() {
  try {
    const database = await getDatabase();
    const usersCollection = database.collection('users');
    
    // Check if users already exist
    const existingUsers = await usersCollection.countDocuments();
    
    if (existingUsers === 0) {
      console.log('Initializing sample users...');
      
      for (const user of sampleUsers) {
        // Hash password
        const hashedPassword = await bcrypt.hash(user.password, 10);
        
        // Insert user
        await usersCollection.insertOne({
          name: user.name,
          email: user.email,
          phone: user.phone,
          country: user.country,
          language: user.language,
          joinDate: user.joinDate,
          isVerified: user.isVerified,
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
      
      console.log(`Successfully created ${sampleUsers.length} sample users`);
    }
  } catch (error) {
    console.error('Error initializing users:', error);
  }
}

// GET all users
router.get('/', async (req, res) => {
  try {
    await client.connect();
    const database = client.db('agrismart');
    const users = await database.collection('users').find({}).toArray();
    
    // Remove password field from response
    const usersWithoutPassword = users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    
    res.json({
      success: true,
      data: usersWithoutPassword
    });
    
    await client.close();
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users'
    });
  }
});

// POST register user
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, country, language, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required'
      });
    }
    
    const database = await getDatabase();
    const usersCollection = database.collection('users');
    
    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user
    const newUser = {
      name,
      email,
      phone: phone || '+910000000000',
      country: country || 'India',
      language: language || 'en',
      joinDate: new Date(),
      isVerified: true,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await usersCollection.insertOne(newUser);
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: result.insertedId, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '30d' }
    );
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      data: {
        id: result.insertedId,
        name: newUser.name,
        email: newUser.email,
        country: newUser.country,
        language: newUser.language
      }
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering user'
    });
  }
});

// POST login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }
    
    const database = await getDatabase();
    const usersCollection = database.collection('users');
    
    // Find user
    const user = await usersCollection.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    
    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '30d' }
    );
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      success: true,
      message: 'Login successful',
      token,
      data: userWithoutPassword
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging in'
    });
  }
});

// GET user by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await client.connect();
    const database = client.db('agrismart');
    const user = await database.collection('users').findOne({ _id: new require('mongodb').ObjectId(id) });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    
    res.json({
      success: true,
      data: userWithoutPassword
    });
    
    await client.close();
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user'
    });
  }
});

// Initialize users on module load
initializeUsers();

export default router;
