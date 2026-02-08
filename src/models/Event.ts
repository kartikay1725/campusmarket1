import { Schema, model, models } from "mongoose";

const eventSchema = new Schema({
  society: { type: Schema.Types.ObjectId, ref: "Society", required: true },
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  location: String,
  startDate: Date,
  endDate: Date,
  bannerUrl: String,
  interested: [{ type: Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true });

export const Event = models.Event || model("Event", eventSchema);
