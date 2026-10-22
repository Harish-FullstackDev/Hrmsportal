// Job postings live in the Ascendus website's Supabase project (its admin
// panel manages the `jobs` table), not in the portal's own project, so they
// are read from that project's REST API. Server code only. Read-only: the
// publishable key is enough, since open jobs are public on the website.
// Plain fetch rather than supabase-js, whose client also opens a realtime
// socket that Node versions before 22 cannot create.
//
// Without JOBS_SUPABASE_URL / JOBS_SUPABASE_PUBLISHABLE_KEY every call
// returns no jobs, so the pages show their empty states.

// Slug of the job being applied for, set by /jobs/<slug>/apply and read by
// the /apply layout.
export const APPLY_JOB_COOKIE = "hrms-apply-job";

// Same shape as the website's src/lib/jobs.js, so the copied components work
// unchanged, plus `skills` for the apply flow's skills check (an optional
// text[] column; empty until the jobs table has it).
function mapJob(row) {
    return {
        slug: row.slug,
        jobCode: row.job_code ?? null,
        title: row.title,
        location: row.location,
        modeOfWork: row.mode_of_work,
        typeOfWork: row.type_of_work,
        experienceLevel: row.experience_level,
        categories: row.categories || [],
        aboutJob: row.about_job,
        responsibilities: row.responsibilities || [],
        qualifications: row.qualifications || [],
        skills: row.skills || [],
    };
}

// Open jobs matching the extra PostgREST `filters`, newest first.
async function fetchOpenJobs(filters = {}) {
    const url = process.env.JOBS_SUPABASE_URL;
    const key = process.env.JOBS_SUPABASE_PUBLISHABLE_KEY;
    if (!url || !key) {
        console.warn("JOBS_SUPABASE_URL / JOBS_SUPABASE_PUBLISHABLE_KEY are not set; no jobs will load.");
        return [];
    }

    const query = new URLSearchParams({ select: "*", status: "eq.Open", order: "posted_at.desc", ...filters });
    const response = await fetch(`${url}/rest/v1/jobs?${query}`, { headers: { apikey: key } });
    if (!response.ok) throw new Error(`Loading jobs failed: ${response.status} ${await response.text()}`);

    return (await response.json()).map(mapJob);
}

export function getAllJobs() {
    return fetchOpenJobs();
}

export async function getJobBySlug(slug) {
    const [job] = await fetchOpenJobs({ slug: `eq.${slug}`, limit: "1" });
    return job ?? null;
}

export function getOtherJobs(slug, limit = 3) {
    return fetchOpenJobs({ slug: `neq.${slug}`, limit: String(limit) });
}
