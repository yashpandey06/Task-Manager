import mongoose from "mongoose";

const Todo_Schema = new mongoose.Schema({
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

const Todo = new mongoose.model("Todo", Todo_Schema);

export default Todo;
