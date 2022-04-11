// server/server.js

const express = require("express");
const cors = require("cors");
const path = require("path");

const PORT = process.env.PORT || 4000;

const app = express();

// Tell Express to serve the static files from React
app.use(express.static(path.join(__dirname, 'react', 'build')))

// Add CORS support.
app.use(cors());

app.get('/', (req, res) => {
    res.send('flowers smell nice');
});

app.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
});

app.listen(PORT, () => {
    console.log(`Server listening at port ${PORT}`);
});