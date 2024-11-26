const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
const port = 8000;
require("dotenv").config();

const expressLayouts = require("express-ejs-layouts");

const db = require("./config/mongoose");

//Used for session cookie

const session = require("express-session");

const passport = require("passport");

const passportLocal = require("./config/passport-local-strategy");

const passportJWT = require("./config/passport-jwt-strategy");
// Middleware
app.use(cors());

app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    process.env.FRONTEND_URL || "http://localhost:3000/"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(express.json());

app.use(express.urlencoded());

app.use(cookieParser());

app.use(express.static("./assets"));

app.use(expressLayouts);

app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

//Set up view engine

app.set("view engine", "ejs");

app.set("views", "./views");

app.use(
  session({
    name: "caloriesapp",
    //TODO change the secret before deployment in production mode
    secret: "blahsomething",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 100,
    },
  })
);

require('dotenv').config();
const jwt = require('jsonwebtoken');

const token = jwt.sign({ userId: 'testUser123' }, process.env.JWT_SECRET, { expiresIn: '1h' });
console.log('Generated Token:', token);

app.use(passport.initialize());

app.use(passport.session());

app.use(passport.setAuthenticatedUser);

//Use express router

app.use("/", require("./routes"));
app.use('/send', require("./routes/auth"));
app.listen(port, function (err) {
  if (err) {
    console.log("Error", err);
  }
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
  
  console.log("Server is running on", port);
});
