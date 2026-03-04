const db = require("../db");

exports.getInsights = (req, res) => {
  const query = "SELECT * FROM biological_logs WHERE user_id = ?";

  db.query(query, [req.user.id], (err, logs) => {
    if (err) {
      console.error("Database query error (getInsights):", err && err.code ? err.code : err.message || err);
      return res.status(500).json({ message: "Insight generation error" });
    }

    if (!logs || logs.length === 0) {
      return res.json({ message: "No biological data yet" });
    }

    try {

      // ===== AVERAGES =====
      const avgEnergy =
        logs.reduce((sum, log) => sum + Number(log.energy), 0) / logs.length;

      const avgFocus =
        logs.reduce((sum, log) => sum + Number(log.focus), 0) / logs.length;

     const sleepDurations = logs.map((log) => {

  if (!log.sleep_time || !log.wake_time) return 0;

  const sleep = parseInt(log.sleep_time.split(":")[0]);
  const wake = parseInt(log.wake_time.split(":")[0]);

  return wake >= sleep ? wake - sleep : 24 - sleep + wake;
});

      const avgSleep =
        sleepDurations.reduce((a, b) => a + b, 0) / sleepDurations.length;

      // ===== SLEEP CONSISTENCY =====
      const sleepVariance =
        sleepDurations.reduce((sum, h) => sum + Math.abs(h - avgSleep), 0) /
        sleepDurations.length;

      const sleepConsistencyScore = Math.max(
        0,
        100 - sleepVariance * 15
      );

      // ===== ENERGY STABILITY =====
      const energyVariance =
        logs.reduce(
          (sum, log) => sum + Math.abs(log.energy - avgEnergy),
          0
        ) / logs.length;

      const energyStabilityScore = Math.max(
        0,
        100 - energyVariance * 12
      );

      // ===== PERFORMANCE SCORE =====
      const performanceScore = Math.round(
        (avgEnergy * 4 + avgFocus * 4 + avgSleep * 2) * 2
      );

      // ===== PEAK WINDOW =====
      const peak = logs.reduce((max, log) =>
        log.focus > max.focus ? log : max
      );

      // ===== STATE CLASSIFICATION =====
      let state = "Balanced 🟡";
      let recommendation = "Maintain rhythm consistency.";

      if (performanceScore >= 80) {
        state = "High Performance 🟢";
        recommendation =
          "Your biological systems are aligned. Schedule high-intensity cognitive tasks during peak window.";
      } else if (avgSleep < 6.5) {
        state = "Sleep Deprived 🔴";
        recommendation =
          "Increase sleep duration to improve neural recovery and cognitive clarity.";
      } else if (avgEnergy < 5) {
        state = "Low Energy 🔴";
        recommendation =
          "Energy baseline is low. Improve sleep timing and hydration levels.";
      } else if (sleepConsistencyScore < 60) {
        state = "Rhythm Misaligned 🟠";
        recommendation =
          "Your sleep timing is inconsistent. Maintain fixed sleep and wake schedule.";
      }

     res.json({
  averageEnergy: avgEnergy.toFixed(2),
  averageFocus: avgFocus.toFixed(2),
  averageSleepHours: avgSleep.toFixed(1),
  peakProductivityWindow: `${peak.work_start} - ${peak.work_end}`,
  biologicalState: state,
  performanceScore: performanceScore,
  sleepConsistencyScore: Math.round(sleepConsistencyScore),
  energyStabilityScore: Math.round(energyStabilityScore),
  recommendation: recommendation,
  trendData: logs.map((log, index) => ({
    day: `Day ${index + 1}`,
    energy: Number(log.energy),
    focus: Number(log.focus)
  }))
});

    } catch (error) {
      console.error("Insight processing error:", error && error.message ? error.message : error);
      return res.status(500).json({ message: "Insight generation error" });
    }
  });
};