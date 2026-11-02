// Static applicants for the HR applicants list (Figma 2060:2170) until there's
// an HR backend.

// Every status an application can have, in hiring order, with its swatch
// colour on the list. The side panel's stage menu offers all of them.
export const APPLICANT_STATUSES = [
    { value: "screening", label: "Screening", swatch: "bg-warning-500" },
    { value: "shortlisted", label: "Shortlisted", swatch: "bg-primary-400" },
    { value: "assessment", label: "Assessment", swatch: "bg-muted-ink" },
    { value: "interviewing", label: "Interviewing", swatch: "bg-action" },
    { value: "offer", label: "Job Offer", swatch: "bg-info-500" },
    { value: "hired", label: "Hired", swatch: "bg-success-500" },
    { value: "rejected", label: "Rejected", swatch: "bg-required" },
];

// The stages that get their own tab, after "All Applicants".
export const APPLICANT_TABS = ["screening", "shortlisted", "interviewing", "offer"];

export const EMPLOYMENT_TYPES = ["Full-time", "Part-time", "Contract", "Internship"];

// `appliedOn` is an ISO date (YYYY-MM-DD).
export const applicants = [
    { id: "alex-boide", name: "Alex Boide", email: "a.boide@hirezy.com", role: "Software Engineer", appliedOn: "2026-10-28", type: "Full-time", status: "interviewing", resume: "Resume_AlexBoide.pdf" },
    { id: "alice-johnson", name: "Alice Johnson", email: "a.johnson@hirezy.com", role: "HR Specialist", appliedOn: "2026-10-24", type: "Contract", status: "screening", resume: "Resume_AliceJohnson.pdf" },
    { id: "rahul-mehta", name: "Rahul Mehta", email: "r.mehta@hirezy.com", role: "Data Analyst", appliedOn: "2026-10-21", type: "Full-time", status: "rejected", resume: "Resume_RahulMehta.pdf" },
    { id: "sara-thomas", name: "Sara Thomas", email: "s.thomas@hirezy.com", role: "HR Specialist", appliedOn: "2026-10-18", type: "Contract", status: "hired", resume: "Resume_SaraThomas.pdf" },
    { id: "vikram-iyer", name: "Vikram Iyer", email: "v.iyer@hirezy.com", role: "Software Engineer", appliedOn: "2026-10-15", type: "Full-time", status: "assessment", resume: "Resume_VikramIyer.pdf" },
    { id: "meera-nair", name: "Meera Nair", email: "m.nair@hirezy.com", role: "UI/UX Designer", appliedOn: "2026-10-09", type: "Full-time", status: "shortlisted", resume: "Resume_MeeraNair.pdf" },
    { id: "daniel-raj", name: "Daniel Raj", email: "d.raj@hirezy.com", role: "Product Manager", appliedOn: "2026-10-02", type: "Full-time", status: "offer", resume: "Resume_DanielRaj.pdf" },
    { id: "priya-menon", name: "Priya Menon", email: "p.menon@hirezy.com", role: "Frontend Developer", appliedOn: "2026-09-26", type: "Internship", status: "screening", resume: "Resume_PriyaMenon.pdf" },
    { id: "arun-kumar", name: "Arun Kumar", email: "a.kumar@hirezy.com", role: "UI/UX Designer", appliedOn: "2026-09-19", type: "Part-time", status: "interviewing", resume: "Resume_ArunKumar.pdf" },
    { id: "diya-reddy", name: "Diya Reddy", email: "d.reddy@hirezy.com", role: "Data Analyst", appliedOn: "2026-09-08", type: "Contract", status: "shortlisted", resume: "Resume_DiyaReddy.pdf" },
    { id: "karthik-s", name: "Karthik S", email: "k.s@hirezy.com", role: "Product Manager", appliedOn: "2026-08-27", type: "Full-time", status: "screening", resume: "Resume_KarthikS.pdf" },
    { id: "tharani-reddy", name: "Tharani Reddy", email: "t.reddy@hirezy.com", role: "Frontend Developer", appliedOn: "2026-08-14", type: "Full-time", status: "rejected", resume: "Resume_TharaniReddy.pdf" },
];

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
