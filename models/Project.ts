import mongoose, { Document, Schema, Types } from "mongoose";

// TypeScript interface for the Project document
export interface IProject extends Document {
  title: string;
  description?: string;
  status: "planning" | "in-progress" | "review" | "completed" | "on-hold";
  tags: string[];
  tasks: Types.ObjectId[]; // References to Task documents
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose schema for Project
const ProjectSchema = new Schema<IProject>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title must be less than 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description must be less than 500 characters"],
    },
    status: {
      type: String,
      enum: {
        values: ["planning", "in-progress", "review", "completed", "on-hold"],
        message: "{VALUE} is not a valid status",
      },
      required: [true, "Status is required"],
      default: "planning",
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: function (tags: string[]) {
          return tags.every((tag) => tag.trim().length > 0);
        },
        message: "Tags cannot be empty strings",
      },
    },
    tasks: {
      type: [{ type: Schema.Types.ObjectId, ref: "Task" }],
      default: [],
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create indexes for better query performance
ProjectSchema.index({ title: 1 });
ProjectSchema.index({ status: 1 });
ProjectSchema.index({ tags: 1 });
ProjectSchema.index({ tasks: 1 });
ProjectSchema.index({ createdAt: -1 });

// Export the model (check if it already exists to avoid re-compilation issues)
export default mongoose.models.Project ||
  mongoose.model<IProject>("Project", ProjectSchema);
