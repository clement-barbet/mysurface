"use client";
import T from "@/components/translations/translation";
import { useEffect } from "react";

export default function ThankYouPage() {
	useEffect(() => {
		const timer = setTimeout(() => {
			window.location.href = "https://mysurface.myaudit.org";
		}, 2000);

		return () => clearTimeout(timer);
	}, []);
	return (
		<>
			<div className="flex flex-col items-center gap-y-4 mt-5 px-10 md:px-0">
				<h2 className="w-full md:w-1/2 text-4xl pb-4 text-center">
					<T tkey="thankyou.title" />
				</h2>
				<p>
					<T tkey="thankyou.text" />
				</p>
			</div>
		</>
	);
}
