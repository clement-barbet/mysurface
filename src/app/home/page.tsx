"use client";
import { Notification } from "@/components/home/notification";
import T from "@/components/translations/translation";

export default function Home() {
	return (
		<div className="flex flex-col gap-y-2">
			<div className="px-4 md:px-10 py-5 py-h-auto w-full flex flex-col shadow-md rounded-lg bg-white dark:bg-black bg-opacity-90">
				<h2 className="text-xl mb-2 font-semibold border-l-4 border-mid_blue pl-2">
					<T tkey="home.welcome.title" />
				</h2>
				<p className="text-gray-600 dark:text-gray-400 text-lg md:text-base">
					<T tkey="home.welcome.subtitle" />
				</p>
			</div>
			<div className="flex flex-col md:flex-row md:gap-x-2 gap-y-2">
				<div className="h-auto w-full flex flex-col shadow-md rounded-lg bg-white dark:bg-black bg-opacity-90">
					<div className="px-4 md:px-10 py-5">
						<h2 className="text-xl mb-2 font-semibold border-l-4 border-mid_blue pl-2">
							<T tkey="home.guide.admin.title" />
						</h2>
						<p className="text-gray-600 dark:text-gray-400 text-lg md:text-base">
							<T tkey="home.guide.admin.subtitle" />
						</p>
						<table className="border-collapse w-full my-1">
							<tbody>
								{Array.from({ length: 8 }, (_, i) => (
									<tr key={i}>
										<td className="text-accent_color pr-2 py-1 font-semibold align-top">
											{i + 1}.
										</td>
										<td className="py-1">
											<T
												tkey={`home.guide.admin.steps.s${
													i + 1
												}`}
											/>.
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
				<div className="h-auto w-full flex flex-col shadow-md rounded-lg bg-white dark:bg-black bg-opacity-90">
					<div className="px-4 md:px-10 py-5">
						<h2 className="text-xl mb-2 font-semibold border-l-4 border-mid_blue pl-2">
							<T tkey="home.guide.user.title" />
						</h2>
						<p className="text-gray-600 dark:text-gray-400 text-lg md:text-base">
							<T tkey="home.guide.user.subtitle" />
						</p>
						<table className="border-collapse w-full my-1">
							<tbody>
								{Array.from({ length: 3 }, (_, i) => (
									<tr key={i}>
										<td className="text-accent_color pr-2 py-1 font-semibold align-top">
											{i + 1}.
										</td>
										<td className="py-1">
											<T
												tkey={`home.guide.user.steps.s${
													i + 1
												}`}
											/>.
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
			<div className="h-auto w-full flex flex-col shadow-md rounded-lg bg-white dark:bg-black bg-opacity-90">
				<div className="px-4 md:px-10 py-5">
					<div className="mb-2">
						<h2 className="text-xl mb-2 font-semibold border-l-4 border-mid_blue pl-2">
							<T tkey="home.updates.title" />
						</h2>
						<p className="text-gray-600 dark:text-gray-400 text-lg md:text-base">
							<T tkey="home.updates.subtitle" />
						</p>
					</div>
					<Notification
						type="update"
						msg="New version of MySurface available."
						link="#"
					/>
					<Notification
						type="news"
						msg="New functionalities will be added soon."
						link="#"
					/>
				</div>
			</div>
		</div>
	);
}
