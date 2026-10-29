"use client";

import { useMemo, useSyncExternalStore } from "react";

// Saved jobs and submitted applications, kept in this browser until the
// candidate account has tables of its own (ported from the website's
// src/lib/candidateStorage.js). Storage can be blocked (private mode, site
// data cleared), so every read falls back to an empty list and every write is
// best effort. Components read through the hooks below, which re-render on
// every write here and on changes from other tabs.

const SAVED_JOBS_KEY = "hrms-saved-jobs";
const APPLICATIONS_KEY = "hrms-applications";

const listeners = new Set();

function subscribe(listener) {
    listeners.add(listener);
    window.addEventListener("storage", listener);
    return () => {
        listeners.delete(listener);
        window.removeEventListener("storage", listener);
    };
}

function readRaw(key) {
    try {
        return localStorage.getItem(key) ?? "[]";
    } catch {
        return "[]";
    }
}

function parseList(raw) {
    try {
        const list = JSON.parse(raw);
        return Array.isArray(list) ? list : [];
    } catch {
        return [];
    }
}

const readList = (key) => parseList(readRaw(key));

function writeList(key, list) {
    try {
        localStorage.setItem(key, JSON.stringify(list));
    } catch {
        // Storage blocked: nothing to keep the change in.
    }
    listeners.forEach((listener) => listener());
}

// The list under `key`, or null until it has been read in the browser.
function useStoredList(key) {
    const raw = useSyncExternalStore(
        subscribe,
        () => readRaw(key),
        () => null,
    );
    return useMemo(() => (raw === null ? null : parseList(raw)), [raw]);
}

export const useSavedJobSlugs = () => useStoredList(SAVED_JOBS_KEY);

export function setJobSaved(slug, saved) {
    const list = readList(SAVED_JOBS_KEY).filter((s) => s !== slug);
    writeList(SAVED_JOBS_KEY, saved ? [...list, slug] : list);
}

// Newest first. Each entry: { id, position, appliedAt (ISO), status,
// resumeName, portfolio, interview? }.
export const useApplications = () => useStoredList(APPLICATIONS_KEY);

export function applicationKey(application) {
    return application.id ?? application.appliedAt;
}

// For the apply flow's submit step. `reference` is the ID shown to the
// candidate (e.g. ASC-000123).
export function recordApplication({ id, reference, position, resumeName, portfolio }) {
    const entry = {
        id,
        reference,
        position,
        appliedAt: new Date().toISOString(),
        status: "Application Received",
        resumeName,
        portfolio,
    };
    writeList(APPLICATIONS_KEY, [entry, ...readList(APPLICATIONS_KEY)]);
}

// Contact details from the candidate's latest submitted application, shown on
// My Profile: { phone, location, jobTitle, employer }. The account itself
// only holds the name and email.
const PROFILE_KEY = "hrms-profile";

export function useProfile() {
    const raw = useSyncExternalStore(
        subscribe,
        () => readRaw(PROFILE_KEY),
        () => null,
    );
    return useMemo(() => {
        if (raw === null) return null;
        try {
            const profile = JSON.parse(raw);
            return profile && typeof profile === "object" && !Array.isArray(profile) ? profile : {};
        } catch {
            return {};
        }
    }, [raw]);
}

export function recordProfile(profile) {
    try {
        localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    } catch {
        // Storage blocked: nothing to keep the change in.
    }
    listeners.forEach((listener) => listener());
}

// Withdrawing only marks the entry, so it moves to the Withdrawn tab.
export function withdrawApplication(key) {
    const list = readList(APPLICATIONS_KEY).map((application) =>
        applicationKey(application) === key ? { ...application, status: "Withdrawn" } : application,
    );
    writeList(APPLICATIONS_KEY, list);
}
