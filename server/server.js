// ============================================
// BudgetBuddy Express Server
// Handles API requests and serves frontend
// ============================================

const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================
// Middleware setup
// Allow cross-origin requests + parse JSON body
// ============================================
app.use(cors());
app.use(express.json());

// ============================================
// In production, serve the built React frontend
// ============================================
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
}

// ============================================
// GET /api/transactions — Fetch all transactions
// ============================================
app.get('/api/transactions', async (req, res) => {
  try {
    const transactions = await db.getAll();
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================
// POST /api/transactions — Add a new transaction
// Expects: { text, amount, type, date }
// ============================================
app.post('/api/transactions', async (req, res) => {
  try {
    const { text, amount, type, date } = req.body;
    if (!text || amount == null || !type || !date) {
      return res.status(400).json({ error: 'text, amount, type, and date are required' });
    }
    const transaction = await db.add(text, amount, type, date);
    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================
// PUT /api/transactions/:id — Edit a transaction
// ============================================
app.put('/api/transactions/:id', async (req, res) => {
  try {
    const { text, amount, type, date } = req.body;
    const transaction = await db.update(req.params.id, text, amount, type, date);
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================
// DELETE /api/transactions/:id — Delete a transaction
// ============================================
app.delete('/api/transactions/:id', async (req, res) => {
  try {
    await db.delete(req.params.id);
    res.json({ message: 'Transaction deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================
// In production, serve index.html for any
// route not matched by API (SPA fallback)
// ============================================
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

// ============================================
// Initialize database and start the server
// ============================================
db.init().then(() => {
  app.listen(PORT, () => {
    console.log(`BudgetBuddy server running on http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});
