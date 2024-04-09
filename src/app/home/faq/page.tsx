"use client";
import { Accordion } from "react-accessible-accordion";
import { CustomAccordionItem } from "@/components/ui/accordion_item";

export default function Faq() {
	return (
		<div className="w-full m-auto p-5">
			<h2 className="text-3xl pb-5">Frequently Asked Questions</h2>
			<div className="w-full m-auto p-5 shadow-md rounded-lg bg-white dark:bg-black bg-opacity-90">
				<Accordion allowZeroExpanded>
					<CustomAccordionItem title="- How can I add new participants after generating the questionnaires?">
						If you forgot to add any participant to the team, don&apos;t
						worry, you can backtrack and follow the next process:
						<ol className="list-decimal list-inside ps-5 pt-5">
							<li>
								Click on <i>Reset Process Phase</i>, this will
								allow you to continue adding members to the
								team.
							</li>
							<li>
								Once you have finished adding participants, you
								can regenerate the questionnaires by clicking on{" "}
								<i>Create Questionnaires</i>.
							</li>
						</ol>
					</CustomAccordionItem>
					<CustomAccordionItem title="- How can I change my password?">
						You can access <i>My Account</i> directly, where you&apos;ll be
						able to update your password. If you forget your
						password, you can reset it at the login screen by
						clicking on <i>Forgot password?</i>. Then, you&apos;ll receive an
						email to set a new password.
					</CustomAccordionItem>
				</Accordion>
			</div>
		</div>
	);
}
