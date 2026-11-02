// Labels for the HR applicants list (Figma 2060:2170). The applicants come
// from the database (listApplicationsForHr in src/lib/applications/queries.js).

// Every status an application can have (values match the
// application_status enum), in hiring order, with its swatch colour on the
// list. The side panel's stage menu offers all but "withdrawn", which only
// the candidate can choose.
export const APPLICANT_STATUSES = [
    { value: "applied", label: "Applied", swatch: "bg-primary-300" },
    { value: "screening", label: "Screening", swatch: "bg-warning-500" },
    { value: "shortlisted", label: "Shortlisted", swatch: "bg-primary-400" },
    { value: "assessment", label: "Assessment", swatch: "bg-muted-ink" },
    { value: "interviewing", label: "Interviewing", swatch: "bg-action" },
    { value: "offer", label: "Job Offer", swatch: "bg-info-500" },
    { value: "hired", label: "Hired", swatch: "bg-success-500" },
    { value: "rejected", label: "Rejected", swatch: "bg-required" },
    { value: "withdrawn", label: "Withdrawn", swatch: "bg-neutral-300" },
];

export const EMPLOYMENT_TYPES = ["Full-time", "Part-time", "Contract", "Internship"];

export const initialsOf = (name) =>
    name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join("");

// "Oct 28, 2026". Read in UTC so the server and the browser print the same day.
const dateFormat = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
export const formatAppliedOn = (isoDate) => dateFormat.format(new Date(`${isoDate}T00:00:00Z`));
