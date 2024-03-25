"use client";

import { ForceGraph3D } from "react-force-graph";
import React, { useRef } from "react";

interface GraphNode3DProps {
  graphData: any;
}

export default function GraphNode3D({ graphData }: GraphNode3DProps) {
  const fgRef = useRef(null);

  return (
    <div style={{ width: "100%", height: "600px" }}>
      <ForceGraph3D
        ref={fgRef}
        backgroundColor="#000003"
        graphData={graphData}
        nodeLabel="id"
        nodeAutoColorBy="group"
      />
    </div>
  );
}
