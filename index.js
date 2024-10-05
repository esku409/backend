// server.js
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors'); // Import the CORS middleware
const app = express();
app.use(cors());

// Proxy configuration
const proxyOptions = {
  target: 'https://api.deezer.com', // Target API to proxy requests to
  changeOrigin: true, // Needed for virtual hosted sites
  pathRewrite: {
    '^/api': '', // Remove /api prefix when sending requests to the target
  },
  onProxyReq(proxyReq, req, res) {
    // Modify headers if needed
    // proxyReq.setHeader('Authorization', 'Bearer someToken');
  }
};

// Set up the proxy middleware
app.use('/api', createProxyMiddleware(proxyOptions));

// Example route to check if server is running
app.get('/', (req, res) => {
  res.send('Reverse Proxy Server is Running');
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Proxy server running at http://localhost:${PORT}`);
});
