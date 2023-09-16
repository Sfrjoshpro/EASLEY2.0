const express = require('express');
const mysql = require('mysql2');
const app = express();

// Replace with your MySQL database connection details
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'AppleSucks7!',
  port: '3306', // Default MySQL port is 3306
};

const dbName = 'easley'; // Change to your desired database name

const connection = mysql.createConnection(dbConfig);

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Define your route to handle other requests
app.get('/', (req, res) => {
  res.send('Hello, this is your Node.js server!');
});

// Check if the database exists (similar to your previous code)
connection.query(
  `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '${dbName}'`,
  (err, results) => {
    if (err) {
      console.error('Error checking database existence:', err);
      return;
    }

    if (results.length === 0) {
      // The database doesn't exist; create it (similar to your previous code)
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

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}/`);
});
