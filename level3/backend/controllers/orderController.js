const pool = require('../config/db');

exports.placeOrder = async (req, res) => {
  const { userId, items, address, phone, deliveryDate, deliveryTime, paymentMethod } = req.body;

  if (!userId || !items || items.length === 0 || !address || !phone || !deliveryDate || !deliveryTime || !paymentMethod) {
    return res.status(400).json({ message: "❌ All fields are required." });
  }

  try {
    const result = await pool.query(
      "INSERT INTO orders (user_id, items, address, phone, delivery_date, delivery_time, payment_method, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [userId, JSON.stringify(items), address, phone, deliveryDate, deliveryTime, paymentMethod, 'Pending']
    );

    res.status(201).json({ message: "✅ Order placed!", order: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "❌ Server error" });
  }
};

exports.getUserOrders = async (req, res) => {
  const { userId } = req.query;

  try {
    const result = await pool.query("SELECT * FROM orders WHERE user_id = $1", [userId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "❌ Server error" });
  }
};
