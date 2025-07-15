// Basic Express server setup for DRDO Prototype
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import supervisorRoutes from './routes/supervisor.js';

const app = express();

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
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/supervisor', supervisorRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Prototype server running on port ${PORT}`);
  console.log(`CORS enabled for frontend: http://localhost:5173`);
});