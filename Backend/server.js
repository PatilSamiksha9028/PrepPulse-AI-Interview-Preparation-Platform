require('dotenv').config(); // Must be first — loads env vars before any other module

const dns = require('dns');

const app = require("./src/app");
const connectDB = require("./src/config/database");


dns.setServers([
    '8.8.8.8',
    '1.1.1.1'
]);

const path = require('path');

// 1. Serve static files from Frontend build output
// Note: If using Vite, output folder is 'dist'. If using Create React App, use 'build'.
app.use(express.static(path.join(__dirname, '../Frontend/dist')));

// 2. Fallback to index.html for React SPA client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../Frontend/dist/index.html'));
});

connectDB();

// Test: generate interview report and print JSON output


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});