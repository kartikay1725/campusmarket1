import { Schema, model, models } from "mongoose";

const societySchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },  // /society/[slug]
  tagline: String,
  description: String,
  logoUrl: String,
  bannerUrl: String,
  socials: {
    instagram: String,
    facebook: String,
    linkedin: String,
    twitter: String,
    website: String,
  },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  isVerified: { type: Boolean, default: false },
}, { timestamps: true });

export const Society = models.Society || model("Society", societySchema);
