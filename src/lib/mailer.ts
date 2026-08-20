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
  ? 'https://careers.rookie-ninja.com'
  : process.env.NEXTAUTH_URL

function baseTemplate({
  badge,
  headline,
  body,
  metaRows,
  ctaText,
  ctaUrl,
}: {
  badge: string
  headline: string
  body: string
  metaRows?: { label: string; value: string; accent?: boolean }[]
  ctaText: string
  ctaUrl: string
}) {
  const metas = metaRows
    ? metaRows
        .map(
          (r) =>
            `<tr>
              <td style="padding:4px 0;font-size:13px;color:#6B7280;width:80px;">${r.label}</td>
              <td style="padding:4px 0;font-size:13px;font-weight:600;color:${r.accent ? '#15A7DC' : '#0D1520'};">${r.value}</td>
            </tr>`
        )
        .join('')
    : ''

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#e8edf2;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#e8edf2;padding:32px 16px;">
    <tr><td align="center">
      <table width="480" cellpadding="0" cellspacing="0" style="max-width:480px;width:100%;border-radius:10px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.10);">

        <!-- Header -->
        <tr>
          <td style="background:#0D1520;padding:24px 32px;">
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="width:34px;height:34px;background:#15A7DC;border-radius:6px;text-align:center;vertical-align:middle;">
                  <span style="font-size:11px;font-weight:800;color:#ffffff;letter-spacing:0.05em;">RN</span>
                </td>
                <td style="padding-left:10px;">
                  <div style="font-size:13px;font-weight:600;color:#ffffff;">Rookie Ninja Careers</div>
                  <div style="font-size:11px;color:rgba(255,255,255,0.45);">careers@rookie-ninja.com</div>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="background:#ffffff;padding:32px;">
            <div style="display:inline-block;background:#EFF9FD;color:#15A7DC;font-size:11px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;padding:4px 10px;border-radius:4px;margin-bottom:16px;">${badge}</div>
            <h1 style="margin:0 0 12px;font-size:20px;font-weight:700;color:#0D1520;line-height:1.3;">${headline}</h1>
            <p style="margin:0 0 24px;font-size:14px;color:#4B5563;line-height:1.6;">${body}</p>

            ${
              metas
                ? `<hr style="border:none;border-top:1px solid #F0F2F5;margin-bottom:20px;">
                   <table cellpadding="0" cellspacing="0" style="margin-bottom:24px;">${metas}</table>`
                : ''
            }

            <a href="${ctaUrl}" style="display:inline-block;background:#0D1520;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:6px;font-size:13px;font-weight:600;">${ctaText}</a>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#F9FAFB;padding:16px 32px;border-top:1px solid #E5E7EB;">
            <p style="margin:0;font-size:11px;color:#9CA3AF;">© ${new Date().getFullYear()} Rookie Ninja &nbsp;·&nbsp; careers.rookie-ninja.com</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

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
      from:    `"Rookie Ninja Careers" <careers@rookie-ninja.com>`,
      to:      process.env.HR_EMAIL,
      subject: `New application — ${job.title}`,
      html: baseTemplate({
        badge:    'New Application',
        headline: `${applicantName} has applied`,
        body:     `A new application has been submitted for the role below. Review it in your dashboard to take action.`,
        metaRows: [
          { label: 'Applicant', value: applicantName },
          { label: 'Email',     value: applicantEmail },
          { label: 'Role',      value: job.title },
        ],
        ctaText: 'View application →',
        ctaUrl:  `${SITE_URL}/dashboard/hr/applications?jobId=${jobId}`,
      }),
    })
  } catch (err: any) {
    console.error('notifyHR error:', err.message)
  }
}

export async function notifyApplicantConfirmation({
  to,
  name,
  jobTitle,
}: {
  to: string
  name: string
  jobTitle: string
}) {
  try {
    await transporter.sendMail({
      from:    `"Rookie Ninja Careers" <careers@rookie-ninja.com>`,
      to,
      subject: `Application received — ${jobTitle}`,
      html: baseTemplate({
        badge:    'Application Received',
        headline: 'We\'ve received your application!',
        body:     `Hi ${name}, thank you for applying at Rookie Ninja. Our team will carefully review your profile and get back to you with an update soon.`,
        metaRows: [
          { label: 'Role', value: jobTitle },
          { label: 'Status', value: 'Under Review', accent: true },
        ],
        ctaText: 'Track your application →',
        ctaUrl:  `${SITE_URL}/dashboard/seeker`,
      }),
    })
  } catch (err: any) {
    console.error('notifyApplicantConfirmation error:', err.message)
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
    const statusConfig: Record<string, { badge: string; headline: string; body: string; label: string }> = {
      shortlisted: {
        badge:    'Application Update',
        headline: 'You\'ve been shortlisted!',
        body:     `Hi ${name}, great news — your application stood out and you've been shortlisted. Our team was impressed and will be in touch with next steps shortly.`,
        label:    'Shortlisted',
      },
      hired: {
        badge:    'Application Update',
        headline: 'Congratulations — you\'ve been selected!',
        body:     `Hi ${name}, we're thrilled to let you know that you've been selected for the role. Our team will reach out to you very soon with further details.`,
        label:    'Selected',
      },
      rejected: {
        badge:    'Application Update',
        headline: 'Thank you for applying',
        body:     `Hi ${name}, we appreciate the time you took to apply at Rookie Ninja. After careful consideration, we've decided to move forward with other candidates for this role. We encourage you to apply for future openings.`,
        label:    'Not Selected',
      },
    }

    const config = statusConfig[status]
    if (!config) return

    await transporter.sendMail({
      from:    `"Rookie Ninja Careers" <careers@rookie-ninja.com>`,
      to,
      subject: `Your application for ${jobTitle} — update`,
      html: baseTemplate({
        badge:    config.badge,
        headline: config.headline,
        body:     config.body,
        metaRows: [
          { label: 'Role',   value: jobTitle },
          { label: 'Status', value: config.label, accent: status !== 'rejected' },
        ],
        ctaText: 'View your applications →',
        ctaUrl:  `${SITE_URL}/dashboard/seeker`,
      }),
    })
  } catch (err: any) {
    console.error('notifyApplicant error:', err.message)
  }
}
