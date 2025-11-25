import mongoose from "mongoose"

const sleepSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    bedtime: {
      type: Date,
      required: true,
    },
    wakeTime: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number, // in hours
      min: 0,
      max: 24,
    },
    quality: {
      type: Number, // 1-10 scale
      min: 1,
      max: 10,
    },
    notes: {
      type: String,
      maxlength: 1000,
    },
    date: {
      type: Date,
      required: true,
      default: () => new Date(),
      index: true,
    },
  },
  {
    timestamps: true,
  }
)

sleepSchema.index({ userId: 1, date: -1 })

const Sleep = mongoose.model("Sleep", sleepSchema)
export default Sleep

