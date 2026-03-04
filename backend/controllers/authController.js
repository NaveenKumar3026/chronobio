const db = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// ================= REGISTER =================
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required ❌" });
    }

    // Check if user exists
    db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (err, result) => {
        if (err) return res.status(500).json({ message: "DB error" });

        if (result.length > 0) {
          return res.status(400).json({ message: "User already exists ⚠️" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user
        db.query(
          "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
          [name, email, hashedPassword],
          (err, result) => {
            if (err) return res.status(500).json({ message: "DB Insert Error" });

            res.json({ message: "User registered successfully ✅" });
          }
        );
      }
    );

  } catch (error) {
    res.status(500).json({ message: "Server error ❌" });
  }
};



// ================= LOGIN =================
exports.login = (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, result) => {

      if (err) return res.status(500).json({ message: "DB error ❌" });

      if (result.length === 0)
        return res.status(404).json({ message: "User not found ❌" });

      const validPassword = await bcrypt.compare(
        password,
        result[0].password
      );

      if (!validPassword)
        return res.status(401).json({ message: "Invalid password ❌" });

      // 🔐 CREATE TOKEN
      const token = jwt.sign(
        { id: result[0].id, email: result[0].email },
        "secretkey123",
        { expiresIn: "1h" }
      );

      res.json({
        message: "Login successful 🔓",
        token: token
      });
    }
  );
};