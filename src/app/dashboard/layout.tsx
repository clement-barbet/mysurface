import DashboardNavbar from "@/components/navbar/dashboard_navbar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <DashboardNavbar />
      <div>{children}</div>
    </div>
  );
}
