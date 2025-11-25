import mongoose from "mongoose"

const factSchema = new mongoose.Schema(
  {
    icon: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      maxlength: 200,
    },
    fact: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    category: {
      type: String,
      required: true,
      enum: ['wellness', 'sleep', 'mood', 'habits', 'general', 'science', 'health', 'tips'],
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
)

factSchema.index({ category: 1, isActive: 1 })

const Fact = mongoose.model("Fact", factSchema)
export default Fact

