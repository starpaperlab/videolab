import { redirect } from "next/navigation";

/** Video Lab now opens directly in the creative studio.
 * Legacy routes are retained as redirects to avoid broken bookmarks.
 */
export default function Home() {
  redirect("/editor-lab");
}
