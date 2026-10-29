// Choices for the education-and-experience stage (Figma 1878:20839).

export const qualifications = ["Diploma", "Bachelor’s Degree", "Master’s Degree", "Others"];

export const experienceLevels = ["Fresher", "1 to 2", "3 to 4", "5 to 8", "8+"];

export const yesNo = ["Yes", "No"];

export const noticePeriods = ["15 Days", "30 Days", "45 Days", "60 Days", "90 Days", "More than 90 Days"];

export const shortenOptions = ["Yes", "No", "Not Sure"];

export const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

const thisYear = new Date().getFullYear();
// Newest first: five years ahead (students) back to 1970.
export const graduationYears = Array.from({ length: thisYear + 5 - 1970 + 1 }, (_, i) => String(thisYear + 5 - i));
// Newest first: this year back to 1970.
export const workYears = graduationYears.filter((year) => Number(year) <= thisYear);

// Suggestions for the skills picker on the next stage.
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
