export async function POST(req: Request) {
	const body = await req.json();
	console.log("Request body: ", body);

	const formDataEncoded = Object.keys(body)
		.map(
			(key) =>
				`${encodeURIComponent(key)}=${encodeURIComponent(body[key])}`
		)
		.join("&");

	console.log("Encoded form data: ", formDataEncoded);

	try {
		const response = await fetch(
			"https://webto.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				body: formDataEncoded,
			}
		);

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		return new Response("Form submitted successfully", { status: 200 });
	} catch (error) {
		return new Response("Failed to submit form", { status: 500 });
	}
}
