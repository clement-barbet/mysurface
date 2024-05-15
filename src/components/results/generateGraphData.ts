export function generateGraphData(parsedResult) {
	const participantsNames = parsedResult.map(
		(participants) => participants.participantName
	);

	const influenceGradeList = parsedResult
		.flatMap((participants) => participants.data)
		.map((data) => ({
			participantId: data.participantId,
			participantName: data.participantName,
			influenceGrade: data.influenceGrade,
		}));

	const nodes = participantsNames.map((name) => {
		const list = influenceGradeList.filter(
			(influenceGradeEl) => influenceGradeEl.participantName === name
		);
		const sum = list.reduce((acc, curr) => acc + curr.influenceGrade, 0);
		const length = list.length;

		return {
			id: name,
			name: name,
			val: sum / length,
		};
	});

	const links = [];
	parsedResult.forEach((sourceParticipant) => {
		sourceParticipant.data.forEach((dataPoint) => {
			const targetParticipant = parsedResult.find(
				(participant) =>
					participant.participantName === dataPoint.participantName
			);
			if (targetParticipant) {
				let linkScore = dataPoint.interactionGrade * 2;
				if (linkScore > 0) {
					links.push({
						source: sourceParticipant.participantName,
						target: targetParticipant.participantName,
						value: linkScore,
					});
				}
			}
		});
	});

	const nodeValuesArray = nodes.map((node) => node.val);
	const minNodeValue = Math.min(...nodeValuesArray);
	const maxNodeValue = Math.max(...nodeValuesArray);
	nodes.forEach((node) => {
		let normalizedValue = (node.val =
			(node.val - (minNodeValue - 0.1)) / (maxNodeValue - minNodeValue));

		node.val = Math.pow(normalizedValue, 1.5);
	});

	return {
		nodes,
		links,
	};
}
