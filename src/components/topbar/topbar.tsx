"use client";
import React, { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ErrorMessage } from "@/components/ui/error_msg";
import { DarkModeButton } from "@/components/ui/dark_mode_btn";
import {
	faUser,
	faMagnifyingGlass,
	faUserGroup,
	faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TopBar() {
	const [email, setEmail] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const supabase = createClientComponentClient();

	useEffect(() => {
		const fetchUser = async () => {
			const { data: user, error } = await supabase.auth.getUser();

			if (user && user.user) {
				setEmail(user.user.email);
			} else if (error) {
				setErrorMessage("No user found: Please log in.");
			}
		};

		fetchUser();
	}, []);

	const handleLogout = async () => {
		const { error } = await supabase.auth.signOut();
		if (error) setErrorMessage("Error logging out: " + error.message);
	};

	const [isOpen, setIsOpen] = useState(false);
	const handleDivClick = () => {
		setIsOpen(!isOpen);
	};

	const pathname = usePathname();

	return (
		<>
			{errorMessage && (
				<ErrorMessage
					errorMessage={errorMessage}
					setErrorMessage={setErrorMessage}
				/>
			)}
			<div
				className="md:bg-white dark:md:bg-mid_blue text-dark_blue dark:text-light_gray md:px-14 ps-14 pe-4 h-12 flex items-center justify-between drop-shadow-sm rounded-br-2xl"
				style={{ zIndex: 100 }}
			>
				<div className="mr-14">
					<DarkModeButton />
				</div>
				<div className="hidden md:flex justify-center items-center gap-x-3">
					<FontAwesomeIcon icon={faMagnifyingGlass} />
					{/* TODO - Develop search functionality */}
					<input
						type="text"
						className="w-64 bg-transparent border-none focus:border-none focus:outline-none"
						placeholder="Search"
					/>
				</div>
				<div
					className="relative flex justify-center items-center gap-x-3 cursor-pointer md:ml-auto"
					onClick={handleDivClick}
				>
					<div className="flex items-center justify-center w-8 h-8 border-2 rounded-full border-dark_blue p-2 bg-mid_blue drop-shadow-md hover:bg-dark_blue transition-all duration-200 ease-linear">
						<FontAwesomeIcon
							icon={faUser}
							className="text-light_gray"
						/>
					</div>
					<p className="hidden md:block">{email}</p>

					{isOpen && (
						<div
							className="absolute right-0 top-10 w-40 bg-white dark:bg-dark_blue rounded-lg shadow-lg mt-2 overflow-hidden"
							style={{ zIndex: 101 }}
						>
							<Link href="/dashboard/myprofile">
								<div className="flex items-center justify-start gap-x-2 px-4 py-4 hover:font-medium hover:bg-light_gray dark:hover:bg-mid_blue transition-all duration-100 ease-linear">
									<div className="w-8 h-8 flex justify-center items-center rounded-full border-2 border-black dark:border-light_gray">
										<FontAwesomeIcon
											icon={faUser}
											size="sm"
										/>
									</div>
									<p>My profile</p>
								</div>
							</Link>
							<Link href="/dashboard/participants">
								<div className="flex items-center justify-start gap-x-2 px-4 py-4 hover:font-medium hover:bg-light_gray dark:hover:bg-mid_blue transition-all duration-100 ease-linear">
									<div className="w-8 h-8 flex justify-center items-center rounded-full border-2 border-black dark:border-light_gray">
										<FontAwesomeIcon
											icon={faUserGroup}
											size="sm"
										/>
									</div>
									<p>My team</p>
								</div>
							</Link>
							<Link href="/login" onClick={handleLogout}>
								<div className="flex items-center justify-start gap-x-2 px-4 py-4 hover:font-medium hover:bg-light_gray dark:hover:bg-mid_blue transition-all duration-100 ease-linear">
									<div className="w-8 h-8 flex justify-center items-center rounded-full border-2 border-black dark:border-light_gray">
										<FontAwesomeIcon
											icon={faRightFromBracket}
											size="sm"
										/>
									</div>
									<p>Log out</p>
								</div>
							</Link>
						</div>
					)}
				</div>
			</div>
		</>
	);
}
