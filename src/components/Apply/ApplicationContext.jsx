"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

// Holds the in-progress application while the candidate moves between stages.
// It lives in the /apply layout, so it survives route changes between stages
// but not a full reload. Nothing is sent anywhere yet.
const ApplicationContext = createContext(null);

export function ApplicationProvider({ children }) {
    const [resume, setResume] = useState(null);
    // Form values per stage, keyed by the stage slug.
    const [stepData, setStepDataState] = useState({});

    // Object URL for opening the uploaded file; revoked when it changes.
    const resumeUrl = useMemo(() => (resume ? URL.createObjectURL(resume) : null), [resume]);
    useEffect(() => () => resumeUrl && URL.revokeObjectURL(resumeUrl), [resumeUrl]);

    const setStepData = useCallback((slug, data) => setStepDataState((all) => ({ ...all, [slug]: data })), []);

    const value = useMemo(
        () => ({ resume, resumeUrl, setResume, stepData, setStepData }),
        [resume, resumeUrl, stepData, setStepData],
    );

    return <ApplicationContext.Provider value={value}>{children}</ApplicationContext.Provider>;
}

export function useApplication() {
    const context = useContext(ApplicationContext);
    if (!context) throw new Error("useApplication must be used inside ApplicationProvider");
    return context;
}
