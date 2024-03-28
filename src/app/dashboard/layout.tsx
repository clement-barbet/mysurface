import DashboardNavbar from "@/components/navbar/dashboard_navbar";

export default function DashboardLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="flex relative">
			<DashboardNavbar />
			<div className="flex-grow py-4 ps-14 md:ps-4">{children}</div>
		</div>
	);
}
