"use client";

import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { useState } from "react";
import GraphNode2D from "./GraphNode2D";
import GraphNode3D from "./GraphNode3D";
import T from "@/components/translations/translation";
import GraphNode3DBlooming from "./GraphNode3DBlooming";
import { useMediaQuery } from "react-responsive";

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
	const isMediumScreen = useMediaQuery({ minWidth: 768 });

	return (
		<Tabs
			selectedIndex={tabIndex}
			onSelect={(index) => setTabIndex(index)}
			className="pt-2"
		>
			<TabList className="flex justify-between align-bottom text-sm">
				<div className="flex">
					<Tab
						className={`box-border border-none outline-none hover:cursor-pointer mr-1 md:px-4 px-2  ${
							tabIndex === 0
								? "font-semibold border-none underline underline-offset-4 text-accent_color"
								: "text-light_gray"
						}`}
					>
						{isMediumScreen ? (
							<T tkey="results.tabs.3dplus" />
						) : (
							<T tkey="results.tabs.3dplus-short" />
						)}
					</Tab>
					<Tab
						className={`box-border border-none outline-none hover:cursor-pointer mr-1 md:px-4 px-2  ${
							tabIndex === 1
								? "font-semibold border-none underline underline-offset-4 text-accent_color"
								: "text-light_gray"
						}`}
					>
						{isMediumScreen ? (
							<T tkey="results.tabs.3d" />
						) : (
							<T tkey="results.tabs.3d-short" />
						)}
					</Tab>
					<Tab
						className={`box-border border-none outline-none hover:cursor-pointer mr-1 md:px-4 px-2 ${
							tabIndex === 2
								? "font-semibold border-none underline underline-offset-4 text-accent_color"
								: "text-light_gray"
						}`}
					>
						{isMediumScreen ? (
							<T tkey="results.tabs.2d" />
						) : (
							<T tkey="results.tabs.2d-short" />
						)}
					</Tab>
				</div>
				<div className="flex gap-x-4 pe-10 md:pe-2 items-end text-light_gray text-sm">
					<p>
						<b><T tkey="results.graph.labels.id" /></b>: {reportId}
					</p>
					<p className="lg:block hidden">
						<b><T tkey="results.graph.labels.name" /></b>: {reportName}
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
