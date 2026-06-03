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
        <div style="font-family:sans-serif;max-width:520px;margin:auto">
          <h2 style="color:#15A7DC">New Application Received</h2>
          <p><strong>${applicantName}</strong> (${applicantEmail}) has applied for <strong>${job.title}</strong>.</p>
          <a href="${process.env.NEXTAUTH_URL}/dashboard/hr/applications?jobId=${jobId}"
             style="display:inline-block;background:#15A7DC;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;margin-top:12px">
            View application →
          </a>
        </div>
      `,
    })
    console.log(`HR notified for application to ${job.title}`)
  } catch (err: any) {
    console.error('notifyHR error:', err.message)
  }
}

const STATUS_MESSAGES: Record<string, { subject: string; heading: string; body: string; color: string }> = {
  shortlisted: {
    subject: `You've been shortlisted!`,
    heading: `Great news — you've been shortlisted! 🎉`,
    body:    `Our team was impressed with your profile and would like to move forward with your application.`,
    color:   '#15A7DC',
  },
  hired: {
    subject: `Congratulations — you're hired!`,
    heading: `You got the job! 🎊`,
    body:    `We're thrilled to offer you the position. Our team will be in touch shortly with next steps.`,
    color:   '#34D399',
  },
  rejected: {
    subject: `Update on your application`,
    heading: `Thank you for applying`,
    body:    `After careful consideration, we've decided to move forward with other candidates. We appreciate your interest and encourage you to apply for future openings.`,
    color:   '#8A9BB0',
  },
  pending: {
    subject: `Your application is under review`,
    heading: `Application received`,
    body:    `Your application is currently under review. We'll get back to you soon.`,
    color:   '#FBBF24',
  },
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
    const msg = STATUS_MESSAGES[status]
    if (!msg) return

    await transporter.sendMail({
      from:    `"Rookie Ninja Careers" <onboarding@resend.dev>`,
      to:      process.env.NODE_ENV === 'production' ? to : process.env.HR_EMAIL!,
      subject: `${msg.subject} — ${jobTitle}`,
      html: `
        <div style="font-family:sans-serif;max-width:520px;margin:auto;background:#0D1520;color:#EDF2F7;padding:32px;border-radius:12px">
          <div style="margin-bottom:24px">
            <span style="background:#15A7DC;color:#fff;font-size:12px;font-weight:600;padding:4px 12px;border-radius:99px;letter-spacing:0.05em;text-transform:uppercase">
              Rookie Ninja Careers
            </span>
          </div>
          <h2 style="color:${msg.color};margin-bottom:8px">${msg.heading}</h2>
          <p style="color:#8A9BB0;margin-bottom:16px">Hi ${name},</p>
          <p style="color:#EDF2F7;margin-bottom:8px">
            Here's an update on your application for <strong style="color:${msg.color}">${jobTitle}</strong>:
          </p>
          <p style="color:#8A9BB0;line-height:1.7">${msg.body}</p>
          <a href="${process.env.NEXTAUTH_URL}/dashboard/seeker"
             style="display:inline-block;background:${msg.color};color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;margin-top:24px;font-weight:600">
            View my applications →
          </a>
          <p style="color:#4A5A6E;font-size:12px;margin-top:32px;border-top:1px solid #162234;padding-top:16px">
            Rookie Ninja · careers.rookie-ninja.com
          </p>
        </div>
      `,
    })
    console.log(`Notified ${to} — status: ${status} for ${jobTitle}`)
  } catch (err: any) {
    console.error('notifyApplicant error:', err.message)
  }
}

export async function notifyApplicantConfirmation({
  to,
  name,
  jobTitle,
  department,
}: {
  to: string
  name: string
  jobTitle: string
  department: string
}) {
  try {
    await transporter.sendMail({
      from:    `"Rookie Ninja Careers" <onboarding@resend.dev>`,
      to: process.env.RESEND_VERIFIED_DOMAIN === 'true' ? to : process.env.HR_EMAIL!,
      subject: `Application received — ${jobTitle}`,
      html: `
        <div style="font-family:sans-serif;max-width:520px;margin:auto;background:#0D1520;color:#EDF2F7;padding:32px;border-radius:12px">
          <div style="margin-bottom:24px">
            <span style="background:#15A7DC;color:#fff;font-size:12px;font-weight:600;padding:4px 12px;border-radius:99px;letter-spacing:0.05em;text-transform:uppercase">
              Rookie Ninja Careers
            </span>
          </div>
          <h2 style="color:#15A7DC;margin-bottom:8px">Application received! 🎉</h2>
          <p style="color:#8A9BB0;margin-bottom:16px">Hi ${name},</p>
          <p style="color:#EDF2F7;margin-bottom:8px">
            Thank you for applying for <strong style="color:#15A7DC">${jobTitle}</strong> in the <strong>${department}</strong> department at Rookie Ninja.
          </p>
          <p style="color:#8A9BB0;line-height:1.7;margin-bottom:24px">
            We have received your application and our team will review it shortly. We'll get back to you with an update as soon as possible.
          </p>
          <a href="${process.env.NEXTAUTH_URL}/dashboard/seeker"
             style="display:inline-block;background:#15A7DC;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:600">
            View my applications →
          </a>
          <p style="color:#4A5A6E;font-size:12px;margin-top:32px;border-top:1px solid #162234;padding-top:16px">
            Rookie Ninja · careers.rookie-ninja.com
          </p>
        </div>
      `,
    })
    console.log(`Confirmation sent to ${to}`)
  } catch (err: any) {
    console.error('notifyApplicantConfirmation error:', err.message)
  }
}