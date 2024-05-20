"use client";
import React, { useEffect, useState } from "react";
import { set, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { SuccessMessage } from "@/components/ui/msg/success_msg";
import { ErrorMessage } from "@/components/ui/msg/error_msg";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import T from "@/components/translations/translation";
import { useTranslation } from "react-i18next";
import { Input } from "../ui/input";

const formSchema = z.object({
	language: z.number(),
	name: z.string().min(5, "Name must be at least 5 character long"),
	organization: z
		.string()
		.min(5, "Organization must be at least 5 character long"),
	organization_id: z.number(),
});

export default function UpdateInfoForm({
	userId,
	setIsUpdated,
}: {
	userId: string;
	setIsUpdated: (isUpdated: boolean) => void;
}) {
	const supabase = createClientComponentClient();
	const [successMessage, setSuccessMessage] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [languageId, setLanguageId] = useState<number | null>(null);
	const [languages, setLanguages] = useState([]);
	const { i18n } = useTranslation();
	const [organizationId, setOrganizationId] = useState<number | null>(null);
	const [name, setName] = useState<string | null>(null);
	const [organization, setOrganization] = useState<string | null>(null);
	const { t } = useTranslation();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			language: 1,
			name: "",
			organization: "",
			organization_id: 1,
		},
	});

	useEffect(() => {
		const fetchUserAndLanguage = async () => {
			const { data: languagesData, error: languagesError } =
				await supabase.from("languages").select("*");

			if (languagesError) {
				console.error("Error fetching languages:", languagesError);
				return;
			} else {
				setLanguages(languagesData);
			}

			const { data: appSettingsData, error: appSettingsError } =
				await supabase
					.from("app_settings")
					.select("language_id")
					.eq("user_id", userId)
					.single();

			if (appSettingsError) {
				console.error(
					"Error fetching language from app_settings:",
					appSettingsError
				);
				return;
			}

			if (appSettingsData) {
				setLanguageId(appSettingsData.language_id);
			}
		};

		fetchUserAndLanguage();
	}, []);

	useEffect(() => {
		if (languageId) {
			form.setValue("language", languageId);
		}
	}, [languageId]);

	useEffect(() => {
		const fetchUserAndOrganization = async () => {
			const { data: appSettingsData, error: appSettingsError } =
				await supabase
					.from("app_settings")
					.select("name, organization, organization_id")
					.eq("user_id", userId)
					.single();

			if (appSettingsError) {
				console.error(
					"Error fetching organization from app_settings:",
					appSettingsError
				);
				return;
			}

			if (appSettingsData) {
				setName(appSettingsData.name);
				setOrganization(appSettingsData.organization);
				setOrganizationId(appSettingsData.organization_id);
			}
		};

		fetchUserAndOrganization();
	}, []);

	useEffect(() => {
		if (organization) {
			form.setValue("organization", organization);
		}
	}, [organization]);

	useEffect(() => {
		if (name) {
			form.setValue("name", name);
		}
	}, [name]);

	useEffect(() => {
		if (organizationId) {
			form.setValue("organization_id", organizationId);
		}
	}, [organizationId]);

	const handleLanguageChange = (event) => {
		setLanguageId(parseInt(event.target.value));
		const langId = parseInt(event.target.value);
		const selectedLanguage = languages.find((lang) => lang.id === langId);

		if (selectedLanguage) {
			i18n.changeLanguage(selectedLanguage.code);
			localStorage.setItem("i18nextLng", selectedLanguage.code);
		}
	};

	const handleUpdate = async (data: z.infer<typeof formSchema>) => {
		const { language, organization_id, name, organization } = data;

		const { error: languageUpdateError } = await supabase
			.from("app_settings")
			.update({ language_id: language })
			.eq("user_id", userId);

		if (!languageUpdateError) {
			const selectedLanguage = languages.find(
				(language) => language.id === languageId
			);

			if (selectedLanguage) {
				i18n.changeLanguage(selectedLanguage.code);
				localStorage.setItem("i18nextLng", selectedLanguage.code);
			}
		}

		const { error: organizationTypeUpdateError } = await supabase
			.from("app_settings")
			.update({ organization_id: organization_id })
			.eq("user_id", userId);

		const { error: namesUpdateError } = await supabase
			.from("app_settings")
			.update({ name: name, organization: organization })
			.eq("user_id", userId);

		if (
			namesUpdateError ||
			organizationTypeUpdateError ||
			languageUpdateError
		) {
			setErrorMessage(
				"error.my-info"
			);
		} else {
			setIsUpdated(true);
			setSuccessMessage("success.my-info");
		}
	};

	return (
		<>
			<ErrorMessage
				errorMessage={errorMessage}
				setErrorMessage={setErrorMessage}
			/>
			<SuccessMessage
				successMessage={successMessage}
				setSuccessMessage={setSuccessMessage}
			/>
			<div>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleUpdate)}
						className="flex flex-col gap-y-4"
					>
						<FormField
							control={form.control}
							name="language"
							render={({ field }) => (
								<FormItem>
									<FormLabel htmlFor="language">
										<T tkey="account.language.label" />
									</FormLabel>
									<FormControl>
										<select
											name="language"
											id="language"
											className="appearance-none box-border w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 bg-dark_gray cursor-pointer dark:bg-mid_blue"
											value={languageId}
											onChange={handleLanguageChange}
										>
											{languages.map((language) => (
												<option
													key={language.id}
													value={language.id}
												>
													{language.name}
												</option>
											))}
										</select>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="organization_id"
							render={({ field }) => (
								<FormItem>
									<FormLabel htmlFor="organization_id">
										<T tkey="account.organization.label" />
									</FormLabel>
									<FormControl>
										<select
											name="organization_id"
											id="organization_id"
											className="dark:bg-mid_blue appearance-none box-border w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 bg-dark_gray cursor-pointer"
											value={organizationId}
											onChange={(e) =>
												setOrganizationId(
													parseInt(e.target.value)
												)
											}
										>
											<option value="1">
												<T tkey="account.organization.options.company" />
											</option>
											<option value="2">
												<T tkey="account.organization.options.school" />
											</option>
											<option value="3">
												<T tkey="account.organization.options.city" />
											</option>
										</select>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel htmlFor="name">
										<T tkey="account.name.labels.name" />
									</FormLabel>
									<FormControl className="dark:bg-mid_blue">
										<Input
											name="name"
											id="name"
											placeholder={t(
												"account.name.labels.name"
											)}
											value={name}
											onChange={(e) =>
												setName(e.target.value)
											}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="organization"
							render={({ field }) => (
								<FormItem>
									<FormLabel htmlFor="organization">
										<T tkey="account.name.labels.organization" />
									</FormLabel>
									<FormControl className="dark:bg-mid_blue">
										<Input
											name="organization"
											id="organization"
											placeholder={t(
												"account.name.labels.organization"
											)}
											value={organization}
											onChange={(e) =>
												setOrganization(e.target.value)
											}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button
							type="submit"
							variant="login"
							className="uppercase"
						>
							<T tkey="my-info.buttons.update" />
						</Button>
					</form>
				</Form>
			</div>
		</>
	);
}
