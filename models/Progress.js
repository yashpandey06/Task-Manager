import mongoose from "mongoose";

const Progress_Schema = mongoose.Schema({
  Task: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Progress = new mongoose.model("Progress", Progress_Schema);

export default Progress;
