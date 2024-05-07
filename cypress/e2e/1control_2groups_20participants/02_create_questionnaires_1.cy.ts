// describe("template spec", () => {
// 	it("passes", () => {
// 		cy.visit("http://localhost:3000/login").then(() => {
// 			let access_email = "not@admin.com";
// 			let access_password = "test1234";

// 			cy.get("input[name=email]").type(access_email);
// 			cy.get("input[name=password]").type(access_password);
// 			cy.get("button[type=submit]").click();

// 			cy.url({ timeout: 20000 }).should("include", "/home");
// 		});

// 		cy.visit("http://localhost:3000/home/members").then(() => {
// 			cy.wait(2000);
// 			cy.get("#createQuestionnairesBtn").click();
// 			cy.wait(30000);
// 		});
// 	});
// });
