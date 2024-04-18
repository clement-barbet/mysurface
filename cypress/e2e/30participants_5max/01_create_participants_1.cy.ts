describe("template spec", () => {
	it("passes", () => {
		cy.visit("http://localhost:3000/home/members").then(() => {
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
