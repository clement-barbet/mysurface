"use client";
import { Notification } from "@/components/home/notification";
import T from "@/components/translations/translation";
import Loading from "@/components/ui/loading";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";

export default function Home() {
	const supabase = createClientComponentClient();
	const [internalNotifications, setInternalNotifications] = useState([]);
	const [loading, setLoading] = useState(true);

	async function fetchUser() {
		try {
			const fetchedUser = await supabase.auth.getUser();
			if (!fetchedUser.data.user)
				throw new Error("User not authenticated");
			return fetchedUser.data.user;
		} catch (error) {
			console.error("Error fetching user", error);
		}
	}

	async function fetchAppSettings(userId) {
		try {
			const { data: appSettings, error } = await supabase
				.from("app_settings")
				.select("*")
				.eq("user_id", userId)
				.single();

			if (error) throw error;
			return appSettings;
		} catch (error) {
			console.error("Error loading app settings", error);
		}
	}

	async function fetchNotifications(languageId) {
		try {
			const { data: appNotifications, error } = await supabase
				.from("notifications")
				.select("*")
				.eq("language_id", languageId);

			if (error) throw error;
			return appNotifications || [];
		} catch (error) {
			console.error("Error loading notifications", error);
		}
	}

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				const user = await fetchUser();
				const userId = user.id;
				const fetchedAppSettings = await fetchAppSettings(userId);
				const languageId = fetchedAppSettings.language_id;
				const fetchedNotifications = await fetchNotifications(
					languageId
				);
				setInternalNotifications(fetchedNotifications);
			} catch (error) {
				console.error("Error fetching data", error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	if (loading) {
		return <Loading />;
	}

	return (
		<div className="flex flex-col gap-y-2">
			<div className="p-5 py-h-auto w-full flex flex-col shadow-md rounded-lg bg-white dark:bg-black bg-opacity-90">
				<h2 className="text-xl mb-2 font-semibold border-l-4 border-mid_blue pl-2">
					<T tkey="home.welcome.title" />
				</h2>
				<p className="text-gray-600 dark:text-gray-400 text-lg md:text-base">
					<T tkey="home.welcome.subtitle" />
				</p>
			</div>
			<div className="flex flex-col md:flex-row md:gap-x-2 gap-y-2">
				<div className="p-5 h-auto w-full flex flex-col shadow-md rounded-lg bg-white dark:bg-black bg-opacity-90">
					<div>
						<h2 className="text-xl mb-2 font-semibold border-l-4 border-mid_blue pl-2">
							<T tkey="home.guide.admin.title" />
						</h2>
						<p className="text-gray-600 dark:text-gray-400 text-lg md:text-base">
							<T tkey="home.guide.admin.subtitle" />
						</p>
						<table className="border-collapse w-full my-1">
							<tbody>
								{Array.from({ length: 8 }, (_, i) => (
									<tr key={i}>
										<td className="text-accent_color pr-2 py-1 font-semibold align-top">
											{i + 1}.
										</td>
										<td className="py-1">
											<T
												tkey={`home.guide.admin.steps.s${
													i + 1
												}`}
											/>
											.
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
				<div className="p-5 h-auto w-full flex flex-col shadow-md rounded-lg bg-white dark:bg-black bg-opacity-90">
					<div>
						<h2 className="text-xl mb-2 font-semibold border-l-4 border-mid_blue pl-2">
							<T tkey="home.guide.user.title" />
						</h2>
						<p className="text-gray-600 dark:text-gray-400 text-lg md:text-base">
							<T tkey="home.guide.user.subtitle" />
						</p>
						<table className="border-collapse w-full my-1">
							<tbody>
								{Array.from({ length: 3 }, (_, i) => (
									<tr key={i}>
										<td className="text-accent_color pr-2 py-1 font-semibold align-top">
											{i + 1}.
										</td>
										<td className="py-1">
											<T
												tkey={`home.guide.user.steps.s${
													i + 1
												}`}
											/>
											.
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
			<div className="p-5 h-auto w-full flex flex-col shadow-md rounded-lg bg-white dark:bg-black bg-opacity-90">
				<div>
					<div className="mb-2">
						<h2 className="text-xl mb-2 font-semibold border-l-4 border-mid_blue pl-2">
							<T tkey="home.updates.title" />
						</h2>
						<p className="text-gray-600 dark:text-gray-400 text-lg md:text-base">
							<T tkey="home.updates.subtitle" />
						</p>
					</div>
					{internalNotifications.length > 0 ? (
						internalNotifications.map((notification, index) => (
							<Notification
								key={index}
								msg={notification.message}
								type={notification.type}
								link={notification.link}
								lang={notification.language_id}
							/>
						))
					) : (
						<p>No notifications.</p>
					)}
				</div>
			</div>
		</div>
	);
}
