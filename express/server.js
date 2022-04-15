// server.js
const express = require("express");
const cors = require('cors');
const serverless = require('serverless-http');

const app = express();

// Parse requests of content-type - application/json.
app.use(express.json());

// Add CORS support.
app.use(cors());

app.get('/', (req, res) => {
    res.send('flowers smell nice!');
});

app.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
});

//Add routes
require('./routes/user.routes')(express, app);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server listening at port ${PORT}`);
});

module.exports.handler = serverless(app);