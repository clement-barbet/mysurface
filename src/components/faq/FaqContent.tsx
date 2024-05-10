"use client";
import { Accordion } from "react-accessible-accordion";
import { CustomAccordionItem } from "@/components/ui/accordion_item";
import T from "@/components/translations/translation";
import { useEffect, useState } from "react";

export default function FaqContent() {
	const [defaultItem, setDefaultItem] = useState("");

	useEffect(() => {
		if (typeof window !== "undefined") {
			const urlParams = new URLSearchParams(window.location.search);
			const defaultItem = urlParams.get("defaultItem");
			setDefaultItem(defaultItem);
		}
	}, []);

	return (
		defaultItem !== "" && (
			<div className="w-full m-auto">
				<div className="w-full m-auto p-5 shadow-md rounded-lg bg-white dark:bg-black bg-opacity-90">
					<Accordion allowZeroExpanded preExpanded={[defaultItem]}>
						<CustomAccordionItem
							title="faq.questions.q1.q"
							id="first"
						>
							<T tkey="faq.questions.q1.a.a1" />
							<ol className="list-decimal list-inside ps-5 pt-5">
								<li>
									<T tkey="faq.questions.q1.a.a2" />
								</li>
								<li>
									<T tkey="faq.questions.q1.a.a3" />
								</li>
							</ol>
						</CustomAccordionItem>
						<CustomAccordionItem
							title="faq.questions.q2.q"
							id="second"
						>
							<T tkey="faq.questions.q2.a" />
						</CustomAccordionItem>
						<CustomAccordionItem
							title="faq.questions.q3.q"
							id="csv_item"
						>
							<T tkey="faq.questions.q3.a.a1" />
							<ul className=" list-inside list-disc ps-5 pt-5">
								<li>
									<T tkey="faq.questions.q3.a.a2" />
								</li>
								<li>
									<T tkey="faq.questions.q3.a.a3" />
								</li>
								<li>
									<T tkey="faq.questions.q3.a.a4" />
								</li>
								<li>
									<T tkey="faq.questions.q3.a.a5" />
								</li>
							</ul>
						</CustomAccordionItem>
					</Accordion>
				</div>
			</div>
		)
	);
}
