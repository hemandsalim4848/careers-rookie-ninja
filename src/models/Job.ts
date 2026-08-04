import mongoose, { Schema, Document, models, model } from 'mongoose'

export interface IQuestionOption {
  id: string
  text: string
  points: number
}

export interface IQuestion {
  id: string
  text: string
  type: 'single' | 'multiple' | 'text'
  required: boolean
  options: IQuestionOption[]
}

export interface IJob extends Document {
  title: string
  department: string
  location: string
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship'
  remote: boolean
  salaryMin?: number
  salaryMax?: number
  currency: string
  description: string
  responsibilities: string[]
  targetMarkets?: string
  requirements: string[]
  niceToHave?: string[]
  questionnaire: IQuestion[]
  minimumScore: number
  status: 'open' | 'closed'
  postedBy: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
  slug?: string
}

const QuestionOptionSchema = new Schema(
  {
    id:     { type: String, required: true },
    text:   { type: String, required: true, trim: true },
    points: { type: Number, default: 0 },
  },
  { _id: false }
)

const QuestionSchema = new Schema(
  {
    id:       { type: String, required: true },
    text:     { type: String, required: true, trim: true },
    type:     { type: String, enum: ['single', 'multiple', 'text'], required: true },
    required: { type: Boolean, default: true },
    options:  { type: [QuestionOptionSchema], default: [] },
  },
  { _id: false }
)

const JobSchema = new Schema<IJob>(
  {
    title:            { type: String, required: true, trim: true },
    department:       { type: String, required: true, trim: true },
    location:         { type: String, required: true, trim: true },
    type:             { type: String, enum: ['Full-time', 'Part-time', 'Contract', 'Internship'], required: true },
    remote:           { type: Boolean, default: false },
    salaryMin:        { type: Number },
    salaryMax:        { type: Number },
    currency:         { type: String, default: 'AED' },
    description:      { type: String, required: true },
    responsibilities: [{ type: String }],
    targetMarkets:    { type: String, default: '' },
    requirements:     [{ type: String }],
    niceToHave:       [{ type: String }],
    questionnaire:    { type: [QuestionSchema], default: [] },
    minimumScore:     { type: Number, default: 0 },
    status:           { type: String, enum: ['open', 'closed'], default: 'open' },
    postedBy:         { type: Schema.Types.ObjectId, ref: 'User', required: true },
    slug:             { type: String, unique: true, sparse: true },
  },
  { timestamps: true }
)

// Filtering index — covers status, department, location, type queries
JobSchema.index({ status: 1, department: 1, location: 1, type: 1 })

// Sort index — for default newest-first ordering
JobSchema.index({ createdAt: -1 })

// Text search index — for title/description keyword search
JobSchema.index({ title: 'text', description: 'text' })

export default models.Job || model<IJob>('Job', JobSchema)
