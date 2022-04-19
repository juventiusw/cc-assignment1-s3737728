"use strict";

// server.js
var express = require("express");

var cors = require('cors');

var serverless = require('serverless-http');

var app = express(); // Parse requests of content-type - application/json.

app.use(express.json()); // Add CORS support.

app.use(cors());
app.get('/', function (req, res) {
  res.send('flowers smell nice!');
});
app.get("/api", function (req, res) {
  res.json({
    message: "Hello from server!"
  });
}); //Add routes

require('./routes/user.routes')(express, app);

require("./routes/post.routes.js")(express, app);

require("./routes/reply.routes.js")(express, app);

require("./routes/image.routes.js")(express, app);

var PORT = process.env.PORT || 4000;
app.listen(PORT, function () {
  console.log("Server listening at port ".concat(PORT));
});
module.exports.handler = serverless(app);
