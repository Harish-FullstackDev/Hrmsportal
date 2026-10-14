// The six stages of a job application, in order. Each stage is a route under
// /apply/<slug>. Labels keep Figma's two-line breaks.
export const applySteps = [
    { slug: "upload-resume", label: "Upload\nResume" },
    { slug: "personal-details", label: "Personal\nDetails" },
    { slug: "experience-and-education", label: "Experience and\nEducation" },
    { slug: "skills-and-certifications", label: "Skills and\nCertifications" },
    { slug: "availability-and-compensation", label: "Availability and\nCompensation" },
    { slug: "review-and-submit", label: "Review and\nSubmit" },
];

export const applyStepHref = (index) => `/apply/${applySteps[index].slug}`;
