var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var swaggerDocs = require("./swagger");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// 🔹 Serve Static Files
app.use(express.static(path.join(__dirname, "public")));

// 🔹 Default Route ko `index.html` par redirect karo
// 🔹 Routes
app.use("/users", usersRouter);

// 🔹 Swagger Init Karo
const PORT = process.env.PORT || 3000;
swaggerDocs(app, PORT);

module.exports = app;
