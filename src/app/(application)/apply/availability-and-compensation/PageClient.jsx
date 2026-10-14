"use client";

import { useApplication } from "@/components/Apply/ApplicationContext";
import ApplyStage from "@/components/Apply/ApplyStage";
import ApplyStepFooter from "@/components/Apply/ApplyStepFooter";
import { applyStepHref } from "@/components/Apply/applySteps";
import useStageForm from "@/components/Apply/useStageForm";
import AvailabilityCompensationForm, {
    emptyAvailabilityCompensation,
    validateAvailabilityCompensation,
} from "@/components/AvailabilityCompensation/AvailabilityCompensationForm";

// Figma frame 1380:3724 (+ status variants): stage 5 of 6. The fields follow
// the Current Status chosen in stage 3. Next validates and moves to the
// review stage; Back keeps the entries and returns to stage 4.
const AvailabilityCompensationPage = () => {
    const { stepData } = useApplication();
    const status = stepData["experience-and-education"]?.employmentStatus;
    const { values, errors, handleChange, handleBack, handleNext } = useStageForm({
        slug: "availability-and-compensation",
        initial: emptyAvailabilityCompensation,
        validate: (current) => validateAvailabilityCompensation(current, status),
        nextIndex: 5,
    });

    return (
        <ApplyStage className="flex flex-col gap-12">
            <AvailabilityCompensationForm values={values} errors={errors} onChange={handleChange} status={status} />
            <ApplyStepFooter backHref={applyStepHref(3)} onBack={handleBack} onNext={handleNext} />
        </ApplyStage>
    );
};

export default AvailabilityCompensationPage;
