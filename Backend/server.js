require('dotenv').config(); // Must be first — loads env vars before any other module

const dns = require('dns');

const app = require("./src/app");
const connectDB = require("./src/config/database");


dns.setServers([
    '8.8.8.8',
    '1.1.1.1'
]);

const express = require('express');
const path = require('path');

// 1. Serve static files from Frontend build output
app.use(express.static(path.join(__dirname, '../Frontend/dist')));

// 2. Fallback to index.html for React SPA client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../Frontend/dist/index.html'));
});

connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});