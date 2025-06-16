// controllers/userController.js

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../models/db.js';



export const registerUser = async (req, res) => {
  const { name, phoneNumber, email, password, role } = req.body;

  try {
    const [existingUsers] = await db.promise().query(
      'SELECT * FROM users WHERE email = ? OR phoneNumber = ?',
      [email, phoneNumber]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({
        message: 'Email or phone number already registered',
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const [insertResult] = await db.promise().query(
      'INSERT INTO users (name, phoneNumber, email, password, role) VALUES (?, ?, ?, ?, ?)',
      [name, phoneNumber, email, hashedPassword, role]
    );

    // Get the newly inserted user ID
    const newUserId = insertResult.insertId;

    // Generate JWT token
    const token = jwt.sign(
      {
        id: newUserId,
        role: role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUserId,
        name,
        phoneNumber,
        email,
        role,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Fetch user from DB
    const [users] = await db.promise().query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = users[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Success response
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
