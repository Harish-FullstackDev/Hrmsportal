import ApplyShell from "@/components/Apply/ApplyShell";

// Header, banner and stepper stay mounted while the candidate moves between
// stages, and the in-progress application lives here.
export default function ApplyLayout({ children }) {
    return <ApplyShell>{children}</ApplyShell>;
}
