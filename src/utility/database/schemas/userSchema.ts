import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  xp: {
    type: Number,
    required: true,
  },
  level: {
    type: Number,
    required: true
  },
  appealed: {
    type: Boolean,
    required: true,
    default: false
  }
});

export default mongoose.model("Users", userSchema);
