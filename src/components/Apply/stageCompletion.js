import { validateAvailabilityCompensation } from "@/components/AvailabilityCompensation/AvailabilityCompensationForm";
import { validateExperienceEducation } from "@/components/ExperienceEducation/ExperienceEducationForm";
import { validatePersonalDetails } from "@/components/PersonalDetails/PersonalDetailsForm";
import { validateSkillsCertifications } from "@/components/SkillsCertifications/SkillsCertificationsForm";
import { applySteps } from "@/components/Apply/applySteps";

// Each form stage's validator, by slug (called with the stage values and the
// Current Status chosen in stage 3).
const validators = {
    "personal-details": validatePersonalDetails,
    "experience-and-education": validateExperienceEducation,
    "skills-and-certifications": validateSkillsCertifications,
    "availability-and-compensation": validateAvailabilityCompensation,
};

// Whether stage `index` has saved, valid answers. Stage 1 needs a resume;
// the review stage has nothing to fill in.
export function isStageComplete(index, { resume, stepData }) {
    if (index === 0) return Boolean(resume);
    const slug = applySteps[index]?.slug;
    const validate = validators[slug];
    if (!validate) return true;
    const saved = stepData[slug];
    const status = stepData["experience-and-education"]?.employmentStatus;
    return Boolean(saved) && Object.keys(validate(saved, status)).length === 0;
}
