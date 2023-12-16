import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  addGuest: [
    {
      email: { type: String, required: true },
      id: { type: String, required: true },
    },
  ],
  date: { type: String, required: true },
  description: { type: String, required: true },
  duration: {
    hours: { type: Number, required: true },
    minutes: { type: String, required: true },
  },
  location: { type: String, required: true },
  meetingRoom: { type: String, required: true },
  notification: { type: String, required: true },
  reminder: { type: Number, required: true },
  time: { type: String, required: true },
  imageUrls: [
    {
      type: String,
      required: true,
    },
  ],
  eventName: {
    type: String,
    required: true,
  },
  by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

export default mongoose.model("Event", eventSchema);
