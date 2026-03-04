const db = require("../db");

exports.createLog = (req, res) => {
  const { sleepTime, wakeTime, energy, focus, workStart, workEnd } = req.body;

  const query = `
    INSERT INTO biological_logs
    (user_id, sleep_time, wake_time, energy, focus, work_start, work_end)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [req.user.id, sleepTime, wakeTime, energy, focus, workStart, workEnd],
    (err) => {
      if (err) {
        console.error("Database query error (createLog):", err && err.code ? err.code : err.message || err);
        return res.status(500).json({ message: "Log save error" });
      }

      res.json({ message: "Biological log saved 🧬" });
    }
  );
};