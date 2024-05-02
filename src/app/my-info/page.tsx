"use client";
import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import ChangeOrganization from "@/components/my-info/change_organization";
import ChangeLanguage from "@/components/my-info/change_language";
import ChangeNames from "@/components/my-info/change_names";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function MyInfo() {
	const supabase = createClientComponentClient();
	const [userSB, setUserSB] = useState(null);

	useEffect(() => {
		const fetchUser = async () => {
			const session = await supabase.auth.getSession();
			if (session) {
				setUserSB(session.data.session.user);
			}
		};

		fetchUser();
	}, []);

	return (
		<>
			{userSB && userSB.id ? (
				<>
					<h2 className="text-3xl text-center py-4">
						Update your information
					</h2>
					<div className="w-full p-2 md:w-1/2 md:m-auto flex flex-col gap-y-2">
						<div className="w-full p-5 shadow-md rounded-lg bg-white dark:bg-black bg-opacity-90">
							<ChangeLanguage userId={userSB.id} />
						</div>
						<div className="w-full p-5 shadow-md rounded-lg bg-white dark:bg-black bg-opacity-90">
							<ChangeNames userId={userSB.id} />
						</div>
						<div className="w-full p-5 shadow-md rounded-lg bg-white dark:bg-black bg-opacity-90">
							<ChangeOrganization userId={userSB.id} />
						</div>
						<Link href="/login" className="py-4">
							<Button
								variant="login"
								className="bg-black hover:bg-gray-800"
							>
								GO TO LOG IN
							</Button>
						</Link>
					</div>
				</>
			) : (
				<div>
					<h2 className="text-center mt-10 text-3xl">
						Please{" "}
						<Link
							href="/login"
							className="text-blue-500 hover:text-blue-700 transition-colors duration-200 ease-linear font-semibold"
						>
							log in
						</Link>{" "}
						to view your information
					</h2>
				</div>
			)}
		</>
	);
}
