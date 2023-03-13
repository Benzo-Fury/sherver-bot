import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  xp: {
    type: Number,
    required: true,
    default: 1
  },
  level: {
    type: Number,
    required: true,
    default: 1
  },
  money: {
    type: Number,
    required: true,
    default: 0
  },
  appealed: {
    type: Boolean,
    required: true,
    default: false
  },
  pingBlackListed: {
    type: Boolean,
    required: true
  }
});

export default mongoose.model("Users", userSchema);
