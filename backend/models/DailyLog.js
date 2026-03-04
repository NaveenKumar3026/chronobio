const mongoose = require("mongoose");

const DailyLogSchema = new mongoose.Schema({
  userId: String,
  sleepTime: String,
  wakeTime: String,
  energy: Number,
  focus: Number,
  workStart: String,
  workEnd: String,
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("DailyLog", DailyLogSchema);