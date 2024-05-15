"use client";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import T from "@/components/translations/translation";
import { useTranslation } from "react-i18next";

const formSchema = z.object({
	newPassword: z.string(),
	confirmPassword: z.string(),
});

export default function ResetPasswordForm() {
	const router = useRouter();
	const supabase = createClientComponentClient();
	const [successMessage, setSuccessMessage] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const { t } = useTranslation();

	const handleChangePassword = async (data: z.infer<typeof formSchema>) => {
		const { newPassword, confirmPassword } = data;
		if (newPassword !== confirmPassword) {
			setErrorMessage("Passwords do not match.");
			return;
		}

		const { error: updateError } = await supabase.auth.updateUser({
			password: newPassword,
		});

		if (updateError) {
			console.log(updateError);
			setErrorMessage(updateError.message);
		} else {
			setSuccessMessage(
				"Password reset. You can now login with your new password"
			);
			router.push("/login");
		}
	};

	// Control password visibility
	const [passwordType, setPasswordType] = useState("password");

	const togglePassword = () => {
		setPasswordType((prevType) =>
			prevType === "password" ? "text" : "password"
		);
	};

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			newPassword: "",
			confirmPassword: "",
		},
	});

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
					<T tkey="account.password.title" />
				</h2>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleChangePassword)}
						className="space-y-8"
					>
						<FormField
							control={form.control}
							name="newPassword"
							render={({ field }) => (
								<FormItem>
									<FormLabel htmlFor="newPassword">
										<T tkey="account.password.labels.new" />
									</FormLabel>
									<FormControl>
										<div className="relative">
											<Input
												id="newPassword"
												type={passwordType}
												placeholder={t(
													"account.password.placeholders.new"
												)}
												className=" dark:bg-mid_blue"
												{...field}
											/>
											<button
												type="button"
												className="togglePassword absolute inset-y-0 right-0 px-4 py-2 text-dark_blue focus:outline-none"
												onClick={togglePassword}
												tabIndex={-1}
											>
												<FontAwesomeIcon
													id="eyeIcon"
													icon={
														passwordType ===
														"password"
															? faEye
															: faEyeSlash
													}
													className="flex items-center justify-center w-6 dark:text-light_gray"
												/>
											</button>
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="confirmPassword"
							render={({ field }) => (
								<FormItem>
									<FormLabel htmlFor="confirmPassword">
										<T tkey="account.password.labels.confirm" />
									</FormLabel>
									<FormControl>
										<div className="relative">
											<Input
												id="confirmPassword"
												type={passwordType}
												placeholder={t(
													"account.password.placeholders.confirm"
												)}
												className=" dark:bg-mid_blue"
												{...field}
											/>
											<button
												tabIndex={-1}
												type="button"
												className="togglePassword absolute inset-y-0 right-0 px-4 py-2 text-dark_blue focus:outline-none"
												onClick={togglePassword}
											>
												<FontAwesomeIcon
													id="eyeIcon"
													icon={
														passwordType ===
														"password"
															? faEye
															: faEyeSlash
													}
													className="flex items-center justify-center w-6 dark:text-light_gray"
												/>
											</button>
										</div>
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
								<T tkey="account.password.button" />
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</>
	);
}
