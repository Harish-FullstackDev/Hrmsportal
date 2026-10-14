"use client";

import ApplyStage from "@/components/Apply/ApplyStage";
import ApplyStepFooter from "@/components/Apply/ApplyStepFooter";
import { applyStepHref } from "@/components/Apply/applySteps";
import useStageForm from "@/components/Apply/useStageForm";
import { jobDetails } from "@/components/JobDetails/jobDetailsData";
import SkillsCertificationsForm, {
    emptySkillsCertifications,
    validateSkillsCertifications,
} from "@/components/SkillsCertifications/SkillsCertificationsForm";

// Figma frame 1380:3503: stage 4 of 6. Next validates and moves to stage 5;
// Back keeps the entries and returns to stage 3.
const SkillsCertificationsPage = () => {
    const { values, errors, handleChange, handleBack, handleNext } = useStageForm({
        slug: "skills-and-certifications",
        initial: emptySkillsCertifications,
        validate: validateSkillsCertifications,
        nextIndex: 4,
        fieldIds: { skills: "roleSkillsPicker" },
    });

    return (
        <ApplyStage className="flex flex-col gap-12">
            <SkillsCertificationsForm
                values={values}
                errors={errors}
                onChange={handleChange}
                roleSkills={jobDetails.roleSkills}
            />
            <ApplyStepFooter backHref={applyStepHref(2)} onBack={handleBack} onNext={handleNext} />
        </ApplyStage>
    );
};

export default SkillsCertificationsPage;
