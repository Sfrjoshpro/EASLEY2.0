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
  res.sendFile(__dirname + '/public/index.html');
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
    // Redirect to the profile page (profile.html) after successful login
    res.sendFile(__dirname + '/public/profile.html');
  }
);

// Profile route
app.get('/profile', (req, res) => {
  // Check if the user is authenticated
  if (!req.isAuthenticated()) {
    res.status(401).json({ message: 'Not authenticated' });
    return;
  }

  // Access user details from the request object
  const user = req.user;
  res.json(user);
});

app.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Error logging out:', err);
    }
    res.redirect('/');
  });
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}/`);
});
