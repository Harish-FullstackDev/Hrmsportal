// Dropdown and suggestion lists for the experience-and-education stage. The
// design shows no lists, so these are starting points; replace them with
// backend data when it exists.
export const experienceRanges = [
    "Less than 1 year",
    "1–3 years",
    "3–5 years",
    "5–8 years",
    "8–12 years",
    "12+ years",
];

export const employmentStatuses = ["Employed", "Between jobs", "Freelancing", "Student", "Other"];

export const qualifications = [
    "High school",
    "Diploma",
    "Bachelor's degree",
    "Master's degree",
    "Doctorate",
    "Other",
];

const thisYear = new Date().getFullYear();
// Newest first: five years ahead (students) back to 1970.
export const graduationYears = Array.from({ length: thisYear + 5 - 1970 + 1 }, (_, i) => String(thisYear + 5 - i));

export const universities = [
    "Amrita Vishwa Vidyapeetham",
    "Anna University",
    "APJ Abdul Kalam Technological University",
    "Cochin University of Science and Technology",
    "Delhi University",
    "IIT Bombay",
    "IIT Delhi",
    "IIT Madras",
    "Indian Institute of Science",
    "King Abdulaziz University",
    "King Fahd University of Petroleum and Minerals",
    "King Saud University",
    "Mahatma Gandhi University",
    "Manipal Academy of Higher Education",
    "National Institute of Design",
    "NIT Calicut",
    "Srishti Manipal Institute",
    "University of Calicut",
    "University of Kerala",
    "VIT University",
];

export const skills = [
    "UI/UX",
    "Interaction design",
    "Visual design",
    "Layout",
    "Typography",
    "Design system",
    "Prototyping",
    "Wireframing",
    "User research",
    "Usability testing",
    "Information architecture",
    "Figma",
    "Accessibility",
    "Motion design",
    "Product strategy",
    "Design leadership",
    "Front-end development",
    "Manual testing",
];
