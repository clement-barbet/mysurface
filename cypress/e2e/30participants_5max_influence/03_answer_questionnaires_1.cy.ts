describe("template spec", () => {
	it("passes", () => {
		cy.visit("http://localhost:3000/login").then(() => {
			let access_email = "not@admin.com";
			let access_password = "test1234";

			cy.get("input[name=email]").type(access_email);
			cy.get("input[name=password]").type(access_password);
			cy.get("button[type=submit]").click();

			cy.url({ timeout: 30000 }).should("include", "/home");
		});
		
		cy.visit("http://localhost:3000/home/participants").then(() => {
			cy.wait(10000);

			// Array of all participants
			let participants = [];
			// Array of pairs of participants that will mutual random scores
			let randomEvaluations = [];

			cy.get("table tbody tr")
				.each(($row) => {
					cy.wrap($row)
						.find(".evaluator-name")
						.then(($participantName) => {
							participants.push($participantName.text());
						});
				})
				.then(() => {
					participants.sort((a, b) => {
						const numA = parseInt(a.replace("user", ""));
						const numB = parseInt(b.replace("user", ""));
						return numA - numB;
					});
					console.log("participants", participants);

					// Divide participants into groups of 5
					let groups = [];
					for (let i = 0; i < participants.length; i += 5) {
						groups.push(participants.slice(i, i + 5));
					}

					console.log("groups", groups);

					// For each group, make each participant evaluate the other 4 members
					groups.forEach((group) => {
						group.forEach((participant) => {
							let others = group.filter((p) => p !== participant);
							others.forEach((other) => {
								// Check if the pair already exists in randomEvaluations
								let pairExists = randomEvaluations.some(
									([p1, p2]) => {
										return (
											(participant === p1 &&
												other === p2) ||
											(participant === p2 && other === p1)
										);
									}
								);

								// If the pair does not exist, add it to randomEvaluations
								if (!pairExists) {
									randomEvaluations.push([
										participant,
										other,
									]);
								}
							});
						});
					});

					// For each participant, select one participant from another group for evaluation

					participants.forEach((participant) => {
						if (
							parseInt(participant.replace("user", "")) % 5 !==
							0
						) {
							let otherGroups = groups.filter(
								(group) => !group.includes(participant)
							);
							let otherParticipant;
							let pairExists;

							do {
								let otherGroup =
									otherGroups[
										Math.floor(
											Math.random() * otherGroups.length
										)
									];
								let otherParticipants = otherGroup.filter(
									(p) =>
										parseInt(p.replace("user", "")) % 5 !==
										0
								);

								otherParticipant =
									otherParticipants[
										Math.floor(
											Math.random() *
												otherParticipants.length
										)
									];

								// Check if the pair already exists in randomEvaluations
								pairExists = randomEvaluations.some(
									([p1, p2]) => {
										return (
											(participant === p1 &&
												otherParticipant === p2) ||
											(participant === p2 &&
												otherParticipant === p1)
										);
									}
								);

								// If the pair exists, remove the group from the list of potential otherGroups
								if (pairExists) {
									otherGroups = otherGroups.filter(
										(g) => g !== otherGroup
									);
								}
							} while (pairExists && otherGroups.length > 0);

							// If the pair does not exist, add it to randomEvaluations
							if (!pairExists) {
								randomEvaluations.push([
									participant,
									otherParticipant,
								]);
							}
						}
					});

					console.log("randomEvaluations", randomEvaluations);
				});

			function processRow(index) {
				cy.get("table tbody tr")
					.eq(index)
					.find("td:nth-last-child(3)")
					.then(($td) => {
						if ($td.text() === "To complete") {
							cy.get("table tbody tr")
								.eq(index)
								.find(
									"td:nth-last-child(2) .linkToQuestionnaire"
								)
								.click();
							cy.url({ timeout: 20000 }).should(
								"include",
								"/questionnaire"
							);

							cy.wait(1000);

							let evaluator = "";
							cy.get(".evaluator").then(($evaluator) => {
								evaluator = $evaluator.text().trim();
								console.log("evaluator", evaluator);
							});

							let participant = "";
							cy.get(".question").each(($question, index) => {
								// Get the participant name every 3 questions
								if (index % 3 === 0) {
									cy.get(".participant")
										.eq(Math.floor(index / 3))
										.then(($participant) => {
											participant = $participant
												.text()
												.trim();
											console.log(
												"participant",
												participant
											);
										});
								}

								cy.wait(500).then(() => {
									let isPairInRandomEvaluations =
										randomEvaluations.some(([p1, p2]) => {
											return (
												(evaluator === p1 &&
													participant === p2) ||
												(evaluator === p2 &&
													participant === p1)
											);
										});

									let random0To10 = Math.floor(
										Math.random() * 11
									);
									let random1To10 =
										Math.floor(Math.random() * 10) + 1;

									let answer = 0;
									if (index % 3 < 2) {
										if (isPairInRandomEvaluations) {
											answer = random1To10;
										}
									} else {
										switch (participant) {
											case "user1":
												answer = 0;
												break;
											case "user2":
												answer = 1;
												break;
											case "user3":
												answer = 5;
												break;
											case "user4":
												answer = 10;
												break;
											default:
												answer = random0To10;
												break;
										}
									}

									console.log("answer", answer);

									// Select the button that matches the answer
									cy.wrap($question)
										.find("button")
										.filter((index, button) => {
											return (
												button.textContent.trim() ===
												answer.toString()
											);
										})
										.click({ force: true });
								});
							});

							cy.get('button:contains("SUBMIT")').click();
							cy.wait(10000);

							cy.visit("http://localhost:3000/home/participants");
							cy.wait(10000);
						}
					});
			}

			cy.get("table tbody tr").then(($rows) => {
				for (let i = 0; i < $rows.length; i++) {
					processRow(i);
				}
			});

			cy.wait(10000);
			cy.get("#generateResultBtn").click();
		});
	});
});
