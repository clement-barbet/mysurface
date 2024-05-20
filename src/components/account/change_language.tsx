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

const formSchema = z.object({
	language: z.number(),
});

export default function ChangeLanguage({ userId }: { userId: any }) {
	const supabase = createClientComponentClient();
	const [successMessage, setSuccessMessage] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [languageId, setLanguageId] = useState<number | null>(null);
	const [languages, setLanguages] = useState([]);
	const { i18n } = useTranslation();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			language: 1,
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

	const handleChangeLanguage = async (data: z.infer<typeof formSchema>) => {
		const { language } = data;

		const { error: updateError } = await supabase
			.from("app_settings")
			.update({ language_id: language })
			.eq("user_id", userId);

		if (updateError) {
			console.log(updateError);
			setErrorMessage("error.account.language");
		} else {
			setSuccessMessage("success.account.language");
			const selectedLanguage = languages.find(
				(language) => language.id === languageId
			);

			if (selectedLanguage) {
				i18n.changeLanguage(selectedLanguage.code);
				localStorage.setItem("i18nextLng", selectedLanguage.code);
			}
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
				<h2 className="mb-2 text-lg font-semibold border-l-4 border-mid_blue pl-2">
					<T tkey="account.language.title" />
				</h2>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleChangeLanguage)}
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
											onChange={(e) =>
												setLanguageId(
													parseInt(e.target.value)
												)
											}
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
						<div className="w-full flex justify-end">
							<Button
								type="submit"
								variant="login"
								className="w-full md:w-1/2 lg:w-1/3"
							>
								<T tkey="account.language.button" />
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</>
	);
}
