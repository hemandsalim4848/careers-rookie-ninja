import mongoose, { Schema, Document, models, model } from 'mongoose'

export interface IUser extends Document {
  name: string
  email: string
  password: string
  role: 'seeker' | 'hr'
  phone?: string
  linkedIn?: string
  resumeUrl?: string
  createdAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    name:      { type: String, required: true, trim: true },
    email:     { type: String, required: true, unique: true, lowercase: true, trim: true },
    password:  { type: String, required: true },
    role:      { type: String, enum: ['seeker', 'hr'], default: 'seeker' },
    phone:     { type: String, default: null },
    linkedIn:  { type: String, default: null },
    resumeUrl: { type: String, default: null },
  },
  { timestamps: true }
)

// Force re-compile — clears cached model
delete (mongoose as any).models.User
export default model<IUser>('User', UserSchema)