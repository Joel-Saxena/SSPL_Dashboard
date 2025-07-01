// Basic Express server setup for DRDO Prototype
const express = require('express');
const app = express();
const cors = require('cors');

// Configure CORS with specific options
const corsOptions = {
  origin: 'http://localhost:5173',  // Your frontend URL
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,  // Allow cookies/session if needed later
  optionsSuccessStatus: 204  // Legacy browser support
};

app.use(cors(corsOptions));  // Apply CORS with configuration
app.use(express.json());

// Route imports
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/supervisor', require('./routes/supervisor'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Prototype server running on port ${PORT}`);
  console.log(`CORS enabled for frontend: http://localhost:5173`);
});