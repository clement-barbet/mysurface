"use client";
import { useEffect, useState } from "react";
import FormAddNews from "./FormAddNews";
import TableNotifications from "./TableNotifications";
import Loading from "@/components/ui/loading";
import { fetchLanguages } from "@/db/languages/fetchLanguages";
import { fetchNotifications } from "@/db/notifications/fetchNotifications";

export default function News() {
	const [notifications, setNotifications] = useState([]);
	const [languages, setLanguages] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				const fetchedNotifications = await fetchNotifications();
				const fetchedLanguages = await fetchLanguages();
				setLanguages(fetchedLanguages);

				// Create a map of language id to language name
				const languageMap = fetchedLanguages.reduce((map, language) => {
					map[language.id] = language.name;
					return map;
				}, {});

				// Replace language_id with language name
				const notificationsWithLanguageName = fetchedNotifications.map(
					(notification) => ({
						...notification,
						language: languageMap[notification.language_id],
					})
				);

				setNotifications(notificationsWithLanguageName);
			} catch (error) {
				console.error("Error fetching data:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	const onNotificationAdded = (newNotification) => {
		const formattedNotification = {
			id: newNotification.notification_id,
			message: newNotification.notification_message,
			link: newNotification.notification_link,
			created_at: newNotification.notification_created_at,
			language: languages.find(
				(language) =>
					language.id == newNotification.notification_language_id
			).name,
			language_id: newNotification.notification_language_id,
		};
		setNotifications((prevNotifications) => [
			...prevNotifications,
			formattedNotification,
		]);
	};

	if (loading) {
		return <Loading />;
	}

	return (
		<div className="flex flex-col gap-y-2">
			<div className="p-5 shadow-md rounded-lg bg-white dark:bg-black bg-opacity-90">
				<FormAddNews
					languages={languages}
					onNotificationAdded={onNotificationAdded}
				/>
			</div>
			<TableNotifications
				notifications={notifications}
				setNotifications={setNotifications}
			/>
		</div>
	);
}
