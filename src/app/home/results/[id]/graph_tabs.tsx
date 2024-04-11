"use client";

import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { useState } from "react";
import GraphNode2D from "./GraphNode2D";
import GraphNode3D from "./GraphNode3D";
import T from "@/components/translations/translation";

interface GraphTabsProps {
	graphData: any;
}

export default function GraphTabs({ graphData }: GraphTabsProps) {
	const [tabIndex, setTabIndex] = useState(0);

	return (
		<Tabs selectedIndex={tabIndex} onSelect={(index) => setTabIndex(index)}>
			<TabList className="flex border-b">
				<Tab
					className={`box-border hover:cursor-pointer mr-1 py-2 px-4 bg-white hover:bg-gray-100 rounded-t-lg border border-gray-400 text-gray-800 ${
						tabIndex === 0 ? "font-semibold border-2" : ""
					}`}
				>
					<T tkey="results.tabs.2d" />
				</Tab>
				<Tab
					className={`box-border hover:cursor-pointer mr-1 py-2 px-4 bg-white hover:bg-gray-100 rounded-t-lg border border-gray-400 text-gray-800 ${
						tabIndex === 1 ? "font-semibold border-2" : ""
					}`}
				>
					<T tkey="results.tabs.3d" />
				</Tab>
			</TabList>

			<TabPanel>
				<GraphNode2D graphData={graphData} />
			</TabPanel>
			<TabPanel>
				<GraphNode3D graphData={graphData} />
			</TabPanel>
		</Tabs>
	);
}
