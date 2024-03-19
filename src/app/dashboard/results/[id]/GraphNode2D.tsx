"use client";

import { ForceGraph2D } from "react-force-graph";
import React, { useEffect, useRef } from "react";

export default function GraphNode2D({ graphData }) {
  const forceGraphRef = useRef(null);
  const containerRef = useRef(null);
  const [width, setWidth] = React.useState(0);
  const [height, setHeight] = React.useState(0);

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

  useEffect(() => {
    const resizeGraph = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setWidth(width);
        setHeight(height);
      }
    };

    resizeGraph();
    window.addEventListener("resize", resizeGraph);

    return () => {
      window.removeEventListener("resize", resizeGraph);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="border border-gray-200 rounded-lg"
      style={{ width: "100%", height: "600px" }}
    >
      <ForceGraph2D
        ref={forceGraphRef}
        graphData={graphData}
        width={width}
        height={height}
        nodeVal={(node) => node.val}
        nodeLabel="name"
        linkWidth={(link) => 1 / link.length}
      />
    </div>
  );
}
