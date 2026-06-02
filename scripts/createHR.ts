import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const MONGODB_URI = process.env.MONGODB_URI!

const UserSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  email:     { type: String, required: true, unique: true, lowercase: true },
  password:  { type: String, required: true },
  role:      { type: String, default: 'hr' },
  phone:     { type: String },
  linkedIn:  { type: String },
  resumeUrl: { type: String },
}, { timestamps: true })

const User = mongoose.models.User || mongoose.model('User', UserSchema)

async function createHR() {
  const args = process.argv.slice(2)

  if (args.length < 3) {
    console.error('Usage: npx ts-node scripts/createHR.ts <name> <email> <password>')
    console.error('Example: npx ts-node scripts/createHR.ts "Sarah HR" sarah@rookie-ninja.com MyPassword123')
    process.exit(1)
  }

  const [name, email, password] = args

  if (password.length < 8) {
    console.error('Password must be at least 8 characters.')
    process.exit(1)
  }

  try {
    await mongoose.connect(MONGODB_URI)
    console.log('Connected to MongoDB')

    const existing = await User.findOne({ email: email.toLowerCase() })
    if (existing) {
      console.error(`User with email ${email} already exists.`)
      process.exit(1)
    }

    const hashed = await bcrypt.hash(password, 12)
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashed,
      role: 'hr',
    })

    console.log('✅ HR account created successfully!')
    console.log('   Name:', user.name)
    console.log('   Email:', user.email)
    console.log('   Role:', user.role)
    console.log('   ID:', user._id)
  } catch (err: any) {
    console.error('Error:', err.message)
  } finally {
    await mongoose.disconnect()
    process.exit(0)
  }
}

createHR()