"use client";
import DashboardNavbar from "@/components/home/dashboard_navbar";
import TopBar from "@/components/home/topbar";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import Link from "next/link";
import Loading from "@/components/ui/loading";
import { fetchUser } from "@/db/auth_user/fetchUser";
import { fetchBilling } from "@/db/billings/fetchBillingByUserId";

export default function HomeLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const [user, setUser] = useState(null);
	const pathname = usePathname();
	const pathArray = pathname.split("/");
	pathArray.pop();
	const return_path = pathArray.join("/");
	const isResultsIdPage =
		/^\/home\/(results|results-admin|backup|results-examples)\/[^\/]+$/.test(
			pathname
		);

	const [isSmallScreen, setIsSmallScreen] = useState(false);
	const [loading, setLoading] = useState(true);
	const [subscription, setSubscription] = useState(null);
	const [bannerMessage, setBannerMessage] = useState("");
	const [showBanner, setShowBanner] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				const fetchedUser = await fetchUser();
				setUser(fetchedUser);
				const fetchedBilling = await fetchBilling(fetchedUser.id);
				setSubscription(fetchedBilling);
			} catch (error) {
				console.error("Error fetching data", error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	useEffect(() => {
		const checkScreenSize = () => {
			setIsSmallScreen(window.innerWidth < 768);
		};

		checkScreenSize();
		window.addEventListener("resize", checkScreenSize);

		return () => window.removeEventListener("resize", checkScreenSize);
	}, []);

	useEffect(() => {
		if (subscription) {
			let daysUntilExpiration;
			if (
				subscription.subscription !== "none" &&
				subscription.subscription !== "lifetime"
			) {
				const currentDate = new Date();
				const expirationDate = new Date(subscription.expiration_date);
				const oneDay = 24 * 60 * 60 * 1000;
				daysUntilExpiration = Math.round(
					Math.abs((currentDate - expirationDate) / oneDay)
				);
			}

			let message = "";
			if (subscription.subscription === "none") {
				message = "You don't have a license.";
			} else if (subscription.subscription === "trial") {
				message = `You are on a trial period. It will expire in ${daysUntilExpiration} days.`;
			} else if (
				subscription.subscription === "yearly" &&
				daysUntilExpiration <= 30
			) {
				message = `Your annual license is about to expire. It will expire in ${daysUntilExpiration} days.`;
			}

			setBannerMessage(message);
		}
	}, [subscription]);

	if (loading) {
		return <Loading />;
	}

	return (
		<>
			{!(isSmallScreen && isResultsIdPage) &&
			bannerMessage &&
			showBanner ? (
				<div
					className="banner m-0 text-black dark:text-black px-4 py-2 w-full font-semibold fixed top-0 bg-accent_light flex justify-between items-center drop-shadow-sm flex-shrink-0"
					style={{ zIndex: 200 }}
				>
					<p>{bannerMessage}{" "}Manage your license <Link href="/home/license" className="text-accent_color hover:text-accent_hover font-bold uppercase">HERE</Link>.</p>
					<button
						onClick={() => setShowBanner(false)}
						className="font-bold text-2xl z-100"
					>
						×
					</button>
				</div>
			) : null}
			<div className="flex relative">
				{isSmallScreen && isResultsIdPage && (
					<div className="absolute top-0 right-0 p-4 z-10">
						<Link href={return_path}>
							<FaTimes className="h-5 w-5 text-accent_delete cursor-pointer hover:text-accent_delete_hover transition-all duration-200 ease-linear" />
						</Link>
					</div>
				)}
				{!(isSmallScreen && isResultsIdPage) && (
					<div
						style={{ flex: "0 0 auto" }}
						className="md:relative md:w-48"
					>
						<DashboardNavbar user={user} />
					</div>
				)}
				<div className="flex flex-grow flex-col w-full md:w-auto h-full">
					{!(isSmallScreen && isResultsIdPage) && (
						<div className="h-10 md:relative">
							<TopBar user={user} />
						</div>
					)}
					<div
						style={{ flex: "1 0 auto" }}
						className={`relative py-2 px-2 ${
							isSmallScreen && !isResultsIdPage
								? "px-0 ps-12 pe-2"
								: ""
						}`}
					>
						{children}
					</div>
				</div>
			</div>
		</>
	);
}
