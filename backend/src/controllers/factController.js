import Fact from "../models/Fact.js"

// GET /api/facts
// Auth: Bearer access token (optional - can be public)
// Query: category?:string (optional filter: 'wellness', 'sleep', 'mood', 'habits', 'general', 'science', 'health', 'tips')
// Response: 200 { icon, title, fact, category }
export const getRandomFact = async (req, res) => {
  try {
    const { category } = req.query
    
    // Build query
    const query = { isActive: true }
    if (category) {
      query.category = category
    }
    
    // Get random fact
    const facts = await Fact.find(query)
    
    if (facts.length === 0) {
      // If no facts found for category, get any active fact
      const anyFact = await Fact.findOne({ isActive: true })
      if (!anyFact) {
        return res.status(404).json({ message: "No facts available" })
      }
      return res.status(200).json(anyFact)
    }
    
    // Pick random fact
    const randomFact = facts[Math.floor(Math.random() * facts.length)]
    
    // Increment view count (async, don't wait)
    Fact.findByIdAndUpdate(randomFact._id, { $inc: { viewCount: 1 } }).catch(() => {})
    
    return res.status(200).json(randomFact)
  } catch (error) {
    console.error("Error in getRandomFact", error)
    res.status(500).json({ message: "System error" })
  }
}

// GET /api/facts/all
// Auth: Bearer access token
// Query: category?:string, isActive?:boolean
// Response: 200 { facts: [] }
export const getAllFacts = async (req, res) => {
  try {
    const { category, isActive } = req.query
    
    const query = {}
    if (category) query.category = category
    if (isActive !== undefined) query.isActive = isActive === 'true'
    
    const facts = await Fact.find(query).sort({ createdAt: -1 })
    return res.status(200).json({ facts })
  } catch (error) {
    console.error("Error in getAllFacts", error)
    res.status(500).json({ message: "System error" })
  }
}

// POST /api/facts
// Auth: Bearer access token (admin only - can add later)
// Body: { icon, title, fact, category }
// Response: 201 { fact }
export const createFact = async (req, res) => {
  try {
    const { icon, title, fact, category } = req.body
    
    if (!icon || !title || !fact || !category) {
      return res.status(400).json({ message: "icon, title, fact, and category are required" })
    }
    
    const newFact = await Fact.create({
      icon,
      title,
      fact,
      category,
    })
    
    return res.status(201).json({ fact: newFact })
  } catch (error) {
    console.error("Error in createFact", error)
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message })
    }
    res.status(500).json({ message: "System error" })
  }
}

// PATCH /api/facts/:id
// Auth: Bearer access token (admin only - can add later)
// Body: { icon?, title?, fact?, category?, isActive? }
// Response: 200 { fact }
export const updateFact = async (req, res) => {
  try {
    const { id } = req.params
    const { icon, title, fact, category, isActive } = req.body
    
    const factDoc = await Fact.findById(id)
    if (!factDoc) {
      return res.status(404).json({ message: "Fact not found" })
    }
    
    if (icon !== undefined) factDoc.icon = icon
    if (title !== undefined) factDoc.title = title
    if (fact !== undefined) factDoc.fact = fact
    if (category !== undefined) factDoc.category = category
    if (isActive !== undefined) factDoc.isActive = isActive
    
    await factDoc.save()
    
    return res.status(200).json({ fact: factDoc })
  } catch (error) {
    console.error("Error in updateFact", error)
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message })
    }
    res.status(500).json({ message: "System error" })
  }
}

// DELETE /api/facts/:id
// Auth: Bearer access token (admin only - can add later)
// Response: 200 { message: "Fact deleted" }
export const deleteFact = async (req, res) => {
  try {
    const { id } = req.params
    
    const fact = await Fact.findByIdAndDelete(id)
    if (!fact) {
      return res.status(404).json({ message: "Fact not found" })
    }
    
    return res.status(200).json({ message: "Fact deleted" })
  } catch (error) {
    console.error("Error in deleteFact", error)
    res.status(500).json({ message: "System error" })
  }
}

