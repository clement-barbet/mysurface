import T from "@/components/translations/translation";

export default function LicenseTypes() {
	return (
		<div className="flex md:flex-row flex-col md:gap-x-2 lg:gap-x-4 xl:gap-x-6 gap-y-4 w-full mt-2">
			<div className="card w-full bg-light_gray dark:bg-dark_blue  rounded-md overflow-hidden">
				<div className="bg-accent_color text-white p-4 text-center">
					<h3 className="font-semibold text-xl">
						<T tkey="license.types.trial.title" />
					</h3>
					<h4>
						<T tkey="license.types.trial.subtitle" />
					</h4>
					<p className="uppercase font-light text-3xl mt-2">
						<T tkey="license.types.trial.tax" />
					</p>
				</div>
				<div className="text-center py-2">
					<p>
						<T tkey="license.types.trial.list.l1" />
					</p>
					<p>
						<T tkey="license.types.trial.list.l2" />
					</p>
					<p>
						<T tkey="license.types.trial.list.l3" />
					</p>
					<p>
						<T tkey="license.types.trial.list.l4" />
					</p>
				</div>
			</div>
			<div className="card w-full bg-light_gray dark:bg-dark_blue rounded-md overflow-hidden">
				<div className="bg-accent_delete text-white p-4 text-center">
					<h3 className="font-semibold text-xl">
						<T tkey="license.types.annual.title" />
					</h3>
					<h4>
						<T tkey="license.types.annual.subtitle" />
					</h4>
					<p className="uppercase font-light text-3xl mt-2">
						<T tkey="license.types.annual.tax" />
					</p>
				</div>
				<div className="text-center py-2">
					<p>
						<T tkey="license.types.annual.list.l1" />
					</p>
					<p>
						<T tkey="license.types.annual.list.l2" />
					</p>
					<p>
						<T tkey="license.types.annual.list.l3" />
					</p>
					<p>
						<T tkey="license.types.annual.list.l4" />
					</p>
				</div>
			</div>
			<div className="card w-full bg-light_gray dark:bg-dark_blue rounded-md overflow-hidden">
				<div className="bg-mid_blue text-white p-4 text-center">
					<h3 className="font-semibold text-xl">
						<T tkey="license.types.webinar.title" />
					</h3>
					<h4>
						<T tkey="license.types.webinar.subtitle" />
					</h4>
					<p className="uppercase font-light text-3xl mt-2">
						<T tkey="license.types.webinar.tax" />
					</p>
				</div>
				<div className="text-center py-2">
					<p>
						<T tkey="license.types.webinar.list.l1" />
					</p>
					<p>
						<T tkey="license.types.webinar.list.l2" />
					</p>
					<p>
						<T tkey="license.types.webinar.list.l3" />
					</p>
					<p>
						<T tkey="license.types.webinar.list.l4" />
					</p>
				</div>
			</div>
		</div>
	);
}
