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

		cy.url({ timeout: 20000 })
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

				for (let i = 1; i <= 5; i++) {
					let randomNum = Math.floor(Math.random() * 1000);
					let name = `user${randomNum}`;
					let email = `user${randomNum}@example.com`;

					cy.get("input[name=name]").type(name);
					cy.get("input[name=email]").type(email);
					cy.get("#addParticipantBtn").click();

					cy.wait(10000);
				}

				cy.contains("button", "Create Questionnaires").click();
				cy.wait(10000);
			});
	});
});
