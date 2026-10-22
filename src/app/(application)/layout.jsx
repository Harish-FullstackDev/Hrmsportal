import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

// Every page in this group (dashboard, jobs, saved jobs, applications, apply)
// needs a signed-in user. proxy.js already redirects; this checks the session
// with Supabase on the server before anything renders, in case the proxy is
// skipped.
export default async function ApplicationLayout({ children }) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect("/"); // proxy.js normally redirects first, keeping ?next=

    return children;
}
