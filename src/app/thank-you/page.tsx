"use client";
import T from "@/components/translations/translation";

export default function ConfirmPage() {
	return (
		<>
			<div className="flex flex-col items-center gap-y-4 mt-5 px-10 md:px-0">
				<h2 className="w-full md:w-1/2 text-4xl pb-4 text-center">
					<T tkey="thankyou.title" />
				</h2>
				<p><T tkey="thankyou.text" /></p>
			</div>
		</>
	);
}
