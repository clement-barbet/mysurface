"use client";
import { Notification } from "@/components/home/notification";
import T from "@/components/translations/translation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { use, useEffect, useState } from "react";
import { set } from "zod";

export default function Home() {
	const supabase = createClientComponentClient();
	const [internalNotifications, setInternalNotifications] = useState([]);
	const [language, setLanguage] = useState(1);

	async function getLanguage() {
		const user = await supabase.auth.getUser();

		if (user) {
			// get AppSettings
			const { data: appSettings, error: appSettingsError } =
				await supabase
					.from("app_settings")
					.select("*")
					.eq("user_id", user.data.user.id)
					.single();

			if (appSettingsError) {
				console.error("Error fetching app settings:", appSettingsError);
			}

			setLanguage(appSettings.language_id);
		}
	}

	async function getNotifications() {
		// get Notifications
		const { data: notifications, error: notificationsError } =
			await supabase
				.from("notifications")
				.select("*")
				.eq("language_id", language);

		if (notificationsError) {
			console.error("Error fetching notifications:", notificationsError);
		}

		setInternalNotifications(notifications);
	}

	useEffect(() => {
		getLanguage();
		getNotifications();
	}, []);

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
