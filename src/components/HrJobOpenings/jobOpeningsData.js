// Static content from Figma 1921:3445 until there's an HR backend.

// Tabs and the status filter list these in this order. `tone` picks the
// HrStatusPill colours.
export const JOB_STATUSES = [
    { value: "published", label: "Published", tone: "success" },
    { value: "draft", label: "Draft", tone: "neutral" },
    { value: "on-hold", label: "On Hold", tone: "warning" },
    { value: "closed", label: "Closed", tone: "danger" },
];

export const jobOpenings = [
    { id: "JOB-101", title: "UI/UX Designer", department: "Design", type: "Full-time", vacancies: 1, applications: 11, closing: "05 Nov 2026", status: "published" },
    { id: "JOB-102", title: "Product Designer", department: "Design", type: "Full-time", vacancies: 2, applications: 11, closing: "20 Nov 2026", status: "published" },
    { id: "JOB-103", title: "Frontend Developer", department: "Engineering", type: "Contract", vacancies: 3, applications: 11, closing: "02 Nov 2026", status: "published" },
    { id: "JOB-104", title: "HR Executive", department: "People", type: "Full-time", vacancies: 1, applications: 11, closing: "01 Dec 2026", status: "on-hold" },
    { id: "JOB-105", title: "Business Analyst", department: "Product", type: "Full-time", vacancies: 2, applications: 10, closing: "30 Nov 2026", status: "published" },
    { id: "JOB-106", title: "Data Engineer", department: "Engineering", type: "Contract", vacancies: 3, applications: 10, closing: "15 Dec 2026", status: "draft" },
    { id: "JOB-107", title: "Frontend Developer", department: "Engineering", type: "Full-time", vacancies: 1, applications: 11, closing: "10 Oct 2026", status: "closed" },
];
