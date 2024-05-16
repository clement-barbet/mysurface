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

const formSchema = z.object({
	organization: z.number(),
});

export default function ChangeOrganization({ userId }: { userId: any }) {
	const supabase = createClientComponentClient();
	const [successMessage, setSuccessMessage] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [organizationId, setOrganizationId] = useState<number | null>(null);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			organization: 1,
		},
	});

	useEffect(() => {
		const fetchUserAndOrganization = async () => {
			const { data: appSettingsData, error: appSettingsError } =
				await supabase
					.from("app_settings")
					.select("organization_id")
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
				setOrganizationId(appSettingsData.organization_id);
			}
		};

		fetchUserAndOrganization();
	}, []);

	useEffect(() => {
		if (organizationId) {
			form.setValue("organization", organizationId);
		}
	}, [organizationId]);

	const handleChangeOrganization = async (
		data: z.infer<typeof formSchema>
	) => {
		const { organization } = data;

		const { error: updateError } = await supabase
			.from("app_settings")
			.update({ organization_id: organization })
			.eq("user_id", userId);

		if (updateError) {
			console.log(updateError);
			setErrorMessage(updateError.message);
		} else {
			setSuccessMessage("Organization updated successfully.");
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
				<h2 className="mb-2 text-xl font-semibold border-l-4 border-mid_blue pl-2">
					<T tkey="account.organization.title" />
				</h2>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleChangeOrganization)}
						className="flex flex-col gap-y-4"
					>
						<FormField
							control={form.control}
							name="organization"
							render={({ field }) => (
								<FormItem>
									<FormLabel htmlFor="organization">
										<T tkey="account.organization.label" />
									</FormLabel>
									<FormControl>
										<select
											name="organization"
											id="organization"
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
						<div className="w-full flex justify-end">
							<Button type="submit" variant="login" className="w-full md:w-1/2 lg:w-1/3">
								<T tkey="account.organization.button" />
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</>
	);
}
