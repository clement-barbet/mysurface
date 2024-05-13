"use client";
import dynamic from "next/dynamic";
import React, { useEffect, useRef, useState } from "react";
import ColorLegend from "./ColorLegend";
import { scalePow } from "d3";
import { createGroups, getNodeGroup } from "./grouping";

interface GraphNode2DProps {
	graphData: any;
}

const ForceGraph2D = dynamic(
	() => import("react-force-graph").then((mod) => mod.ForceGraph2D),
	{ ssr: false }
);

export default function GraphNode2D({ graphData }: GraphNode2DProps) {
	const forceGraphRef = useRef();
	const groups = createGroups(graphData.nodes);

	const [dimensions, setDimensions] = useState({
		width: typeof window !== "undefined" ? window.innerWidth : 0,
		height: typeof window !== "undefined" ? window.innerHeight : 0,
	});

	useEffect(() => {
		const resizeGraph = () => {
			const width =
				window.innerWidth < 768
					? window.innerWidth - 20
					: window.innerWidth - 210;
			const height =
				window.innerWidth < 768
					? window.innerHeight - 100
					: window.innerHeight - 140;
			setDimensions({
				width,
				height,
			});
		};
		resizeGraph();
		window.addEventListener("resize", resizeGraph);
		return () => {
			window.removeEventListener("resize", resizeGraph);
		};
	}, []);

	useEffect(() => {
		const forceGraphInstance = forceGraphRef.current;
		if (forceGraphInstance) {
			const linkForce = forceGraphInstance.d3Force("link");
			if (linkForce) {
				linkForce.distance((link) => link.length || 100);
				forceGraphInstance.d3ReheatSimulation();
			}
		}
	}, []);

	const maxSize = Math.max(...graphData.nodes.map((node) => node.val));
	const minSize = Math.min(...graphData.nodes.map((node) => node.val));

	// 	hsl(190, 78%, 35%)
	const ranges = [
		"hsl(180, 45%, 30%)",
		"hsl(200, 50%, 60%)",
		"hsl(220, 55%, 90%)",
	];
	const colorScale = scalePow()
		.exponent(3)
		.domain([minSize, (minSize + maxSize) / 2, maxSize])
		.range(ranges);

	const getNodeColor = (node) => {
		return colorScale(node.val);
	};

	return (
		<div className="bg-graph_bg w-full">
			<ForceGraph2D
				ref={forceGraphRef}
				graphData={graphData}
				width={dimensions.width}
				height={dimensions.height}
				nodeVal={(node) => node.val}
				nodeLabel={(node) => {
					const group = getNodeGroup(node.val, groups);
					return `${node.name} > value: ${node.val.toFixed(2)} - ${
						group.group
					}, ${group.action}`;
				}}
				linkWidth={0.3}
				nodeColor={getNodeColor}
				backgroundColor="#000000"
				linkAutoColorBy="#ffffff"
			/>
			<ColorLegend minSize={minSize} maxSize={maxSize} ranges={ranges} />
		</div>
	);
}
