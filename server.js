const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Security headers
app.use(helmet());

// Enable CORS
app.use(cors());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/api', require('./routes/api'));

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('New client connected');
  
  socket.on('simulation-parameters', (data) => {
    // Process simulation parameters and emit results
    const results = processSimulation(data);
    io.emit('simulation-results', results);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Default route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Process simulation parameters
function processSimulation(data) {
  // This will be implemented with our ML/DL models
  const { dimensions, projection, simulationFactor } = data;
  
  // Generate simulation results based on parameters
  const results = {
    processed: true,
    dimensions: dimensions,
    projection: projection,
    simulationFactor: simulationFactor,
    timestamp: new Date().toISOString(),
    // More fields will be added as we implement the ML models
  };
  
  return results;
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});