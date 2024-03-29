"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { LeftSideLogin } from "@/components/ui/left_side_login";
import { FormBg } from "@/components/ui/form_bg";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
// Import fontawesome icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const formSchema = z.object({
	email: z.string().email(),
	password: z.string(),
});

export default function LoginForm() {
	const [errorMessage, setErrorMessage] = useState<string | undefined>(
		undefined
	);

	// Control password visibility
	const [passwordType, setPasswordType] = useState("password");

	const togglePassword = () => {
		setPasswordType((prevType) =>
			prevType === "password" ? "text" : "password"
		);
	};

	const router = useRouter();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		signIn(values);
	}

	async function signIn(values: z.infer<typeof formSchema>) {
		const email = values.email;
		const password = values.password;

		const supabase = createClientComponentClient();
		const response = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (response.error) {
			console.log(response);
			setErrorMessage(response.error?.message);
			return;
		} else {
			return router.push("/dashboard");
		}
	}

	return (
		<div>
			{errorMessage && (
				<div className="w-full text-red-600 font-bold bg-red-200 p-4 fixed top-0 z-50 flex justify-between items-center drop-shadow-sm">
					<p>{errorMessage}</p>
					<button
						onClick={() => setErrorMessage("")}
						className="font-bold text-2xl"
					>
						×
					</button>
				</div>
			)}
			<FormBg />
			<div className="relative md:absolute top-0 left-0 right-0 flex md:flex-row flex-col items-center justify-center md:h-screen">
				<div className="md:rounded-2xl w-full md:w-4/5 flex flex-col md:flex-row md:drop-shadow-xl md:h-4/5 md:overflow-hidden hover:drop-shadow-2xl transition-all duration-200 ease-linear">
					<LeftSideLogin />
					<div className="bg-mid_gray w-full md:w-1/2 h-full flex flex-column items-center justify-center py-10 md:py-0">
						<div className="rounded-lg font-glory w-4/5 lg:w-3/5">
							<h2 className="text-4xl pb-4 h-[56px]" id="welcome">
								Welcome Back!
							</h2>
							<Form {...form}>
								<form
									onSubmit={form.handleSubmit(onSubmit)}
									className="space-y-8"
								>
									<FormField
										control={form.control}
										name="email"
										render={({ field }) => (
											<FormItem>
												<FormLabel>E-Mail</FormLabel>
												<FormControl>
													<Input
														placeholder="Your E-Mail"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="password"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Password</FormLabel>
												<FormControl>
													<div className="relative">
														<Input
															type={passwordType}
															placeholder="Your Password"
															{...field}
														/>
														<button
															id="togglePassword"
															type="button"
															className="absolute inset-y-0 right-0 px-4 py-2 text-dark_blue focus:outline-none"
															onClick={
																togglePassword
															}
														>
															<FontAwesomeIcon
																id="eyeIcon"
																icon={
																	passwordType ===
																	"password"
																		? faEye
																		: faEyeSlash
																}
																className="flex items-center justify-center w-6"
															/>
														</button>
													</div>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<div className=" flex justify-center items-center">
										<Button type="submit" variant="login">
											LOG IN
										</Button>
									</div>
								</form>
							</Form>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
