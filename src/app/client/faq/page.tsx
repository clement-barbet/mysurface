"use client";
import { Accordion } from "react-accessible-accordion";
import { CustomAccordionItem } from "@/components/ui/accordion_item";
import T from "@/components/translations/translation";

export default function Faq() {
	return (
		<div className="w-full m-auto p-5">
			<h2 className="text-3xl pb-5">
				<T tkey="faq.title" />
			</h2>
			<div className="w-full m-auto p-5 shadow-md rounded-lg bg-white dark:bg-black bg-opacity-90">
				<Accordion allowZeroExpanded>
					<CustomAccordionItem title="faq.questions.q1.q">
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
					<CustomAccordionItem title="faq.questions.q2.q">
						<T tkey="faq.questions.q2.a" />
					</CustomAccordionItem>
				</Accordion>
			</div>
		</div>
	);
}
