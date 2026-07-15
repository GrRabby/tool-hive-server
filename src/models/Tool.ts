import mongoose, { Document, Schema } from "mongoose";

export type ToolCategory =
  | "power-tools"
  | "garden"
  | "camping"
  | "party-events"
  | "electronics"
  | "other";

export type ToolCondition = "new" | "good" | "fair";

export interface ITool extends Document {
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: ToolCategory;
  dailyRate: number;
  condition: ToolCondition;
  location: string;
  rating: number;
  imageUrl: string;
  ownerId: string; 
  createdAt: Date;
}

const ToolSchema = new Schema<ITool>({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
    maxlength: 100,
  },
  shortDescription: {
    type: String,
    required: [true, "Short description is required"],
    trim: true,
    maxlength: 160,
  },
  fullDescription: {
    type: String,
    required: [true, "Full description is required"],
    trim: true,
    maxlength: 2000,
  },
  category: {
    type: String,
    enum: ["power-tools", "garden", "camping", "party-events", "electronics", "other"],
    required: true,
  },
  dailyRate: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  condition: {
    type: String,
    enum: ["new", "good", "fair"],
    default: "good",
  },
  location: {
    type: String,
    required: [true, "Location is required"],
    trim: true,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 4.5,
  },
  imageUrl: {
    type: String,
    default: "",
  },
  ownerId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

ToolSchema.index({ title: "text", shortDescription: "text", location: "text" });

export default mongoose.model<ITool>("Tool", ToolSchema);
