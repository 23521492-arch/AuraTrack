/**
 * Script to seed facts to database
 * Run: node backend/src/scripts/seedFacts.js
 */

import dotenv from "dotenv"
import { fileURLToPath } from 'url'
import path from 'path'
import { connectDB } from "../libs/db.js"
import { seedFacts } from "../utils/seedFacts.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '../.env') })

const runSeed = async () => {
  try {
    console.log('🌱 Starting facts seed...')
    await connectDB()
    await seedFacts()
    console.log('✅ Seed completed successfully!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Seed failed:', error)
    process.exit(1)
  }
}

runSeed()

