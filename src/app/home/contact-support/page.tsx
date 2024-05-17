"use client";

import { fetchUser } from "@/db/auth_user/fetchUser";
import FormContact from "./FormContact";
import { fetchSettings } from "@/db/app_settings/fetchSettingsByUserId";
import { useEffect, useState } from "react";
import Loading from "@/components/ui/loading";

export default function ContactSupport() {
	const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [settings, setSettings] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				const fetchedUser = await fetchUser();
				const userId = fetchedUser.id;
				const fetchedSettings = await fetchSettings(userId);
                setSettings(fetchedSettings);
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
		<div className="p-5 shadow-md rounded-lg bg-white dark:bg-black bg-opacity-90">
			<FormContact settings={settings} />
		</div>
	);
}
