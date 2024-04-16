describe("template spec", () => {
	it("passes", () => {
		cy.visit("http://localhost:3000/login").then(() => {
			let access_email = "not@admin.com";
			let access_password = "test1234";

			cy.get("input[name=email]").type(access_email);
			cy.get("input[name=password]").type(access_password);
			cy.get("button[type=submit]").click();

			cy.url({ timeout: 20000 }).should("include", "/home");
		});

		cy.contains("a", "Participants").should("be.visible").click();

		cy.url({ timeout: 30000 })
			.should("include", "/home/participants")
			.then(() => {
				cy.get("table > tbody > tr").then(($rows) => {
					if ($rows.length >= 2) {
						cy.get("#resetPhaseBtn").then(($btn) => {
							if ($btn.length > 0) {
								$btn.click();
								cy.wait(10000);
							}
						});
					}
				});

				for (let i = 1; i <= 10; i++) {
					let randomNum = Math.floor(Math.random() * 1000);
					let name = `user${randomNum}`;
					let email = `user${randomNum}@example.com`;

					cy.get("input[name=name]").type(name);
					cy.get("input[name=email]").type(email);
					cy.get("#addParticipantBtn").click();

					cy.wait(10000);
				}

				cy.get("#createQuestionnairesBtn").click();
				cy.wait(30000);

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

								cy.get(".question").each(($question) => {
									const randomNumber = Math.floor(
										Math.random() * 11
									);
									cy.wrap($question)
										.find("button")
										.filter((index, button) => {
											return (
												button.textContent.trim() ===
												randomNumber.toString()
											);
										})
										.click();
								});

								cy.get('button:contains("SUBMIT")').click();

								cy.visit(
									"http://localhost:3000/home/participants"
								);
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
