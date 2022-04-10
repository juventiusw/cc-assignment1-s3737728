// server/index.js

const express = require("express");
const cors = require("cors");

const PORT = process.env.PORT || 4000;

const app = express();

// Parse requests of content-type - application/json.
app.use(express.json());

// Add CORS support.
app.use(cors());

app.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});