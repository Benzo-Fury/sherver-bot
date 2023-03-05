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
  }
});

export default mongoose.model("Users", userSchema);
