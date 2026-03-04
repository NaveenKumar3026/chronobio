const express = require("express");
const db = require("../db");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/insights", verifyToken, (req, res) => {

  db.query(
    "SELECT energy, focus, sleep_hours, work_start FROM daily_logs WHERE user_id = ?",
    [req.userId],
    (err, results) => {

      if (err) {
        console.error("Database query error (insightRoutes):", err && err.code ? err.code : err.message || err);
        return res.status(500).json({ message: "Database error" });
      }

      if (!results || results.length === 0) {
        return res.json({
          averageEnergy: 0,
          averageFocus: 0,
          averageSleepHours: 0,
          performanceScore: 0,
          biologicalState: "No Data 🔴",
          recommendation: "Add more logs to generate insights"
        });
      }

      let totalEnergy = 0;
      let totalFocus = 0;
      let totalSleep = 0;

      const timeFrequency = {};

      results.forEach(log => {
        totalEnergy += Number(log.energy);
        totalFocus += Number(log.focus);
        totalSleep += Number(log.sleep_hours);

        if (log.work_start) {
          timeFrequency[log.work_start] =
            (timeFrequency[log.work_start] || 0) + 1;
        }
      });

      const avgEnergy = (totalEnergy / results.length).toFixed(2);
      const avgFocus = (totalFocus / results.length).toFixed(2);
      const avgSleep = (totalSleep / results.length).toFixed(2);

      const performanceScore = Math.round(
        (avgEnergy * 4 + avgFocus * 4 + avgSleep * 2)
      );

      let peakWindow = "Not Enough Data";

      if (Object.keys(timeFrequency).length > 0) {
        peakWindow = Object.keys(timeFrequency).reduce((a, b) =>
          timeFrequency[a] > timeFrequency[b] ? a : b
        );
      }

      let biologicalState = "Balanced 🟡";

      if (performanceScore > 80) biologicalState = "Optimized 🟢";
      else if (performanceScore < 50) biologicalState = "Drained 🔴";

      let recommendation = "Maintain consistent sleep and work timing.";

      if (biologicalState.includes("Drained"))
        recommendation = "Increase sleep and reduce workload.";
      if (biologicalState.includes("Optimized"))
        recommendation = "You are in peak rhythm. Schedule important work now.";

      res.json({
        averageEnergy: avgEnergy,
        averageFocus: avgFocus,
        averageSleepHours: avgSleep,
        performanceScore,
        peakProductivityWindow: peakWindow,
        biologicalState,
        recommendation
      });
    }
  );
});

module.exports = router;