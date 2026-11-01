// Static content from Figma 1983:7824 (list) and 1983:8726 (profile drawer)
// until there's an HR backend. Only the first candidate has profile details
// in the design; the drawer shows "Not provided" for the rest.

// Hiring stages in order; "Move to Next Stage" walks this list. Tabs show
// all of them; Closed is only in the status filter.
export const CANDIDATE_STAGES = [
    { value: "applied", label: "Applied", tone: "success" },
    { value: "screening", label: "Screening", tone: "brand" },
    { value: "shortlisted", label: "Shortlisted", tone: "warning" },
    { value: "interview", label: "Interview", tone: "brand" },
    { value: "assessment", label: "Assessment", tone: "neutral" },
    { value: "offer", label: "Offer", tone: "warning" },
    { value: "hired", label: "Hired", tone: "success" },
];

export const CLOSED = { value: "closed", label: "Closed", tone: "danger" };

export const CANDIDATE_STATUSES = [...CANDIDATE_STAGES, CLOSED];

export const candidates = [
    {
        id: "prithi-reddy",
        name: "Prithi Reddy",
        email: "sneha26@gmail.com",
        jobTitle: "UI/UX Designer",
        department: "Design",
        type: "Full-time",
        match: 87,
        status: "applied",
        phone: "+91 9810205894",
        background: "1 years in Engineering · B.Des / B.Tech · Certification: AWS",
        skills: ["React", "TypeScript", "CSS"],
        timeline: [{ label: "Applied", at: "29 Oct, 07:57" }],
    },
    { id: "arun-kumar", name: "Arun Kumar", email: "arunkumar26@gmail.com", jobTitle: "Product Designer", department: "Design", type: "Full-time", match: 90, status: "screening" },
    { id: "tharani-reddy", name: "Tharani Reddy", email: "tharanireddy@gmail.com", jobTitle: "HR Executive", department: "People", type: "Full-time", match: 82, status: "shortlisted" },
    { id: "karthik", name: "Karthik", email: "karthik@gmail.com", jobTitle: "Business Analyst", department: "Product", type: "Full-time", match: 90, status: "applied" },
    { id: "diya-reddy", name: "Diya Reddy", email: "diya@gmail.com", jobTitle: "Data Engineer", department: "Engineering", type: "Contract", match: 81, status: "assessment" },
    { id: "priya-menon", name: "Priya Menon", email: "priyamenon@gmail.com", jobTitle: "Frontend Developer", department: "Engineering", type: "Full-time", match: 75, status: "closed" },
];

export const initialsOf = (name) =>
    name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join("");
