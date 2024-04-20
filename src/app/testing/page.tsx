"use client";
import React, { useEffect, useState } from "react";
import { json_results } from "./test_results";

export default function Testing() {
	const [averages, setAverages] = useState({});

	useEffect(() => {
		let ratings = {};

		for (let result of json_results) {
			for (let data of result.data) {
				let participantName = data.participantName;
				let thirdQuestion = data.answers[2];
				if (thirdQuestion) {
					if (!ratings[participantName]) {
						ratings[participantName] = { sum: 0, count: 0 };
					}
					ratings[participantName].sum += thirdQuestion.rating;
					ratings[participantName].count++;
				}
			}
		}

		let newAverages = {};
		for (let participantName in ratings) {
			newAverages[participantName] =
				ratings[participantName].sum / ratings[participantName].count;
		}

		setAverages(newAverages);
	}, []);

	const copyToClipboard = () => {
		let csvContent =
			"Participant,Average Rating\n" +
			Object.entries(averages)
				.sort((a, b) => {
					let numA = parseInt(a[0].replace("user", ""));
					let numB = parseInt(b[0].replace("user", ""));
					return numA - numB;
				})
				.map(([participant, average]) => `${participant},${average}`)
				.join("\n");

		navigator.clipboard.writeText(csvContent);
	};

	return (
		<div className="w-full m-auto">
			<button onClick={copyToClipboard}>Copy to Clipboard</button>
			<table>
				<thead>
					<tr>
						<th>Participant</th>
						<th>Average Rating</th>
					</tr>
				</thead>
				<tbody>
					{Object.entries(averages)
						.sort((a, b) => {
							let numA = parseInt(a[0].replace("user", ""));
							let numB = parseInt(b[0].replace("user", ""));
							return numA - numB;
						})
						.map(([participant, average]) => (
							<tr key={participant}>
								<td>{participant}</td>
								<td>{average}</td>
							</tr>
						))}
				</tbody>
			</table>
		</div>
	);
}
