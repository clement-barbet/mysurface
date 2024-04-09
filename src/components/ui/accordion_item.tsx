import {
	AccordionItem,
	AccordionItemHeading,
	AccordionItemButton,
	AccordionItemPanel,
} from "react-accessible-accordion";

export const CustomAccordionItem = ({ title, children }) => {
	return (
		<AccordionItem className="dark:text-light_gray text-black my-2 bg-gray-200 bg-opacity-70 dark:bg-opacity-30 rounded-md p-5">
			<AccordionItemHeading>
				<AccordionItemButton className="text-xl font-semibold">{title}</AccordionItemButton>
			</AccordionItemHeading>
			<AccordionItemPanel className="py-2 px-6 text-lg">{children}</AccordionItemPanel>
		</AccordionItem>
	);
};