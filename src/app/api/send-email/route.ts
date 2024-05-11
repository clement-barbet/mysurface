import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

let transporter = nodemailer.createTransport({
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
});

export async function POST(request: Request) {
	const body = await request.json();
	const { name, email, url } = body;

	let mailOptions = {
		from: "My Surface® <info@myaudit.org>",
		to: email,
		subject: "My Surface questionnaire",
		html: `<h2>Hello, ${name}!</h2><p>Here is the link to your My Surface questionnaire: <a href="${url}">Click here</a></p>`,
	};

	try {
		let info = await transporter.sendMail(mailOptions);
		console.log("Correo enviado: " + info.response);

		return NextResponse.json({
			message: "Email sent successfully!",
		});
	} catch (error) {
		console.log("Error: ", error);
		return NextResponse.json({
			error: "An error occurred while sending the email. Please try again later.",
		});
	}
}
