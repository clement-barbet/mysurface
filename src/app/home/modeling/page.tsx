"use client";
import ReportName from "./ReportName";
import SelectProcess from "./SelectProcess";
import UploadResults from "./UploadResults";
import React, { useState } from "react";

export default function Modeling() {
	const [processId, setProcessId] = useState(1);
	const [name, setName] = useState("");

	return (
		<div className="flex flex-col gap-y-2">
			<SelectProcess onProcessIdChange={setProcessId} />
			<ReportName onNameChange={setName} />
			<UploadResults processId={processId} reportName={name} />
		</div>
	);
}
