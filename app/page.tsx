import { redirect } from "next/navigation";

export default function Home() {
  const randomString = Math.random().toString(36).substring(2, 8);
  redirect(`/${randomString}`);
}
