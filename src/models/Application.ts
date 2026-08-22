import mongoose, { Schema, Document, models, model, Model } from 'mongoose'

export interface IQuestionnaireAnswer {
  questionId: string
  selectedOptionIds: string[]
  textAnswer?: string
}

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
  // Questionnaire scoring
  questionnaireAnswers: IQuestionnaireAnswer[]
  totalScore: number
  createdAt: Date
  updatedAt: Date
}

const QuestionnaireAnswerSchema = new Schema(
  {
    questionId:         { type: String, required: true },
    selectedOptionIds:  { type: [String], default: [] },
    textAnswer:         { type: String, default: '' },
  },
  { _id: false }
)

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
    // Questionnaire scoring
    questionnaireAnswers: { type: [QuestionnaireAnswerSchema], default: [] },
    totalScore:           { type: Number, default: 0 },
  },
  { timestamps: true }
)

ApplicationSchema.index({ job: 1, seeker: 1, createdAt: -1 })
ApplicationSchema.index({ seeker: 1, createdAt: -1 })

export default models.Application as mongoose.Model<IApplication> || model<IApplication>('Application', ApplicationSchema)
