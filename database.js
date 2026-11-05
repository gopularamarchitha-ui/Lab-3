const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "books.db");
const db = new sqlite3.Database(dbPath, (error) => {
  if (error) {
    console.error("Database connection failed:", error.message);
  } else {
    console.log("Connected to SQLite database.");
  }
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      price REAL NOT NULL CHECK(price >= 0)
    )
  `, (error) => {
    if (error) {
      console.error("Could not create books table:", error.message);
    } else {
      console.log("Books table is ready.");
    }
  });
});

module.exports = db;
