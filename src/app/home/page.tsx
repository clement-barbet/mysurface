"use client";

import { Notification } from "@/components/home/notification";

export default function Home() {
	return (
		<div className="flex flex-col gap-y-4">
			<div className="flex flex-col md:flex-row md:gap-x-4 gap-y-4">
				<div className="h-auto w-full flex flex-col shadow-md rounded-lg bg-white dark:bg-black bg-opacity-90">
					<div className="px-10 py-5">
						<h2 className="font-bold text-lg">
							Admin&apos;s Guide
						</h2>
						<p className="text-gray-600 dark:text-gray-400">
							Steps to follow for admin tasks.
						</p>
						<ol className="text-gray-600 dark:text-gray-400 list-inside py-4">
							<li className="text-sm">
								<span className="text-xl font-bold text-blue-500 inline-block w-6">
									1.
								</span>
								Log-in with an administrator account
							</li>
							<li className="text-sm">
								<span className="text-xl font-bold text-blue-500 inline-block w-6">
									2.
								</span>
								Go to &quot;Participants&ldquo; section
							</li>
							<li className="text-sm">
								<span className="text-xl font-bold text-blue-500 inline-block w-6">
									3.
								</span>
								Inside &quot;Participants&ldquo; create new participants
							</li>
							<li className="text-sm">
								<span className="text-xl font-bold text-blue-500 inline-block w-6">
									4.
								</span>
								Click &quot;Create Questionnaire&ldquo; button to create
								questionnaires for the participants
							</li>
							<li className="text-sm">
								<span className="text-xl font-bold text-blue-500 inline-block w-6">
									5.
								</span>
								Copy each participant link and share with them
							</li>
							<li className="text-sm">
								<span className="text-xl font-bold text-blue-500 inline-block w-6">
									6.
								</span>
								Make participants complete the questionnaire
							</li>
							<li className="text-sm">
								<span className="text-xl font-bold text-blue-500 inline-block w-6">
									7.
								</span>
								Go to &quot;Results&ldquo; page
							</li>
							<li className="text-sm">
								<span className="text-xl font-bold text-blue-500 inline-block w-6">
									8.
								</span>
								Click &quot;Generate report&ldquo; button and the animation
								with analytics will show up
							</li>
						</ol>
					</div>
				</div>
				<div className="h-auto w-full flex flex-col shadow-md rounded-lg bg-white dark:bg-black bg-opacity-90">
					<div className="px-10 py-5">
						<h2 className="font-bold text-lg">User&apos;s Guide</h2>
						<p className="text-gray-600 dark:text-gray-400">
							Steps to follow for user tasks.
						</p>
						<ol className="text-gray-600 dark:text-gray-400 list-inside py-4">
							<li className="text-sm">
								<span className="text-xl font-bold text-blue-500 inline-block w-6">
									1.
								</span>
								Access the link provided by your administrator
							</li>
							<li className="text-sm">
								<span className="text-xl font-bold text-blue-500 inline-block w-6">
									2.
								</span>
								Access the questionnaire shared by your
								administrator
							</li>
							<li className="text-sm">
								<span className="text-xl font-bold text-blue-500 inline-block w-6">
									3.
								</span>
								Complete the questionnaire questions about your
								teammates / classmates
							</li>
							<li className="text-sm">
								<span className="text-xl font-bold text-blue-500 inline-block w-6">
									4.
								</span>
								Send the results to your administrator
							</li>
						</ol>
					</div>
				</div>
			</div>
			<div className="h-auto w-full flex flex-col shadow-md rounded-lg bg-white dark:bg-black bg-opacity-90">
				<div className="px-10 py-5">
					<div className="mb-2">
						<h2 className="font-bold text-lg">Updates</h2>
						<p className="text-gray-600 dark:text-gray-400">
							Check platform updates and news.
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
