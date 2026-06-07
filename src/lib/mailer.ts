import nodemailer from 'nodemailer'
import { connectDB } from './mongodb'
import Job from '@/models/Job'

const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST,
  port:   Number(process.env.SMTP_PORT ?? 465),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

// Always use production URL in emails, never localhost
const SITE_URL = process.env.NEXTAUTH_URL?.includes('localhost')
  ? 'https://careers-rookie-ninja.vercel.app'
  : process.env.NEXTAUTH_URL

export async function notifyHR({
  applicantName,
  applicantEmail,
  jobId,
}: {
  applicantName: string
  applicantEmail: string
  jobId: string
}) {
  try {
    await connectDB()
    const job = await Job.findById(jobId).lean() as any
    if (!job) return

    await transporter.sendMail({
      from:    `"Rookie Ninja Careers" <onboarding@resend.dev>`,
      to:      process.env.HR_EMAIL,
      subject: `New application — ${job.title}`,
      html: `
        <p>Hi HR team,</p>
        <p><strong>${applicantName}</strong> (${applicantEmail}) has applied for <strong>${job.title}</strong>.</p>
        <p><a href="${SITE_URL}/dashboard/hr/applications?jobId=${jobId}">View application →</a></p>
      `,
    })
  } catch (err: any) {
    console.error('notifyHR error:', err.message)
  }
}

export async function notifyApplicant({
  to,
  name,
  jobTitle,
  status,
}: {
  to: string
  name: string
  jobTitle: string
  status: string
}) {
  try {
    const statusMessages: Record<string, string> = {
      shortlisted: 'Great news — you have been shortlisted!',
      hired:       'Congratulations — you have been selected!',
      rejected:    'Thank you for applying. Unfortunately you were not selected this time.',
    }

    const message = statusMessages[status]
    if (!message) return

    await transporter.sendMail({
      from:    `"Rookie Ninja Careers" <onboarding@resend.dev>`,
      to:      process.env.HR_EMAIL!,
      subject: `Your application for ${jobTitle} — update`,
      html: `
        <p>Hi ${name},</p>
        <p>${message}</p>
        <p>Role: <strong>${jobTitle}</strong></p>
        <p><a href="${SITE_URL}/dashboard/seeker">View your applications →</a></p>
        <br/>
        <p>— Rookie Ninja Careers Team</p>
      `,
    })
  } catch (err: any) {
    console.error('notifyApplicant error:', err.message)
  }
}