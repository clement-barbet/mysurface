import 'cypress-clipboard';

describe("template spec", () => {
	it("passes", () => {
		cy.visit("http://localhost:3000/login").then(() => {
			let access_email = "not@admin.com";
			let access_password = "test1234";

			cy.get("input[name=email]").type(access_email);
			cy.get("input[name=password]").type(access_password);
			cy.get("button[type=submit]").click();

			cy.url({ timeout: 20000 }).should("include", "/client");
		});

		cy.contains("a", "Participants").should("be.visible").click();

		cy.url({ timeout: 20000 })
			.should("include", "/client/participants")
			.then(() => {
				cy.get("button").then(($btn) => {
					if ($btn.text().includes("Reset Phase")) {
						$btn.click();
					}
				});
		  });

		for (let i = 1; i <= 5; i++) {
			let randomNum = Math.floor(Math.random() * 1000);
			let name = `user${randomNum}`;
			let email = `user${randomNum}@example.com`;

			cy.get("input[name=name]").type(name);
			cy.get("input[name=email]").type(email);
			cy.get("button[type=submit]").click();

			cy.wait(20000);
		}

		cy.contains("button", "Create Questionnaires").click();
    cy.wait(20000);
	});
});
