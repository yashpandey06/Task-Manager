import mongoose from "mongoose";
const Done_Schema = new mongoose.Schema({
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

const Done = new mongoose.model("Done", Done_Schema);

export default Done;
