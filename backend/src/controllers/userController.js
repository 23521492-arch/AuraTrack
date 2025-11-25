import User from "../models/User.js"
import mongoose from "mongoose"

export const authMe = async (req,res) =>{
    try {
        //Get user from req
        const user = req.user;
        return res.status(200).json({message: 'User info', user});
    } catch (error) {
        console.error('Error in authMe controller',error);
        res.status(500).json({message: 'System error'});
    }
}

// PATCH /api/users/me
// Auth: Bearer access token
// Body: { displayName?:string, bio?:string, phone?:string, avatarUrl?:string }
// Response: 200 { user }
export const updateMe = async (req, res) => {
  try {
    const userId = req.user?._id
    if (!userId) return res.status(401).json({ message: "Unauthorized" })

    const { displayName, bio, phone, avatarUrl } = req.body || {}
    const updates = {}

    if (displayName !== undefined) {
      if (typeof displayName !== "string" || displayName.trim().length === 0) {
        return res.status(400).json({ message: "displayName must be a non-empty string" })
      }
      updates.displayName = displayName.trim()
    }

    if (bio !== undefined) {
      if (typeof bio !== "string") {
        return res.status(400).json({ message: "bio must be a string" })
      }
      if (bio.length > 500) {
        return res.status(400).json({ message: "bio must be 500 characters or less" })
      }
      updates.bio = bio.trim()
    }

    if (phone !== undefined) {
      if (phone !== null && typeof phone !== "string") {
        return res.status(400).json({ message: "phone must be a string or null" })
      }
      updates.phone = phone ? phone.trim() : null
    }

    if (avatarUrl !== undefined) {
      if (typeof avatarUrl !== "string") {
        return res.status(400).json({ message: "avatarUrl must be a string" })
      }
      // Validate URL format
      if (avatarUrl.trim() && !avatarUrl.match(/^(https?:\/\/|data:image)/)) {
        return res.status(400).json({ message: "avatarUrl must be a valid URL or data URI" })
      }
      updates.avatarUrl = avatarUrl.trim() || null
      // Clear avatarId when setting new avatarUrl (if not using Cloudinary)
      if (avatarUrl.trim()) {
        updates.avatarId = null
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No valid fields to update" })
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-hashedPassword")

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    return res.status(200).json({ user })
  } catch (error) {
    console.error("Error in updateMe", error)
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message })
    }
    res.status(500).json({ message: "System error" })
    }
}