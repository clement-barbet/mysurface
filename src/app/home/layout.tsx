"use client";
import DashboardNavbar from "@/components/home/dashboard_navbar";
import TopBar from "@/components/home/topbar";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import Link from "next/link";

export default function HomeLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const pathname = usePathname();
	const isResultsIdPage =
		/^\/home\/(results|results-admin|backup)\/[^\/]+$/.test(pathname);

	const [isSmallScreen, setIsSmallScreen] = useState(false);

	useEffect(() => {
		const checkScreenSize = () => {
			setIsSmallScreen(window.innerWidth < 768);
		};

		checkScreenSize();
		window.addEventListener("resize", checkScreenSize);

		return () => window.removeEventListener("resize", checkScreenSize);
	}, []);

	return (
		<div className="flex relative">
			{isSmallScreen && isResultsIdPage && (
				<div className="absolute top-0 right-0 p-4 z-10">
					<Link href="/home/results">
						<FaTimes className="h-5 w-5 text-accent_delete cursor-pointer hover:text-accent_delete_hover transition-all duration-200 ease-linear" />
					</Link>
				</div>
			)}
			{!(isSmallScreen && isResultsIdPage) && (
				<div
					style={{ flex: "0 0 auto" }}
					className="md:relative md:w-48"
				>
					<DashboardNavbar />
				</div>
			)}
			<div className="flex flex-grow flex-col w-full md:w-auto h-full">
				{!(isSmallScreen && isResultsIdPage) && (
					<div className="h-10 md:relative">
						<TopBar />
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
	);
}
