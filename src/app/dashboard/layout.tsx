import DashboardNavbar from "@/components/navbar/dashboard_navbar";
import TopBar from "@/components/topbar/topbar";

export default function DashboardLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="flex relative">
			<DashboardNavbar />
			<div className="flex flex-grow flex-col">
				<TopBar />
				<div style={{ zIndex: -20 }} className="md:px-4 py-4 px-14">{children}</div>
			</div>
		</div>
	);
}
