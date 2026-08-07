import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { MOCK_JOBS } from "../src/lib/mockData";

dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI!;

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, default: "hr" },
  },
  { timestamps: true },
);

const JobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    department: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Internship"],
      required: true,
    },
    remote: { type: Boolean, default: false },
    salaryMin: { type: Number },
    salaryMax: { type: Number },
    currency: { type: String, default: "AED" },
    description: { type: String, required: true },
    responsibilities: [{ type: String }],
    targetMarkets: { type: String, default: "" },
    requirements: [{ type: String }],
    niceToHave: [{ type: String }],
    status: { type: String, enum: ["open", "closed"], default: "open" },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    slug: { type: String, unique: true, sparse: true },
  },
  { timestamps: true },
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);
const Job = mongoose.models.Job || mongoose.model("Job", JobSchema);

async function seedJobs() {
  console.log("Seeding jobs from mock data...");

  if (!MONGODB_URI) {
    console.error("MONGODB_URI is not set in .env.local");
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    const hr = await User.findOne({ role: "hr" });
    if (!hr) {
      console.error("No HR user found. Run npm run create-hr first.");
      process.exit(1);
    }

    console.log(`Using HR user: ${hr.email} (${hr._id})`);

    const existing = await Job.countDocuments();
    if (existing > 0) {
      console.log(
        `Already have ${existing} job(s). Skipping seed. Delete them first if you want to re-seed.`,
      );
      process.exit(0);
    }

    const docs = MOCK_JOBS.map(
      ({ _id, postedAt, applicationCount, ...job }) => ({
        ...job,
        postedBy: hr._id,
        createdAt: new Date(postedAt),
        updatedAt: new Date(postedAt),
      }),
    );

    const created = await Job.insertMany(docs);
    console.log(`✅ Seeded ${created.length} jobs:`);
    for (const job of created) {
      console.log(`   - ${job.title} (${job._id})`);
    }
  } catch (err: any) {
    console.error("Error:", err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seedJobs();
