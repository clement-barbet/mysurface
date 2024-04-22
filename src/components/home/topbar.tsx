"use client";
import React, { useRef, useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { ErrorMessage } from "@/components/ui/msg/error_msg";
import { DarkModeButton } from "@/components/home/dark_mode_btn";
import { IoPeople } from "react-icons/io5";
import { FaUser } from "react-icons/fa6";
import { IoMdSettings } from "react-icons/io";
import { IoMdLogOut } from "react-icons/io";
import { FaMagnifyingGlass } from "react-icons/fa6";
import Link from "next/link";
import T from "@/components/translations/translation";
import { useTranslation } from "react-i18next";

export default function TopBar() {
	const [errorMessage, setErrorMessage] = useState("");
	const supabase = createClientComponentClient();
	const { t } = useTranslation();
	const [email, setEmail] = useState("");
	const menuRef = useRef(null);
	const divRef = useRef(null);
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		function handleClickOutside(event) {
			if (
				isOpen &&
				menuRef.current &&
				!menuRef.current.contains(event.target) &&
				!divRef.current.contains(event.target)
			) {
				setIsOpen(false);
			}
		}

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [menuRef, isOpen]);

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
		if (error) {
			setErrorMessage("Error logging out: " + error.message);
		}
	};

	const handleDivClick = (event) => {
		event.stopPropagation();
		setIsOpen((prevIsOpen) => !prevIsOpen);
	};

	return (
		<>
			{errorMessage && (
				<ErrorMessage
					errorMessage={errorMessage}
					setErrorMessage={setErrorMessage}
				/>
			)}
			<div
				className="fixed right-0 left-0 md:left-48 w-auto dark:bg-black dark:bg-opacity-50 bg-light_gray bg-opacity-80 md:bg-white dark:md:bg-mid_blue text-dark_blue dark:text-light_gray md:ps-4 md:pe-8 ps-14 pe-4 h-10 flex items-center justify-between drop-shadow-sm rounded-br-2xl"
				style={{ zIndex: 100 }}
			>
				<div className="md:mr-14">
					<DarkModeButton />
				</div>
				<div className="hidden md:flex justify-center items-center gap-x-3">
					<FaMagnifyingGlass className="w-5 h-5" />
					{/* TODO - Develop search functionality */}
					<input
						type="text"
						className="w-64 bg-transparent border-none focus:border-none focus:outline-none"
						placeholder={t("topbar.search")}
					/>
				</div>
				<div
					className="relative flex justify-center items-center gap-x-3 cursor-pointer md:ml-auto"
					onClick={handleDivClick}
					ref={divRef}
				>
					<div className="flex items-center justify-center w-8 h-8 border-2 rounded-full border-dark_blue p-2 bg-mid_blue drop-shadow-md hover:bg-dark_blue transition-all duration-200 ease-linear">
						<FaUser className="w-5 h-5 text-light_gray" />
					</div>
					<p>{email}</p>

					{isOpen && (
						<div
							ref={menuRef}
							className="absolute right-0 top-10 w-40 bg-white dark:bg-dark_blue rounded-lg shadow-lg mt-2 overflow-hidden"
							style={{ zIndex: 101 }}
						>
							<Link href="/home/account">
								<div className="flex items-center justify-start gap-x-1 px-4 py-3 hover:font-medium hover:bg-light_gray dark:hover:bg-mid_blue transition-all duration-100 ease-linear">
									<div className="w-8 h-8 flex justify-center items-center dark:border-light_gray">
										<IoMdSettings className="w-5 h-5" />
									</div>
									<p>
										<T tkey="topbar.account" />
									</p>
								</div>
							</Link>
							<Link href="/home/participants">
								<div className="flex items-center justify-start gap-x-1 px-4 py-3 hover:font-medium hover:bg-light_gray dark:hover:bg-mid_blue transition-all duration-100 ease-linear">
									<div className="w-8 h-8 flex justify-center items-center dark:border-light_gray">
										<IoPeople className="h-5 w-5" />
									</div>
									<p>
										<T tkey="topbar.team" />
									</p>
								</div>
							</Link>
							<Link href="/login" onClick={handleLogout}>
								<div className="flex items-center justify-start gap-x-1 px-4 py-3 hover:font-medium hover:bg-light_gray dark:hover:bg-mid_blue transition-all duration-100 ease-linear">
									<div className="w-8 h-8 flex justify-center items-center dark:border-light_gray">
										<IoMdLogOut className="h-5 w-5" />
									</div>
									<p>
										<T tkey="topbar.logout" />
									</p>
								</div>
							</Link>
						</div>
					)}
				</div>
			</div>
		</>
	);
}
