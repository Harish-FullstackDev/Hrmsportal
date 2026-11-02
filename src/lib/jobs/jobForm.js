// The HR Create Job form's options and checks, shared by the form (to show
// errors as HR types) and the saveJob Server Action (which never trusts the
// browser). Plain module: no "use client" / "use server".

export const DEPARTMENTS = ["Design", "Engineering", "Marketing", "Sales", "Product", "Human Resources", "Finance", "Operations"];
export const EMPLOYMENT_TYPES = ["Full-time", "Contract", "Internship"];
export const WORK_MODES = ["On-site", "Hybrid", "Remote"];
export const EXPERIENCE_LEVELS = ["Fresher", "Experienced"];

export const MAX_JOB_SKILLS = 5;
export const MAX_LIST_ITEMS = 20;
export const MAX_OPENINGS = 999;

export const emptyJob = {
    title: "",
    department: "",
    employmentType: "Full-time",
    workMode: "On-site",
    openings: 1,
    summary: "",
    location: "",
    responsibilities: [""],
    qualifications: [""],
    closingDate: "",
    experienceLevel: "Fresher",
    minYears: "",
    skills: [],
};

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

const filled = (items) => (Array.isArray(items) ? items.map((item) => String(item).trim()).filter(Boolean) : []);

// Returns { field: message } for every invalid field; empty when valid.
// A draft only needs a title; publishing needs everything. `today` is an ISO
// date, passed in so callers decide when "today" is read.
export function validateJob(values, { publish, today }) {
    const errors = {};
    const title = String(values.title ?? "").trim();
    if (title.length < 2 || title.length > 120) errors.title = "Enter a job title (2–120 characters).";
    if (!publish) return errors;

    if (!DEPARTMENTS.includes(values.department)) errors.department = "Select a department.";
    if (!EMPLOYMENT_TYPES.includes(values.employmentType)) errors.employmentType = "Select an employment type.";
    if (!WORK_MODES.includes(values.workMode)) errors.workMode = "Select a work mode.";
    const openings = Number(values.openings);
    if (!Number.isInteger(openings) || openings < 1 || openings > MAX_OPENINGS) errors.openings = "Enter 1 to 999 openings.";

    const summary = String(values.summary ?? "").trim();
    if (summary.length < 20 || summary.length > 3000) errors.summary = "Write a summary of 20 to 3000 characters.";
    const location = String(values.location ?? "").trim();
    if (location.length < 2 || location.length > 120) errors.location = "Enter the job location.";

    for (const field of ["responsibilities", "qualifications"]) {
        const items = filled(values[field]);
        if (items.length === 0) errors[field] = "Add at least one.";
        else if (items.length > MAX_LIST_ITEMS) errors[field] = `Add at most ${MAX_LIST_ITEMS}.`;
        else if (items.some((item) => item.length > 300)) errors[field] = "Keep each one under 300 characters.";
    }

    if (!ISO_DATE.test(values.closingDate ?? "")) errors.closingDate = "Pick a closing date.";
    else if (values.closingDate < today) errors.closingDate = "The closing date can't be in the past.";

    if (!EXPERIENCE_LEVELS.includes(values.experienceLevel)) errors.experienceLevel = "Select an experience level.";
    if (values.experienceLevel === "Experienced") {
        const years = Number(values.minYears);
        if (values.minYears === "" || !Number.isInteger(years) || years < 1 || years > 50) {
            errors.minYears = "Enter the minimum years (1–50).";
        }
    }

    const skills = filled(values.skills);
    if (skills.length === 0) errors.skills = "Add at least one skill.";
    else if (skills.length > MAX_JOB_SKILLS || skills.some((skill) => skill.length > 50)) errors.skills = "Check the skills.";

    return errors;
}

// Form values to a jobs row (snake_case, lists cleaned).
export function jobRow(values) {
    const experienced = values.experienceLevel === "Experienced";
    return {
        title: String(values.title ?? "").trim(),
        department: DEPARTMENTS.includes(values.department) ? values.department : "",
        type_of_work: EMPLOYMENT_TYPES.includes(values.employmentType) ? values.employmentType : "Full-time",
        mode_of_work: WORK_MODES.includes(values.workMode) ? values.workMode : "",
        vacancies: Math.min(MAX_OPENINGS, Math.max(1, Number.parseInt(values.openings, 10) || 1)),
        about_job: String(values.summary ?? "").trim().slice(0, 3000),
        location: String(values.location ?? "").trim().slice(0, 120),
        responsibilities: filled(values.responsibilities).slice(0, MAX_LIST_ITEMS),
        qualifications: filled(values.qualifications).slice(0, MAX_LIST_ITEMS),
        closes_on: ISO_DATE.test(values.closingDate ?? "") ? values.closingDate : null,
        experience_level: EXPERIENCE_LEVELS.includes(values.experienceLevel) ? values.experienceLevel : "",
        min_experience_years: experienced && values.minYears !== "" ? Number.parseInt(values.minYears, 10) || null : null,
        skills: filled(values.skills).slice(0, MAX_JOB_SKILLS),
    };
}

// A jobs row back to form values, for editing.
export function jobValues(row) {
    const list = (items) => (items?.length ? items : [""]);
    return {
        title: row.title ?? "",
        department: row.department ?? "",
        employmentType: row.type_of_work || "Full-time",
        workMode: row.mode_of_work || "On-site",
        openings: row.vacancies ?? 1,
        summary: row.about_job ?? "",
        location: row.location ?? "",
        responsibilities: list(row.responsibilities),
        qualifications: list(row.qualifications),
        closingDate: row.closes_on ?? "",
        experienceLevel: row.experience_level || "Fresher",
        minYears: row.min_experience_years == null ? "" : String(row.min_experience_years),
        skills: row.skills ?? [],
    };
}

// Today in India (where Ascendus hires), as an ISO date.
export const todayIso = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());
