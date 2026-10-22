// Keeps the in-progress application across reloads in this browser tab:
// answers and progress go to sessionStorage, the resume file to IndexedDB
// (too large for sessionStorage). Everything is best-effort; if storage is
// unavailable the application simply lives in memory as before.

const KEY = "hrms-apply";
const DB_NAME = "hrms-apply";
const STORE = "files";

function openDb() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);
        request.onupgradeneeded = () => request.result.createObjectStore(STORE);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function withStore(mode, run) {
    const db = await openDb();
    try {
        return await new Promise((resolve, reject) => {
            const tx = db.transaction(STORE, mode);
            const request = run(tx.objectStore(STORE));
            tx.oncomplete = () => resolve(request?.result);
            tx.onerror = () => reject(tx.error);
        });
    } finally {
        db.close();
    }
}

// { stepData, maxVisited, resume } from a previous visit in this tab, or null.
// An application started for a different job is not restored.
export async function loadApplication(jobSlug) {
    try {
        const raw = sessionStorage.getItem(KEY);
        if (!raw) return null;
        const { jobSlug: savedFor, stepData = {}, maxVisited = 0, hasResume = false } = JSON.parse(raw);
        if (savedFor !== jobSlug) return null;
        const resume = hasResume ? await withStore("readonly", (store) => store.get(KEY)).catch(() => null) : null;
        return { stepData, maxVisited, resume: resume ?? null };
    } catch {
        return null;
    }
}

export function saveApplication({ jobSlug, stepData, maxVisited, hasResume }) {
    try {
        sessionStorage.setItem(KEY, JSON.stringify({ jobSlug, stepData, maxVisited, hasResume }));
    } catch {
        // Storage full or blocked: keep working in memory.
    }
}

export function saveResume(file) {
    withStore("readwrite", (store) => (file ? store.put(file, KEY) : store.delete(KEY))).catch(() => {});
}
