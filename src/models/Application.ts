import mongoose, { Schema, Document, models, model } from 'mongoose'

export interface IApplication extends Document {
  job: mongoose.Types.ObjectId
  seeker: mongoose.Types.ObjectId
  resumeUrl: string
  coverLetter?: string
  linkedIn?: string
  phone?: string
  status: 'pending' | 'shortlisted' | 'hired' | 'rejected'
  createdAt: Date
  updatedAt: Date
}

const ApplicationSchema = new Schema<IApplication>(
  {
    job:         { type: Schema.Types.ObjectId, ref: 'Job', required: true },
    seeker:      { type: Schema.Types.ObjectId, ref: 'User', required: true },
    resumeUrl:   { type: String, required: true },
    coverLetter: { type: String, default: '' },
    linkedIn:    { type: String, default: '' },
    phone:       { type: String, default: '' },
    status:      { type: String, enum: ['pending', 'shortlisted', 'hired', 'rejected'], default: 'pending' },
  },
  { timestamps: true }
)

ApplicationSchema.index({ job: 1, seeker: 1 }, { unique: true })

delete (mongoose as any).models.Application
export default model<IApplication>('Application', ApplicationSchema)