import DashboardNavbar from "@/components/navbar/dashboard_navbar";

export default function DashboardLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="flex relative">
			<DashboardNavbar />
			<div className="flex-grow md:px-4 py-4 px-14">{children}</div>
		</div>
	);
}
