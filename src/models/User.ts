import { Schema, model, models, Types } from "mongoose";

export type Role = "student" | "admin";

export interface IUser {
  _id: Types.ObjectId;
  email: string;
  passwordHash: string;
  role: Role;
  name: string;
  phone?: string;
  profileImage?: string;
  bio?: string;
  college?: Types.ObjectId;
  wallet: number;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["student", "admin"], default: "student" },
  name: { type: String, required: true },
  phone: { type: String },
  profileImage: { type: String },
  bio: { type: String, maxlength: 500 },
  college: { type: Schema.Types.ObjectId, ref: "College" },
  wallet: { type: Number, default: 0 } // Escrow balance
}, { timestamps: true });

export const User = models.User || model<IUser>("User", userSchema);
