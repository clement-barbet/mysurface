describe("template spec", () => {
	it("passes", () => {
		cy.visit("http://localhost:3000/login").then(() => {
			let access_email = "not@admin.com";
			let access_password = "test1234";

			cy.get("input[name=email]").type(access_email);
			cy.get("input[name=password]").type(access_password);
			cy.get("button[type=submit]").click();

			cy.url({ timeout: 40000 }).should("include", "/home");
		});

		cy.visit("http://localhost:3000/home/members").then(() => {
			cy.wait(10000);

			let participants = [];
			let pairs = [];
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

					// Control, first participant not linked to anyone
					for (let i = 1; i < participants.length; i++) {
						pairs.push([participants[0], participants[i]]);
					}

					// Generate 2 groups of participants
					let group1 = participants.slice(1, 10);
					let group2 = participants.slice(10);

					// Generate mutual 0 scores between participants from different groups
					for (let i = 0; i < group1.length; i++) {
						for (let j = 0; j < group2.length; j++) {
							pairs.push([group1[i], group2[j]]);
						}
					}

					console.log("pairs", pairs);
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
									let answer = Math.floor(Math.random() * 11);
									pairs.forEach((pair) => {
										if (
											(evaluator === pair[0] &&
												participant === pair[1]) ||
											(evaluator === pair[1] &&
												participant === pair[0])
										) {
											if (index % 3 < 2) {
												answer = 0;
											}
										}

										console.log("answer", answer);
									});

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

							cy.visit("http://localhost:3000/home/members");
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
