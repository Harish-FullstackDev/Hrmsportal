import { headers } from "next/headers";

import { emailButton, emailDetails, escapeHtml, renderHtml, send } from "./mailer";

// Emails for the hiring flow: the candidate's "application received"
// confirmation and the HR team's "job published" notice. Server code only;
// call these from a Server Action inside after() so a slow or failing mail
// server never holds up (or fails) the action itself.

// The site's address for links in the email, from the request that triggered
// it (Next checks a Server Action's Origin against its Host). Null when
// there isn't one; the email then has no button.
export async function requestOrigin() {
    const origin = (await headers()).get("origin");
    return origin && /^https?:\/\/[^/\s]+$/.test(origin) ? origin : null;
}

const formatDate = (iso) =>
    iso
        ? new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(
              new Date(`${iso}T00:00:00Z`),
          )
        : "";

const nowInIndia = () =>
    new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone: "Asia/Kolkata",
    }).format(new Date());

const textDetails = (rows) =>
    rows
        .filter(([, value]) => value)
        .map(([label, value]) => `${label}: ${value}`)
        .join("\n");

// To the candidate, once their application is saved. `job` is a jobs row
// (title, department, location, type_of_work).
export async function sendApplicationReceivedEmail({ email, firstName, reference, job, origin }) {
    const rows = [
        ["Reference", reference],
        ["Position", job.title],
        ["Department", job.department],
        ["Location", job.location],
        ["Employment type", job.type_of_work],
        ["Submitted", `${nowInIndia()} IST`],
    ];
    const link = origin ? `${origin}/my-applications` : null;
    const outro =
        "Our team reviews every application and will contact you if your profile matches the role. " +
        "You can follow its status or withdraw it from My Applications. If you didn't apply, reply to this email.";

    await send({
        to: email,
        subject: `Application received: ${job.title} (${reference})`,
        text:
            `Hi ${firstName},\n\n` +
            `Thank you for applying for ${job.title} at Ascendus. We have received your application.\n\n` +
            `${textDetails(rows)}\n\n` +
            `${link ? `Track your application: ${link}\n\n` : ""}${outro}`,
        html: renderHtml({
            title: "Application received",
            intro:
                `Hi ${escapeHtml(firstName)},<br><br>Thank you for applying for <strong>${escapeHtml(job.title)}</strong> at Ascendus. ` +
                "We have received your application.",
            middle: emailDetails(rows) + (link ? `<div style="padding-top:24px;">${emailButton(link, "View My Applications")}</div>` : ""),
            outro,
        }),
        devLine: `application-received email to ${email} for ${reference} (${job.title})`,
    });
}

// To every HR account (BCC), when a job goes live on the careers site.
// `job` is a jobs row; `publishedBy` is the HR profile that published it.
export async function sendJobPublishedEmail({ recipients, job, publishedBy, origin }) {
    if (recipients.length === 0) return;
    const by = [publishedBy?.first_name, publishedBy?.last_name].filter(Boolean).join(" ") || publishedBy?.email || "";
    const rows = [
        ["Job ID", job.job_code],
        ["Position", job.title],
        ["Department", job.department],
        ["Location", job.location],
        ["Employment type", job.type_of_work],
        ["Work mode", job.mode_of_work],
        ["Openings", job.vacancies ? String(job.vacancies) : ""],
        ["Closes on", formatDate(job.closes_on)],
        ["Published by", by],
        ["Published", `${nowInIndia()} IST`],
    ];
    const jobLink = origin && job.slug ? `${origin}/jobs/${encodeURIComponent(job.slug)}` : null;
    const hrLink = origin ? `${origin}/hr/job-openings` : null;
    const outro = "You're receiving this because you have an HR account on the Ascendus Careers Portal.";

    await send({
        bcc: recipients,
        subject: `Job published: ${job.title} (${job.job_code})`,
        text:
            `${job.title} (${job.job_code}) is now live on the careers site and taking applications.\n\n` +
            `${textDetails(rows)}\n\n` +
            `${jobLink ? `View the posting: ${jobLink}\n` : ""}${hrLink ? `Manage job openings: ${hrLink}\n` : ""}\n${outro}`,
        html: renderHtml({
            title: "Job published",
            intro: `<strong>${escapeHtml(job.title)}</strong> (${escapeHtml(job.job_code)}) is now live on the careers site and taking applications.`,
            middle:
                emailDetails(rows) +
                (jobLink ? `<div style="padding-top:24px;">${emailButton(jobLink, "View Posting")}</div>` : "") +
                (hrLink
                    ? `<div style="padding-top:12px;font-size:13px;"><a href="${escapeHtml(hrLink)}" style="color:#0061af;">Manage job openings</a></div>`
                    : ""),
            outro,
        }),
        devLine: `job-published email to ${recipients.length} HR account(s) for ${job.job_code} (${job.title})`,
    });
}

// Runs an email send without letting its failure reach the caller.
export async function sendQuietly(label, sendEmail) {
    try {
        await sendEmail();
    } catch (error) {
        console.error(`${label} email failed:`, error);
    }
}
