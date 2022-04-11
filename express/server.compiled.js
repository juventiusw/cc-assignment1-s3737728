"use strict";

// server/index.js
var express = require("express");

var cors = require("cors");

var PORT = process.env.PORT || 4000;
var app = express(); // Parse requests of content-type - application/json.

app.use(express.json()); // Add CORS support.

app.use(cors());
app.get('/', function (req, res) {
  res.send('flowers smell nice');
});
app.get("/api", cors({
  origin: 'https://dwa90t5ii9evy.cloudfront.net/'
}), function (req, res) {
  res.json({
    message: "Hello from server!"
  });
});
app.listen(PORT, function () {
  console.log("Server listening at port ".concat(PORT));
});
