"use client";
import {
  User,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import ResetPasswordFrom from "@/components/auth/email/reset_password";
import ChangeOrganization from "@/components/account/change_organization";
import ChangeLanguage from "@/components/account/change_language";
import ChangeNames from "@/components/account/change_names";
import DeleteAccountButton from "@/components/account/delete_account_btn";
import { useEffect, useState } from "react";

export default function Account() {
  const supabase = createClientComponentClient();
  const [userSB, setUserSB] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await supabase.auth.getUser();
      console.log(user);
      if (user.data.user) {
        setUserSB(user.data.user);
      }
    };

    fetchUser();
  }, []);

  return (
    <>
      {userSB && userSB.id ? (
        <div className="flex flex-col gap-y-4 md:gap-y-10 md:my-8 md:mx-8">
          {" "}
          <div className="w-full p-5 shadow-md rounded-lg bg-white dark:bg-black bg-opacity-90">
            <ChangeNames userId={userSB.id} />
          </div>
          <div className="w-full p-5 shadow-md rounded-lg bg-white dark:bg-black bg-opacity-90">
            <ChangeOrganization userId={userSB.id} />
          </div>
          <div className="w-full p-5 shadow-md rounded-lg bg-white dark:bg-black bg-opacity-90">
            <ChangeLanguage userId={userSB.id} />
          </div>
          <div className="w-full p-5 shadow-md rounded-lg bg-white dark:bg-black bg-opacity-90">
            <ResetPasswordFrom />
          </div>
          <div className="w-full p-5 shadow-md rounded-lg bg-white dark:bg-black bg-opacity-90">
            <DeleteAccountButton userId={userSB.id} />
          </div>
        </div>
      ) : null}
    </>
  );
}
