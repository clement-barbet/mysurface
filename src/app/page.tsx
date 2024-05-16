import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function Home() {
  const supabase = createServerComponentClient({ cookies });
  const { data: participants } = await supabase.from("participants").select();
  return (
    <>
      <pre>{JSON.stringify(participants, null, 2)}</pre>
    </>
  );
}
