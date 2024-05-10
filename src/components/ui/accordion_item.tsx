import {
	AccordionItem,
	AccordionItemHeading,
	AccordionItemButton,
	AccordionItemPanel,
} from "react-accessible-accordion";
import { useTranslation } from 'react-i18next';

export const CustomAccordionItem = ({ id, title, children }) => {
	const { t } = useTranslation();
	return (
		<AccordionItem uuid={id} className="dark:text-light_gray text-black my-3 bg-sky-100 bg-opacity-70 dark:bg-opacity-20 rounded-md p-5 border border-sky-200 drop-shadow">
			<AccordionItemHeading>
				<AccordionItemButton className="text-lg font-semibold">{t(title)}</AccordionItemButton>
			</AccordionItemHeading>
			<AccordionItemPanel className="py-2 md:px-6">{children}</AccordionItemPanel>
		</AccordionItem>
	);
};