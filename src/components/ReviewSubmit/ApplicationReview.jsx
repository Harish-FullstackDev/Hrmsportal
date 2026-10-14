import { applyStepHref } from "@/components/Apply/applySteps";
import { ReviewField, ReviewGrid, ReviewSection, ReviewSkillLevels } from "@/components/ReviewSubmit/ReviewParts";

// Native date inputs store yyyy-mm-dd; the review shows dd/mm/yyyy.
const formatDate = (value) => (value ? value.split("-").reverse().join("/") : "");

// Figma 1403:11918: stage 6 of the application. One card per earlier stage,
// 32 apart, each echoing that stage's answers read-only. `data` is the apply
// context's stepData; missing stages show "Not provided".
export default function ApplicationReview({ resume, resumeUrl, role, data }) {
    const personal = data["personal-details"] ?? {};
    const experience = data["experience-and-education"] ?? {};
    const skills = data["skills-and-certifications"] ?? {};
    const availability = data["availability-and-compensation"] ?? {};

    return (
        <div className="flex w-full flex-col gap-8">
            <ReviewSection title="Upload Resume" editHref={applyStepHref(0)} className="flex h-[90px] items-center">
                {resume ? (
                    <a
                        href={resumeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="truncate text-lg leading-[1.2] font-medium text-[#374151] hover:text-action hover:underline"
                    >
                        {resume.name}
                    </a>
                ) : (
                    <p className="text-sm leading-5 text-hint">No resume uploaded</p>
                )}
            </ReviewSection>

            <ReviewSection title="Personal Details" editHref={applyStepHref(1)} className="pt-[38px] pb-[34px]">
                <ReviewGrid>
                    <ReviewField
                        label="First name"
                        required
                        value={personal.firstName}
                        hint="Names should match in both Aadhaar and UAN"
                    />
                    <ReviewField label="Last Name" required value={personal.lastName} />
                    <ReviewField label="Email address" required value={personal.email} />
                    <ReviewField label="Role" required value={role} />
                    <ReviewField label="Phone Number" value={personal.phone} kind="phone" />
                    <ReviewField label="LinkedIn Profile URL" required value={personal.linkedIn} />
                    <ReviewField label="Nationality" required value={personal.nationality} />
                    <ReviewField label="Country" required value={personal.country} kind="select" />
                    <ReviewField label="State" required value={personal.state} kind="select" />
                    <ReviewField label="City" required value={personal.city} />
                    <ReviewField label="Gender" required value={personal.gender} kind="select" />
                </ReviewGrid>
            </ReviewSection>

            <ReviewSection title="Experience and Education" editHref={applyStepHref(2)} className="pt-[38px] pb-[34px]">
                <ReviewGrid>
                    <ReviewField label="Current employment status" required value={experience.employmentStatus} kind="select" />
                    <ReviewField label="Total years of experience" required value={experience.totalExperience} kind="select" />
                    <ReviewField label="Relevant experience for this role" required value={experience.relevantExperience} kind="select" />
                    <ReviewField label="Current or most recent employer" required value={experience.employer} />
                    <ReviewField label="Current or most recent job title" required value={experience.jobTitle} />
                    <ReviewField label="Highest qualification" required value={experience.qualification} kind="select" />
                    <ReviewField label="Field of study" required value={experience.fieldOfStudy} />
                    <ReviewField label="University or college" required value={experience.university} kind="select" />
                    <ReviewField label="Year of graduation" required value={experience.graduationYear} kind="select" />
                    <ReviewField
                        label="What kind of work have you done most?"
                        required
                        value={experience.skills}
                        className="md:col-span-2 lg:col-span-3 lg:max-w-[417px]"
                    />
                </ReviewGrid>
            </ReviewSection>

            <ReviewSection title="Skills and Certifications" editHref={applyStepHref(3)} className="pt-[38px] pb-[34px]">
                <div className="flex w-full flex-col gap-6">
                    <dl className="w-full lg:max-w-[417px]">
                        <ReviewField label="Skills" required value={skills.skills} tone="muted" valueClassName="text-hint" />
                    </dl>
                    <ReviewSkillLevels levels={skills.roleSkills} />
                    <dl className="grid gap-5 md:grid-cols-2 lg:grid-cols-[417px_417px]">
                        <ReviewField
                            label="Certification"
                            required
                            value={skills.certifications}
                            tone="muted"
                            valueClassName="text-[#0284c7]"
                        />
                        <ReviewField
                            label="Portfolio, GitHub or Other Work link"
                            value={skills.portfolio}
                            tone="muted"
                            valueClassName="text-hint"
                        />
                    </dl>
                </div>
            </ReviewSection>

            <ReviewSection title="Availability and Compensation" editHref={applyStepHref(4)} className="pt-[38px] pb-[34px]">
                <ReviewGrid>
                    <ReviewField label="Notice period" required value={availability.noticePeriod} kind="select" />
                    <ReviewField label="Can your notice period be shortened?" required value={availability.canShorten} kind="select" />
                    <ReviewField label="Earliest start date" value={formatDate(availability.earliestStart)} kind="select" />
                    <ReviewField label="Last working day" required value={formatDate(availability.lastWorkingDay)} kind="select" />
                    <ReviewField label="Available from" required value={availability.availableFrom} kind="select" />
                    <ReviewField label="Willing to relocate to the job location" required value={availability.relocate} kind="select" />
                    <ReviewField label="Languages" value={availability.languages} />
                    <ReviewField label="Current or last drawn annual fixed salary" required value={availability.currentSalary} kind="select" />
                    <ReviewField label="Expected annual salary" required value={availability.expectedSalary} kind="select" />
                </ReviewGrid>
            </ReviewSection>
        </div>
    );
}
