import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
	host: process.env.SMTP_HOST,
	port: Number(process.env.SMTP_PORT),
	secure: false,
	auth: {
		user: process.env.SMTP_USER,
		pass: process.env.SMTP_PASS,
	},
	tls: {
		rejectUnauthorized: false,
	},
	logger: true,
	debug: true,
});

const sendMessage = async (mailOptions) => {
	try {
		await transporter.sendMail(mailOptions);
		console.log("Email sent");
		return new Response("Email sent", { status: 200 });
	} catch (error) {
		console.log("error is " + error);
		return new Response("Error sending email", { status: 500 });
	}
};

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { name, email, url } = body;

		let mailOptions = {
			from: "My Surface® <info@myaudit.org>",
			to: email,
			subject: "My Surface questionnaire",
			text: `Hello, ${name}, here is the link to your My Surface questionnaire: ${url}`,
		};

		const response = await sendMessage(mailOptions);
		return response;
	} catch (error) {
		console.log("error is " + error);
		return new Response("Error processing request", { status: 500 });
	}
}
