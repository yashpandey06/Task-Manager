import mongoose from "mongoose";

const User_Schema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  date: Date
});
const User = new mongoose.model("User", User_Schema);

export default User;
