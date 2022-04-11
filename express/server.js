// server.js

const express = require("express");
const cors = require('cors');
const path = require("path");

const PORT = process.env.PORT || 4000;

const app = express();

// Parse requests of content-type - application/json.
app.use(express.json());

// Add CORS support.
app.use(cors());

// Tell Express to serve the static files from React
app.use(express.static(path.join(__dirname, 'react', 'build')));

app.get('/', (req, res) => {
    res.send('flowers smell nice');
});

app.get("/api", (req, res) => {
    console.log("hit")
    res.json({ message: "Hello from server!" });
});

app.listen(PORT, () => {
    console.log(`Server listening at port ${PORT}`);
});