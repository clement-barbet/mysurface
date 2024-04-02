"use client";
import React, { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ErrorMessage } from "@/components/ui/error_msg";
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
				setErrorMessage(
					"An error occurred while fetching user's email."
				);
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
			<div className="md:bg-dark_gray text-dark_blue px-10 h-20 flex items-center justify-end md:justify-between drop-shadow-sm rounded-br-2xl">
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
					className="relative flex justify-center items-center gap-x-3 cursor-pointer"
					onClick={handleDivClick}
				>
					<div className="flex items-center justify-center w-10 h-10 border-2 rounded-full border-dark_blue p-2 bg-mid_blue drop-shadow-md hover:bg-dark_blue transition-all duration-200 ease-linear">
						<FontAwesomeIcon
							icon={faUser}
							className="text-light_gray"
						/>
					</div>
					<p className="hidden md:block">{email}</p>
					{isOpen && (
						<div className="absolute right-0 top-10 w-40 z-100 bg-white rounded-lg shadow-lg mt-2 overflow-hidden">
							<div className="flex items-center justify-start gap-x-2 px-4 py-4 hover:font-medium hover:bg-light_gray transition-all duration-100 ease-linear">
								<div className="w-8 h-8 flex justify-center items-center rounded-full border-2 border-black">
									<FontAwesomeIcon icon={faUser} size="sm" />
								</div>
								<a href="#">My profile</a>
							</div>
							<div className="flex items-center justify-start gap-x-2 px-4 py-4 hover:font-medium hover:bg-light_gray transition-all duration-100 ease-linear">
								<div className="w-8 h-8 flex justify-center items-center rounded-full border-2 border-black">
									<FontAwesomeIcon
										icon={faUserGroup}
										size="sm"
									/>
								</div>
								<a href="#">My team</a>
							</div>
							{/* TODO - This logout just redirects, develop a proper logout */}
							<Link href="/login" onClick={handleLogout}>
								<div className="flex items-center justify-start gap-x-2 px-4 py-4 hover:font-medium hover:bg-light_gray transition-all duration-100 ease-linear">
									<div className="w-8 h-8 flex justify-center items-center rounded-full border-2 border-black">
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
