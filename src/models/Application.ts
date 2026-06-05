import mongoose, { Schema, Document, models, model } from 'mongoose'

export interface IApplication extends Document {
  job: mongoose.Types.ObjectId
  seeker: mongoose.Types.ObjectId
  resumeUrl: string
  coverLetter?: string
  linkedIn?: string
  phone?: string
  status: 'pending' | 'shortlisted' | 'hired' | 'rejected'
  // New fields
  location?: string
  experience?: string
  travelWillingness?: string
  education?: string
  currentSalary?: string
  expectedSalary?: string
  noticePeriod?: string
  // UAE specific
  basedInUAE?: string
  emirate?: string
  uaeDrivingLicense?: string
  createdAt: Date
  updatedAt: Date
}

const ApplicationSchema = new Schema<IApplication>(
  {
    job:               { type: Schema.Types.ObjectId, ref: 'Job', required: true },
    seeker:            { type: Schema.Types.ObjectId, ref: 'User', required: true },
    resumeUrl:         { type: String, required: true },
    coverLetter:       { type: String, default: '' },
    linkedIn:          { type: String, default: '' },
    phone:             { type: String, default: '' },
    status:            { type: String, enum: ['pending', 'shortlisted', 'hired', 'rejected'], default: 'pending' },
    // New fields
    location:          { type: String, default: '' },
    experience:        { type: String, default: '' },
    travelWillingness: { type: String, default: '' },
    education:         { type: String, default: '' },
    currentSalary:     { type: String, default: '' },
    expectedSalary:    { type: String, default: '' },
    noticePeriod:      { type: String, default: '' },
    // UAE specific
    basedInUAE:        { type: String, default: '' },
    emirate:           { type: String, default: '' },
    uaeDrivingLicense: { type: String, default: '' },
  },
  { timestamps: true }
)

ApplicationSchema.index({ job: 1, seeker: 1 }, { unique: true })

delete (mongoose as any).models.Application
export default model<IApplication>('Application', ApplicationSchema)