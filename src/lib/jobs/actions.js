"use server";

// HR Server Actions for job postings. Public endpoints like every Server
// Action: each checks the caller is HR and validates the input, and RLS
// checks the role again in the database.

import { updateTag } from "next/cache";

import { hrSession } from "@/lib/auth/hr";
import { JOBS_TAG } from "@/lib/jobs";
import { emptyJob, jobRow, todayIso, validateJob } from "@/lib/jobs/jobForm";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Creates a job (no `id`) or updates one, as a draft or published.
// Returns { ok: true, id } or { ok: false, error?, errors? } where `errors`
// are per-field messages.
export async function saveJob({ id, values, publish }) {
    const session = await hrSession();
    if (!session) return { ok: false, error: "Only HR can post jobs." };
    if (id !== undefined && (typeof id !== "string" || !UUID.test(id))) return { ok: false, error: "Job not found." };
    if (values === null || typeof values !== "object" || Array.isArray(values)) return { ok: false, error: "Check the form." };

    // Only the form's own fields are read.
    const clean = Object.fromEntries(Object.keys(emptyJob).map((key) => [key, values[key] ?? emptyJob[key]]));
    const errors = validateJob(clean, { publish: Boolean(publish), today: todayIso() });
    if (Object.keys(errors).length > 0) return { ok: false, errors };

    const row = { ...jobRow(clean), status: publish ? "published" : "draft" };
    const query = id
        ? session.supabase.from("jobs").update(row).eq("id", id)
        : session.supabase.from("jobs").insert(row);
    const { data, error } = await query.select("id").maybeSingle();
    if (error || !data) {
        console.error("saveJob:", error);
        return { ok: false, error: "The job couldn't be saved. Please try again." };
    }

    // The careers pages cache published jobs; show the change straight away.
    updateTag(JOBS_TAG);
    return { ok: true, id: data.id };
}
