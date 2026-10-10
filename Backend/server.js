require('dotenv').config(); // Must be first — loads env vars before any other module

const dns = require('dns');

const app = require("./src/app");
const connectDB = require("./src/config/database");


dns.setServers([
    '8.8.8.8',
    '1.1.1.1'
]);

connectDB();

// Test: generate interview report and print JSON output


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});