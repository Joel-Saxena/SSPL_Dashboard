// Basic Express server setup for DRDO Prototype
const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

// Route imports
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/supervisor', require('./routes/supervisor'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Prototype server running on port ${PORT}`);
});
