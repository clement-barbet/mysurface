import DashboardNavbar from "@/components/dashboard/dashboard_navbar";
import TopBar from "@/components/dashboard/topbar";

export default function DashboardLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="flex relative">
			<div style={{ flex: "0 0 auto" }} className="md:relative md:w-64">
				<DashboardNavbar />
			</div>
			<div className="flex flex-grow flex-col w-full md:w-auto">
				<TopBar />
				<div
					style={{ flex: "1 0 auto" }}
					className="relative md:px-4 py-4 ps-14 pe-4"
				>
					{children}
				</div>
			</div>
		</div>
	);
}
