"use server";

// Server Actions for applications. Like every Server Action these are public
// endpoints: each one checks who is calling and validates every input, and
// RLS (supabase/migrations/20261102000000_hiring.sql) checks again in the
// database.

import { hrSession } from "@/lib/auth/hr";
import { verifyRecaptcha } from "@/lib/recaptcha/verifyRecaptcha";
import { createClient } from "@/lib/supabase/server";

// The stage 5 documents a candidate can attach (UploadDocumentsForm's
// DOCUMENTS_LIST, which is client code and can't be imported here).
const DOCUMENT_FIELDS = new Set(["photograph", "signature", "idProof", "tenthMarksheet", "twelfthMarksheet", "degreeCertificate"]);

// Statuses HR can set ("withdrawn" is the candidate's own action). A
// "use server" file may only export async functions, so this stays private.
const APPLICATION_STATUSES = [
    "applied",
    "screening",
    "shortlisted",
    "assessment",
    "interviewing",
    "offer",
    "hired",
    "rejected",
];

const isPlainObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
const text = (value, max = 200) => (typeof value === "string" ? value.trim().slice(0, max) : "");

// A Storage path the caller uploaded: inside their own folder, no "..".
const ownPath = (path, userId) =>
    typeof path === "string" && path.length <= 300 && path.startsWith(`${userId}/`) && !path.includes("..");

const FAILED = { ok: false, error: "Your application couldn't be submitted. Please try again." };

// Submits the signed-in candidate's application for the published job
// `jobSlug`. `stepData` is the apply flow's answers by stage; the files were
// uploaded first (uploadApplicationFiles). Returns { ok: true, reference }
// or { ok: false, error, captcha? } (captcha: the reCAPTCHA must be redone).
export async function submitApplication({ jobSlug, captchaToken, stepData, phone, resumePath, resumeName, documentPaths }) {
    const check = await verifyRecaptcha(captchaToken);
    if (!check.ok) return { ok: false, error: check.error, captcha: true };

    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { ok: false, error: "Your session has ended. Please sign in again, then submit." };

    if (typeof jobSlug !== "string" || !isPlainObject(stepData) || !ownPath(resumePath, user.id)) return FAILED;
    const documents = {};
    for (const [field, path] of Object.entries(isPlainObject(documentPaths) ? documentPaths : {})) {
        if (!DOCUMENT_FIELDS.has(field) || !ownPath(path, user.id)) return FAILED;
        documents[field] = path;
    }

    // Answers are stored as given (they're shown back, never executed), but
    // kept to a sane size.
    const answers = JSON.parse(JSON.stringify(stepData));
    if (JSON.stringify(answers).length > 150_000) return FAILED;

    const personal = isPlainObject(answers["personal-details"]) ? answers["personal-details"] : {};
    const firstName = text(personal.firstName, 100);
    const lastName = text(personal.lastName, 100);
    const email = text(personal.email, 254);
    if (!firstName || !lastName || !email) return { ok: false, error: "Your name and email are missing. Check Personal Details." };

    const { data: job } = await supabase.from("jobs").select("id").eq("slug", jobSlug).eq("status", "published").maybeSingle();
    if (!job) return { ok: false, error: "This job is no longer open for applications." };

    const { data, error } = await supabase
        .from("applications")
        .insert({
            job_id: job.id,
            candidate_id: user.id,
            first_name: firstName,
            last_name: lastName,
            email,
            phone: text(phone, 30),
            answers,
            resume_path: resumePath,
            resume_name: text(resumeName, 200) || "Resume",
            documents,
        })
        .select("reference")
        .single();

    if (error) {
        if (error.code === "23505") return { ok: false, error: "You have already applied for this job." };
        console.error("submitApplication:", error);
        return FAILED;
    }
    return { ok: true, reference: data.reference };
}

// The signed-in candidate withdraws one of their open applications.
export async function withdrawApplication(applicationId) {
    if (typeof applicationId !== "string") return { ok: false, error: "Application not found." };
    const supabase = await createClient();
    const { error } = await supabase.rpc("withdraw_application", { application: applicationId });
    if (error) return { ok: false, error: "This application can no longer be withdrawn." };
    return { ok: true };
}

// HR moves an application to another status.
export async function updateApplicationStatus(applicationId, status) {
    const session = await hrSession();
    if (!session) return { ok: false, error: "Only HR can change an application's status." };
    if (typeof applicationId !== "string" || !APPLICATION_STATUSES.includes(status)) {
        return { ok: false, error: "That status isn't valid." };
    }

    const { data, error } = await session.supabase
        .from("applications")
        .update({ status })
        .eq("id", applicationId)
        .select("id")
        .maybeSingle();
    if (error || !data) return { ok: false, error: "The status couldn't be changed. Please try again." };
    return { ok: true };
}

// A short-lived link to an application's file (resume or a document), for HR
// or the candidate who uploaded it; Storage RLS decides which.
export async function applicationFileUrl(path) {
    if (typeof path !== "string" || path.length > 300 || path.includes("..")) return { ok: false };
    const supabase = await createClient();
    const { data, error } = await supabase.storage.from("applications").createSignedUrl(path, 300);
    if (error || !data) return { ok: false };
    return { ok: true, url: data.signedUrl };
}
