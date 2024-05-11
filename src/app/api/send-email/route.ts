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

	await new Promise((resolve, reject) => {
		// verify connection configuration
		transporter.verify(function (error, success) {
			if (error) {
				console.log(error);
				reject(error);
			} else {
				console.log("Server is ready to take our messages");
				resolve(success);
			}
		});
	});

	let mailOptions = {
		from: "My Surface® <info@myaudit.org>",
		to: email,
		subject: "My Surface questionnaire",
		html: `<h2>Hello, ${name}!</h2><p>Here is the link to your My Surface questionnaire: <a href="${url}">Click here</a></p>`,
	};

	try {
		await new Promise((resolve, reject) => {
			// send mail
			transporter.sendMail(mailOptions, (err, info) => {
				if (err) {
					console.error(err);
					reject(err);
				} else {
					console.log(info);
					resolve(info);
				}
			});
		});

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
