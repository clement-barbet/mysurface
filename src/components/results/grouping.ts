export const createGroups = (nodes) => {
	const minSize = Math.min(...nodes.map((node) => node.val));
	const maxSize = Math.max(...nodes.map((node) => node.val));

	// Order node values to calculate percentiles
	const sortedValues = nodes.map((node) => node.val).sort((a, b) => a - b);

	// Calculate percentiles (33% and 66%)
	const x = sortedValues[Math.floor(sortedValues.length * 0.33)];
	const y = sortedValues[Math.floor(sortedValues.length * 0.66)];

	// Create groups based on percentiles
	const groups = [
		{
			min: minSize,
			max: x,
			group: "results.graph.groups.below",
			action: "results.graph.actions.improve",
		},
		{ min: x, max: y, group: "results.graph.groups.average", action: "results.graph.actions.no-action" },
		{
			min: y,
			max: maxSize,
			group: "results.graph.groups.above",
			action: "results.graph.actions.strategic",
		},
	];

	return groups;
};

export const getNodeGroup = (value, groups) => {
	for (let group of groups) {
		if (value >= group.min && value <= group.max) {
			return group;
		}
	}
};
