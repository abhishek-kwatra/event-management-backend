// server.js

import express from 'express';
import cors  from 'cors';
import bodyParser  from 'body-parser';
import dotenv  from 'dotenv';
import loginroutes  from './routes/user.js'

dotenv.config();

// Initialize Express app
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Sample Routes
app.get('/', (req, res) => {
  res.send('Event Management API is running');
});

// USERS Login
app.use('/api', loginroutes);

// EVENTS
// app.use('/api/events', require('./routes/events'));

// REGISTRATIONS
// app.use('/api/registrations', require('./routes/registrations'));

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
