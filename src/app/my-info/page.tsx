"use client";
import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import UpdateInfoForm from "@/components/my-info/update_info_form";
import Loading from "@/components/ui/loading";
import T from "@/components/translations/translation";

export default function MyInfo() {
	const supabase = createClientComponentClient();
	const [userSB, setUserSB] = useState(null);
	const [loading, setLoading] = useState(true);
	const [isUpdated, setIsUpdated] = useState(false);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const session = await supabase.auth.getSession();
				if (session) {
					setUserSB(session.data.session.user);
				}
			} catch (error) {
				console.error("Error fetching user: ", error);
			} finally {
				setLoading(false);
			}
		};

		fetchUser();
	}, []);

	if (loading) {
		return <Loading />;
	}

	return userSB && userSB.id ? (
		<>
			<h2 className="text-3xl text-center py-4">
				<T tkey="my-info.title" />
			</h2>
			<div className="w-full p-2 md:w-1/2 md:m-auto flex flex-col gap-y-2">
				<div className="w-full p-5 shadow-md rounded-lg bg-white dark:bg-black bg-opacity-90">
					<UpdateInfoForm
						userId={userSB.id}
						setIsUpdated={setIsUpdated}
					/>
					{isUpdated && (
						<Link href="/login" className="py-4">
							<Button
								variant="login"
								className="bg-black hover:bg-gray-800 mt-2 uppercase"
							>
								<T tkey="my-info.buttons.login" />
							</Button>
						</Link>
					)}
				</div>
			</div>
		</>
	) : null;
}
