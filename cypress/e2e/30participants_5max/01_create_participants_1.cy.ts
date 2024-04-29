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
			for (let i = 1; i <= 30; i++) {
				let name = `user${i}`;
				let email = `user${i}@test.com`;

				cy.get("input[name=name]").type(name);
				cy.get("input[name=email]").type(email);
				cy.get("#addParticipantBtn").click();

				cy.wait(10000);
			}
		});
	});
});
