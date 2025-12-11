"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type ActionState = {
  success: boolean;
  message: string;
} | null;

export async function createEvent(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      message: "You must be logged in to create an event.",
    };
  }

  const title = formData.get("title") as string;
  const topic = formData.get("topic") as string;
  const eventDate = formData.get("event_date") as string;
  const location = formData.get("location") as string;

  if (!title || !eventDate) {
    return {
      success: false,
      message: "Title and date are required.",
    };
  }

  const { error } = await supabase.from("events").insert({
    user_id: user.id,
    title,
    topic: topic || null,
    event_date: eventDate,
    location: location || null,
  });

  if (error) {
    console.error("Create event error:", error);
    return {
      success: false,
      message: error.message || "Failed to create event.",
    };
  }

  revalidatePath("/dashboard");

  return {
    success: true,
    message: "Event created successfully!",
  };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
