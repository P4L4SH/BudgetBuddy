// ============================================
// Database setup — uses SQLite locally,
// PostgreSQL when DATABASE_URL is set (Render)
// ============================================

// ============================================
// Choose which database to use
// If DATABASE_URL exists, we're on Render
// Otherwise, use local SQLite file
// ============================================
let db;

if (process.env.DATABASE_URL) {
  // ============================================
  // PostgreSQL on Render (production)
  // ============================================
  const { Pool } = require('pg');
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  module.exports = {
    // ============================================
    // Get all transactions, newest first
    // ============================================
    getAll: async () => {
      const result = await pool.query('SELECT * FROM transactions ORDER BY created_at DESC');
      return result.rows;
    },

    // ============================================
    // Add a new transaction
    // ============================================
    add: async (text, amount, type, date) => {
      const result = await pool.query(
        'INSERT INTO transactions (text, amount, type, created_at) VALUES ($1, $2, $3, $4) RETURNING *',
        [text, amount, type, date]
      );
      return result.rows[0];
    },

    // ============================================
    // Update an existing transaction by ID
    // ============================================
    update: async (id, text, amount, type, date) => {
      const result = await pool.query(
        'UPDATE transactions SET text = $1, amount = $2, type = $3, created_at = $4 WHERE id = $5 RETURNING *',
        [text, amount, type, date, id]
      );
      return result.rows[0];
    },

    // ============================================
    // Delete a transaction by ID
    // ============================================
    delete: async (id) => {
      await pool.query('DELETE FROM transactions WHERE id = $1', [id]);
    },

    // ============================================
    // Create the transactions table if it doesn't exist
    // ============================================
    init: async () => {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS transactions (
          id SERIAL PRIMARY KEY,
          text TEXT NOT NULL,
          amount REAL NOT NULL,
          type TEXT CHECK(type IN ('income', 'expense')),
          created_at TEXT NOT NULL
        )
      `);
      console.log('PostgreSQL database ready');
    }
  };

} else {
  // ============================================
  // SQLite for local development
  // ============================================
  const Database = require('better-sqlite3');
  db = new Database('budget.db');

  // ============================================
  // Create transactions table on startup
  // ============================================
  db.exec(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT NOT NULL,
      amount REAL NOT NULL,
      type TEXT CHECK(type IN ('income', 'expense')),
      created_at TEXT NOT NULL
    )
  `);

  module.exports = {
    // ============================================
    // Get all transactions, newest first
    // ============================================
    getAll: () => {
      return db.prepare('SELECT * FROM transactions ORDER BY created_at DESC').all();
    },

    // ============================================
    // Add a new transaction
    // ============================================
    add: (text, amount, type, date) => {
      const result = db.prepare(
        'INSERT INTO transactions (text, amount, type, created_at) VALUES (?, ?, ?, ?)'
      ).run(text, amount, type, date);
      return db.prepare('SELECT * FROM transactions WHERE id = ?').get(result.lastInsertRowid);
    },

    // ============================================
    // Update an existing transaction by ID
    // ============================================
    update: (id, text, amount, type, date) => {
      db.prepare(
        'UPDATE transactions SET text = ?, amount = ?, type = ?, created_at = ? WHERE id = ?'
      ).run(text, amount, type, date, id);
      return db.prepare('SELECT * FROM transactions WHERE id = ?').get(id);
    },

    // ============================================
    // Delete a transaction by ID
    // ============================================  
    delete: (id) => {
      db.prepare('DELETE FROM transactions WHERE id = ?').run(id);
    },

    // ============================================
    // SQLite is already initialized — return a promise
    // so server.js can use .then() consistently
    // ============================================
    init: () => {
      console.log('SQLite database ready');
      return Promise.resolve();
    }
  };
}
