import { Schema, model, models, Types } from "mongoose";

export interface ICollege {
  _id: Types.ObjectId;
  name: string;
  shortCode: string;
  city: string;
  deliveryLocations: {
    name: string;
    building: string;
  }[];
}

const deliveryLocationSchema = new Schema({
  name: { type: String, required: true },
  building: { type: String, required: true }
}, { _id: false });

const collegeSchema = new Schema({
  name: { type: String, required: true, unique: true },
  shortCode: { type: String, required: true, unique: true, uppercase: true },
  city: { type: String, required: true },
  deliveryLocations: [deliveryLocationSchema]
}, { timestamps: true });

export const College = models.College || model<ICollege>("College", collegeSchema);
