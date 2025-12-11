import { redirect } from "next/navigation";

export default function Home() {
  // Langsung lempar user ke dashboard
  redirect("/dashboard");
}
