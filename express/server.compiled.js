"use strict";

// server/server.js
var express = require("express");

var cors = require("cors");

var path = require("path");

var PORT = process.env.PORT || 4000;
var app = express(); // Tell Express to serve the static files from React

app.use(express["static"](path.join(__dirname, 'react', 'build'))); // Add CORS support.

app.use(cors());
app.get('/', function (req, res) {
  res.send('flowers smell nice');
});
app.get("/api", function (req, res) {
  res.json({
    message: "Hello from server!"
  });
});
app.listen(PORT, function () {
  console.log("Server listening at port ".concat(PORT));
});
