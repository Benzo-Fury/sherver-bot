import mongoose from "mongoose";

const warnSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  channel: {
    type: String,
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  user: {
    type: String,
    required: true
  },
  mod: {
    type: String, 
    required: true
  },
  time: {
    type: String, 
    required: true
  }
});

export default mongoose.model("Warns", warnSchema);