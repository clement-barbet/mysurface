"use client";

import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { useState } from "react";
import GraphNode2D from "./GraphNode2D";
import GraphNode3D from "./GraphNode3D";
import T from "@/components/translations/translation";
import GraphNode3DBlooming from "./GraphNode3DBlooming";

interface GraphTabsProps {
	graphData: any;
	reportId: string;
	reportName: string;
}

export default function GraphTabs({
	graphData,
	reportId,
	reportName,
}: GraphTabsProps) {
	const [tabIndex, setTabIndex] = useState(0);

	return (
		<Tabs selectedIndex={tabIndex} onSelect={(index) => setTabIndex(index)} className="pt-2">
			<TabList className="flex justify-between align-bottom text-sm">
				<div className="flex">
					<Tab
						className={`box-border border-none outline-none hover:cursor-pointer mr-1 px-4  ${
							tabIndex === 0 ? "font-semibold border-none underline underline-offset-4 text-accent_color" : "text-light_gray"
						}`}
					>
						<T tkey="results.tabs.3dplus" />
					</Tab>
					<Tab
						className={`box-border border-none outline-none hover:cursor-pointer mr-1 px-4  ${
							tabIndex === 1 ? "font-semibold border-none underline underline-offset-4 text-accent_color" : "text-light_gray"
						}`}
					>
						<T tkey="results.tabs.3d" />
					</Tab>
					<Tab
						className={`box-border border-none outline-none hover:cursor-pointer mr-1 px-4 ${
							tabIndex === 2 ? "font-semibold border-none underline underline-offset-4 text-accent_color" : "text-light_gray"
						}`}
					>
						<T tkey="results.tabs.2d" />
					</Tab>
				</div>
				<div className="flex gap-x-4 pe-10 md:pe-2 items-end text-light_gray text-sm">
					<p>
						<b>ID</b>: {reportId}
					</p>
					<p className="md:block hidden">
						<b>Name</b>: {reportName}
					</p>
				</div>
			</TabList>

			<TabPanel>
				<GraphNode3DBlooming graphData={graphData} />
			</TabPanel>
			<TabPanel>
				<GraphNode3D graphData={graphData} />
			</TabPanel>
			<TabPanel>
				<GraphNode2D graphData={graphData} />
			</TabPanel>
		</Tabs>
	);
}
