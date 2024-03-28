"use client";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faBorderAll,
	faUserGroup,
	faMagnifyingGlassChart,
  faGear,
} from "@fortawesome/free-solid-svg-icons";

export default function DashboardNavbar() {
	const pathname = usePathname();
	console.log(pathname);

	return (
		<nav className="flex flex-col items-start w-64 h-screen bg-dark_blue z-50 text-light_gray">
			<div className="flex items-center justify-center w-full h-20 bg-mid_blue gap-x-3">
				<img src="/logo.svg" alt="mysurface_logo" className="w-10" />
				<h1 className="text-3xl font-fjalla">MySurface</h1>
			</div>
			<ul className="flex flex-col w-full">
				<li
					className={clsx("py-4 px-4 w-full tracking-wider", {
						"border-l-4 border-light_gray font-bold": pathname === "/dashboard",
					})}
				>
					<Link href="/dashboard/" className="hover:font-bold transition-all duration-200 ease-linear">
						<FontAwesomeIcon
							id="faBorderAll"
							icon={faBorderAll}
							className="pe-2"
						/>
						DASHBOARD
					</Link>
				</li>
				<li
					className={clsx("py-4 px-4 tracking-wider", {
						"border-l-4 border-light_gray font-bold":
							pathname === "/dashboard/participants",
					})}
				>
					<Link href="/dashboard/participants" className="hover:font-bold transition-all duration-200 ease-linear">
						<FontAwesomeIcon
							id="faUserGroup"
							icon={faUserGroup}
							className="pe-2"
						/>
						PARTICIPANTS
					</Link>
				</li>
				<li
					className={clsx("py-4 px-4 tracking-wider", {
						"border-l-4 border-light_gray font-bold":
							pathname === "/dashboard/results",
					})}
				>
					<Link href="/dashboard/results" className="hover:font-bold transition-all duration-200 ease-linear">
						<FontAwesomeIcon
							id="faMagnifyingGlassChart"
							icon={faMagnifyingGlassChart}
							className="pe-2"
						/>
						RESULTS
					</Link>
				</li>
				<li
					className={clsx("py-4 px-4 tracking-wider", {
						"border-l-4 border-light_gray font-bold":
							pathname === "/dashboard/results",
					})}
				>
					<Link href="" className="hover:font-bold transition-all duration-200 ease-linear">
						<FontAwesomeIcon
							id="faGear"
							icon={faGear}
							className="pe-2"
						/>
						SETTINGS
					</Link>
          <ul>
            <li className="ps-6 pt-1">
              <Link href="" className="hover:font-bold transition-all duration-200 ease-linear">
                Language
              </Link>
            </li>
            <li className="ps-6 pt-1">
              <Link href="" className="hover:font-bold transition-all duration-200 ease-linear">
                Theme
              </Link>
            </li>
            <li className="ps-6 pt-1">
              <Link href="" className="hover:font-bold transition-all duration-200 ease-linear">
                FAQ
              </Link>
            </li>
          </ul>
				</li>
			</ul>
		</nav>
	);
}
