import HrShell from "@/components/HrShell/HrShell";

// HR pages share the sidebar and top bar. The signed-in check comes from the
// (application) layout above.
export default function HrLayout({ children }) {
    return <HrShell>{children}</HrShell>;
}
