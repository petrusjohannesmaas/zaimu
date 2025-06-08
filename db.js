const Database = require("better-sqlite3");

const db = new Database("zaimu.sqlite");

// Create users table if it doesn't exist
db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        est_income REAL NOT NULL,
        savings_goal REAL NOT NULL
    );
`);

console.log("Users table initialized successfully");

module.exports = db;
