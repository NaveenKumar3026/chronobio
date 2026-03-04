require("dotenv").config();
const mysql = require("mysql2");

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  // DO NOT hardcode passwords here — prefer setting a backend/.env file.
  password: process.env.DB_PASSWORD || "Nave@123",
  database: process.env.DB_NAME || "chronobio",
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306
};

const rawConn = mysql.createConnection(dbConfig);

let connected = false;

rawConn.connect((err) => {
  if (err) {
    console.error(
      "MySQL Connection Failed ❌ — check DB credentials and that MySQL is running.",
      err && err.code ? `Code: ${err.code}` : ""
    );
    connected = false;
    // Do NOT exit the process here; allow the server to start so frontend can return friendly errors.
  } else {
    console.log("MySQL Connected 🟢");
    connected = true;
  }
});

// Export a safe db object with a `query` wrapper so callers don't throw when DB is down.
const db = {
  query: function (sql, params, cb) {
    if (!connected) {
      const err = new Error('Database not connected');
      err.code = 'DB_NOT_CONNECTED';
      if (typeof cb === 'function') return cb(err);
      return;
    }
    return rawConn.query(sql, params, cb);
  },
  raw: rawConn,
  isConnected: () => connected
};

module.exports = db;