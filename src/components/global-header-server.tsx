import { createClient } from "@/lib/supabase/server";
import { GlobalHeader } from "./global-header";

export async function GlobalHeaderServer() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        // No user, render header without community name
        return <GlobalHeader communityName={null} />;
    }

    // Fetch user's group (for MVP, just get the first group)
    const { data: groups } = await supabase
        .from("groups")
        .select("id, name")
        .limit(1);

    const communityName = groups?.[0]?.name || null;

    return <GlobalHeader communityName={communityName} />;
}
