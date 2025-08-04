import mongoose, { Document, Schema, Types } from "mongoose";

// TypeScript interface for attachment
export interface IAttachment {
  name: string;
  url: string;
  type: string;
  size?: number;
  uploadedAt: Date;
}

// TypeScript interface for the Task document
export interface ITask extends Document {
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "review" | "completed" | "cancelled";
  attachments: IAttachment[];
  subtasks: Types.ObjectId[]; // References to other Task documents
  parentTask?: Types.ObjectId; // Reference to parent task (if this is a subtask)
  projectId?: Types.ObjectId; // Reference to the project this task belongs to
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose schema for Attachment
const AttachmentSchema = new Schema<IAttachment>({
  name: {
    type: String,
    required: [true, "Attachment name is required"],
    trim: true,
  },
  url: {
    type: String,
    required: [true, "Attachment URL is required"],
  },
  type: {
    type: String,
    required: [true, "Attachment type is required"],
  },
  size: {
    type: Number,
    min: [0, "File size cannot be negative"],
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

// Mongoose schema for Task
const TaskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title must be less than 200 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description must be less than 1000 characters"],
    },
    status: {
      type: String,
      enum: {
        values: ["todo", "in-progress", "review", "completed", "cancelled"],
        message: "{VALUE} is not a valid status",
      },
      required: [true, "Status is required"],
      default: "todo",
    },
    attachments: {
      type: [AttachmentSchema],
      default: [],
    },
    subtasks: {
      type: [{ type: Schema.Types.ObjectId, ref: "Task" }],
      default: [],
    },
    parentTask: {
      type: Schema.Types.ObjectId,
      ref: "Task",
      default: null,
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      default: null,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create indexes for better query performance
TaskSchema.index({ title: 1 });
TaskSchema.index({ status: 1 });
TaskSchema.index({ parentTask: 1 });
TaskSchema.index({ projectId: 1 });
TaskSchema.index({ createdAt: -1 });

// Add a virtual field to populate subtasks
TaskSchema.virtual("populatedSubtasks", {
  ref: "Task",
  localField: "subtasks",
  foreignField: "_id",
});

// Ensure virtual fields are serialized
TaskSchema.set("toJSON", { virtuals: true });
TaskSchema.set("toObject", { virtuals: true });

// Pre-remove middleware to handle cascading deletes
TaskSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function () {
    // Remove this task from any parent task's subtasks array
    if (this.parentTask) {
      await mongoose
        .model("Task")
        .updateOne({ _id: this.parentTask }, { $pull: { subtasks: this._id } });
    }

    // Delete all subtasks recursively
    const subtasks = await mongoose
      .model("Task")
      .find({ _id: { $in: this.subtasks } });
    for (const subtask of subtasks) {
      await subtask.deleteOne();
    }
  }
);

// Export the model (check if it already exists to avoid re-compilation issues)
export default mongoose.models.Task ||
  mongoose.model<ITask>("Task", TaskSchema);
