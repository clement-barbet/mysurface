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
import { Input } from "../ui/input";
import { useTranslation } from "react-i18next";

const formSchema = z.object({
	name: z.string(),
	organization: z.string(),
});

export default function ChangeNames({ userId }: { userId: string }) {
	const supabase = createClientComponentClient();
	const [successMessage, setSuccessMessage] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [name, setName] = useState<string | null>(null);
	const [organization, setOrganization] = useState<string | null>(null);
	const { t } = useTranslation();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			organization: "",
		},
	});

	useEffect(() => {
		const fetchUserAndOrganization = async () => {
			const { data: appSettingsData, error: appSettingsError } =
				await supabase
					.from("app_settings")
					.select("name, organization")
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

	const handleChange = async (data: z.infer<typeof formSchema>) => {
		const { organization, name } = data;

		const { error: updateError } = await supabase
			.from("app_settings")
			.update({ name: name, organization: organization })
			.eq("user_id", userId);

		if (updateError) {
			console.log(updateError);
			setErrorMessage(updateError.message);
		} else {
			setSuccessMessage(
				"Name and oranization's name updated successfully."
			);
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
				<h2 className="pb-5 text-xl font-semibold">
					<T tkey="account.name.title" />
				</h2>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleChange)}
						className="space-y-8"
					>
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
						<div className="w-full flex justify-end">
							<Button type="submit" variant="login" className="w-full md:w-1/2 lg:w-1/3">
								<T tkey="account.name.button" />
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</>
	);
}
