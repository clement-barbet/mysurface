"use client";

import { ForceGraph2D } from "react-force-graph";
import React, { useEffect, useRef } from "react";

export default function GraphNode2D({ graphData }) {
  const forceGraphRef = useRef(null);

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

  return (
    <div className="border border-gray-200 rounded-lg">
      <ForceGraph2D
        ref={forceGraphRef}
        graphData={graphData}
        width={600}
        height={400}
        nodeVal={(node) => node.val}
        nodeLabel="name"
        linkWidth={(link) => 1 / link.length}
      />
    </div>
  );
}
