require("dotenv").config();
const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "chronobio",
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306
});

connection.connect((err) => {
  if (err) {
    console.error("MySQL connection failed — check credentials and server status.", err && err.code ? `Code: ${err.code}` : "");
  } else {
    console.log("MySQL Connected");
  }
});

module.exports = connection;