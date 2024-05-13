"use client";
import dynamic from "next/dynamic";
import React, { useEffect, useRef, useState } from "react";
import ColorLegend from "./ColorLegend";
import { scalePow } from "d3";
import { createGroups, getNodeGroup } from "./grouping";
import NodeInfo from "./NodeInfo";

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
	const [currentNode, setCurrentNode] = useState(null);
	const [ForceGraph2D, setForceGraph2D] = useState(null);

	useEffect(() => {
		import("react-force-graph")
			.then((mod) => {
				setForceGraph2D(mod.ForceGraph2D);
			})
			.catch((error) => {
				console.error("Error loading ForceGraph2D:", error);
			});
	}, []);

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
		if (forceGraphRef.current) {
			forceGraphRef.current
				.d3Force("link")
				.distance((link) => link.value * 20)
				.strength((link) => link.value * 0.04);
		}
	}, [forceGraphRef.current, dimensions, ForceGraph2D]);

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

	if (!ForceGraph2D) {
		return null;
	}

	return (
		<div className="bg-graph_bg w-full relative">
			{currentNode && <NodeInfo currentNode={currentNode} />}
			<ForceGraph2D
				ref={forceGraphRef}
				graphData={graphData}
				width={dimensions.width}
				height={dimensions.height}
				nodeVal={(node) => node.val}
				nodeLabel={(node) => {
					return `${node.name} (${node.val.toFixed(2)})`;
				}}
				onNodeHover={(node) => {
					if (node) {
						document.body.style.cursor = "grab";
						const group = getNodeGroup(node.val, groups);
						setCurrentNode({
							name: node.name,
							value: node.val.toFixed(2),
							group: group.group,
							action: group.action,
						});
					} else {
						document.body.style.cursor = "default";
						setCurrentNode(null);
					}
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
