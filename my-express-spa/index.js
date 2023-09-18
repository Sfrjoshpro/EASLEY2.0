const express = require('express');
const mysql = require('mysql2');
const passport = require('passport');
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();

// Replace with your MySQL database connection details
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'AppleSucks7!',
  port: '3306', // Default MySQL port is 3306
};

// Print the environment variables
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID);
console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET);
console.log('SESSION_SECRET:', process.env.SESSION_SECRET);

const dbName = 'easley'; // Change to your desired database name

const connection = mysql.createConnection(dbConfig);

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Initialize Passport.js
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Passport.js serialization and deserialization
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Define your route to handle other requests
app.get('/', (req, res) => {
  res.send('Hello, this is your Node.js server!');
});

// Check if the database exists
connection.query(
  `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '${dbName}'`,
  (err, results) => {
    if (err) {
      console.error('Error checking database existence:', err);
      return;
    }

    if (results.length === 0) {
      // The database doesn't exist; create it
      connection.query(`CREATE DATABASE ${dbName}`, (err) => {
        if (err) {
          console.error('Error creating database:', err);
        } else {
          console.log(`Database '${dbName}' created.`);
        }
      });
    } else {
      console.log(`Database '${dbName}' already exists.`);
    }
  }
);

// Passport.js Google OAuth configuration
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/google/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      // Handle user creation or authentication here
      return done(null, profile);
    }
  )
);

// Google OAuth routes
app.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Successful authentication, redirect to the profile page
    res.redirect('/profile');
  }
);

// Profile route
app.get('/profile', (req, res) => {
  // Check if the user is authenticated
  if (!req.isAuthenticated()) {
    res.redirect('/'); // Redirect to the homepage if not authenticated
    return;
  }

  // Access user details from the request object
  const user = req.user;

  // Display user information on the profile page
  res.send(`
    <h1>Welcome, ${user.displayName}</h1>
    <img src="${user.photos[0].value}" alt="Profile Picture">
    <p>Email: ${user.emails[0].value}</p>
    <a href="/logout">Logout</a>
  `);
});

// Logout route
app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}/`);
});
