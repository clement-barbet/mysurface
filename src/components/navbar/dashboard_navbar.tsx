"use client";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardNavbar() {
  const pathname = usePathname();
  console.log(pathname);

  return (
    <nav>
      <ul className=" flex items-center ">
        <li
          className={clsx("", {
            " px-4 py-2 border-b border-black": pathname === "/dashboard",
          })}
        >
          <Link href="/dashboard/">Home</Link>
        </li>
        <li
          className={clsx("px-4 py-2", {
            " px-4 py-2 border-b border-black":
              pathname === "/dashboard/participants",
          })}
        >
          <Link href="/dashboard/participants">Participants</Link>
        </li>
        <li
          className={clsx("px-4 py-2", {
            "  border-b border-black": pathname === "/dashboard/results",
          })}
        >
          <Link href="/dashboard/results">Results</Link>
        </li>
      </ul>
    </nav>
  );
}
