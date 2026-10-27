// The candidate's "Current Status" (chosen on the experience stage) decides
// which fields the experience and availability stages ask for. Field lists
// are in Figma's order: experience 1403:12239 (none chosen), 1403:12986
// (Current Employee), 1403:12598 (Serving Notice), 1403:12792 (Between Jobs),
// 1403:12414 (Recent Graduate); availability 1419:13645 / 1403:11685
// (employed / serving notice), 1419:13838 (between jobs), 1419:14081
// (recent graduate).

export const STATUS = {
    employee: "Currently employed",
    servingNotice: "Serving Notice",
    betweenJobs: "Not Currently employed",
    graduate: "Freshers",
};

export const statusOptions = Object.values(STATUS);

const WORKED_EXPERIENCE = [
    "employmentStatus",
    "totalExperience",
    "relevantExperience",
    "employer",
    "jobTitle",
    "qualification",
    "fieldOfStudy",
    "university",
    "graduationYear",
];

const EXPERIENCE_FIELDS = {
    [STATUS.employee]: WORKED_EXPERIENCE,
    [STATUS.servingNotice]: WORKED_EXPERIENCE,
    [STATUS.betweenJobs]: WORKED_EXPERIENCE,
    [STATUS.graduate]: ["employmentStatus", "qualification", "fieldOfStudy", "university", "graduationYear", "internships"],
};
// Before a status is chosen (Figma's default frame).
const DEFAULT_EXPERIENCE = ["employmentStatus", "totalExperience", "qualification", "fieldOfStudy", "university", "graduationYear"];

const EMPLOYED_AVAILABILITY = [
    "noticePeriod",
    "canShorten",
    "earliestStart",
    "lastWorkingDay",
    "availableFrom",
    "relocate",
    "languages",
    "currentSalary",
    "expectedSalary",
];

const AVAILABILITY_FIELDS = {
    [STATUS.employee]: EMPLOYED_AVAILABILITY,
    [STATUS.servingNotice]: EMPLOYED_AVAILABILITY,
    [STATUS.betweenJobs]: [
        "canShorten",
        "earliestStart",
        "availableFrom",
        "languages",
        "currentSalary",
        "expectedSalary",
        "relocate",
    ],
    [STATUS.graduate]: ["availableFrom", "languages", "expectedSalary", "relocate"],
};

export const experienceFieldsFor = (status) => EXPERIENCE_FIELDS[status] ?? DEFAULT_EXPERIENCE;

// No status (e.g. stage 3 skipped) falls back to the full employed set.
export const availabilityFieldsFor = (status) => AVAILABILITY_FIELDS[status] ?? EMPLOYED_AVAILABILITY;
