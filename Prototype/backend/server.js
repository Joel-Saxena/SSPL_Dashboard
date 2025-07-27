// Basic Express server setup for DRDO Prototype
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import supervisorRoutes from './routes/supervisor.js';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import fs from 'fs';

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

// // Serve Vite build output at /frontend
// const __dirname = path.dirname(fileURLToPath(import.meta.url));
// const viteDistPath = path.resolve(__dirname, './frontend'); 

// // Serve static assets at /assets
// app.use('/assets', express.static(path.join(viteDistPath, 'assets')));

// // Serve Vite build output at /frontend
// app.use('/frontend', express.static(viteDistPath));

// // Serve static files from build output at root
// app.use(express.static(viteDistPath));

// // SPA fallback for React Router
// app.get(/^\/frontend\/.*/, (req, res, next) => {
//   const filePath = path.join(viteDistPath, req.path.replace('/frontend', ''));
//   if (fs.existsSync(filePath) && fs.lstatSync(filePath).isFile()) {
//     res.sendFile(filePath);
//   } else {
//     res.sendFile(path.join(viteDistPath, 'index.html'));
//   }
// });

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Prototype server running on port ${PORT}`);
  console.log(`CORS enabled for frontend: http://localhost:5173`);
});