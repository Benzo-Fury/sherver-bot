import mongoose from "mongoose";

const serverSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  memberRole: {
    type: String,
    required: true,
  },
  welcomeChannel: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Servers", serverSchema);
