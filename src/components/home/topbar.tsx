"use client";
import React, { useRef, useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { ErrorMessage } from "@/components/ui/msg/error_msg";
import { DarkModeButton } from "@/components/home/dark_mode_btn";
import { IoPeople } from "react-icons/io5";
import { FaUser } from "react-icons/fa6";
import { IoMdSettings } from "react-icons/io";
import { IoMdLogOut } from "react-icons/io";
import { FaArrowRight } from "react-icons/fa";
import { MdPayment } from "react-icons/md";
import Link from "next/link";
import T from "@/components/translations/translation";
import { fetchSettings } from "@/db/app_settings/fetchSettingsByUserId";
import { set } from "zod";
import { fetchBilling } from "@/db/billings/fetchBillingByUserId";

export default function TopBar({ user }) {
	const [errorMessage, setErrorMessage] = useState("");
	const supabase = createClientComponentClient();
	const [email, setEmail] = useState("");
	const [organization, setOrganization] = useState("");
	const menuRef = useRef(null);
	const divRef = useRef(null);
	const [isOpen, setIsOpen] = useState(false);
	const [subscriptionStatus, setSubscriptionStatus] = useState("inactive");

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
		const fetchData = async () => {
			try {
				if (user) {
					setEmail(user.email);
					const fetchedSettings = await fetchSettings(user.id);
					setOrganization(fetchedSettings.organization_id);
					const fetchedBilling = await fetchBilling(user.id);
					if (fetchedBilling) {
						setSubscriptionStatus(fetchedBilling.status);
					}

					if (fetchedSettings.organization_id === 2) {
						setOrganization("topbar.organizations.school");
					} else if (fetchedSettings.organization_id === 3) {
						setOrganization("topbar.organizations.city");
					} else {
						setOrganization("topbar.organizations.company");
					}

					if (fetchedBilling.status === "active") {
						setSubscriptionStatus(
							"topbar.subscription-status.active"
						);
					} else {
						setSubscriptionStatus(
							"topbar.subscription-status.inactive"
						);
					}
				}
			} catch (error) {
				console.error("Error fetching data", error);
			}
		};

		fetchData();
	}, []);

	const handleLogout = async () => {
		const { error } = await supabase.auth.signOut();
		if (error) {
			setErrorMessage("error.logout");
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
				<div className="md:w-1/5">
					<DarkModeButton />
				</div>
				<div className="hidden md:block md:w-1/4 text-center">
					<p>
						<T tkey="topbar.subscription" />
						<FaArrowRight className="inline-block mx-2 w-4 h-4 pb-1" />
						<Link href="/home/subscription">
							<span className="uppercase text-accent_color hover:text-accent_hover font-semibold transition-color duration-200 ease-linear">
								<T tkey={subscriptionStatus} />
							</span>
						</Link>
					</p>
				</div>
				<div className="hidden md:block md:w-1/4 text-center">
					<p>
						<T tkey="topbar.organization" />
						<FaArrowRight className="inline-block mx-2 w-4 h-4 pb-1" />
						<Link href="/home/account">
							<span className="uppercase text-accent_color hover:text-accent_hover font-semibold transition-color duration-200 ease-linear">
								<T tkey={organization} />
							</span>
						</Link>
					</p>
				</div>
				<div
					className="relative flex justify-end items-center gap-x-3 cursor-pointer md:w-1/4"
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
							className="absolute right-[-10px] top-10 w-40 bg-white dark:bg-dark_blue rounded-lg shadow-lg mt-2 overflow-hidden"
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
							<Link href="/home/subscription">
								<div className="flex items-center justify-start gap-x-1 px-4 py-3 hover:font-medium hover:bg-light_gray dark:hover:bg-mid_blue transition-all duration-100 ease-linear">
									<div className="w-8 h-8 flex justify-center items-center dark:border-light_gray">
										<MdPayment className="w-5 h-5" />
									</div>
									<p>
										<T tkey="topbar.subscription" />
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
