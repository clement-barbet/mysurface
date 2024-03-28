import DashboardNavbar from "@/components/navbar/dashboard_navbar";

export default function DashboardLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="flex">
			<div className="w-64">
				<DashboardNavbar />
			</div>
			<div className="flex-grow p-4">{children}</div>
		</div>
	);
}
