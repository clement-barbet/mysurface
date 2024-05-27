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
		console.log("Mail options: ", mailOptions);
		await transporter.sendMail(mailOptions);
		return new Response("Email sent", { status: 200 });
	} catch (error) {
		console.log("Error sending email: " + error);
		return new Response("Error sending email", { status: 500 });
	}
};

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { name, email, url, lang } = body;

		let subject;
		let html;

		if (lang == 2) {
			// Czech language
			subject = "Dotazník MySurface";
			html = `<h2>Dobrý den ${name},</h2>
			<p>Dotazník, který vám byl přidělen, můžete vyplnit kliknutím <a href="${url}">ZDE</a>. Prosím, vyplňte jej co nejdříve.</p>
			<p>S pozdravem,</p>
			<p><i>Team MySurface</i></p>`;
		} else if (lang == 3) {
			// Spanish language
			subject = "Cuestionario MySurface";
			html = `<h2>Hola ${name},</h2>
			<p>Puedes rellenar el cuestionario que se te ha asignado haciendo clic <a href="${url}">AQUÍ</a>. Por favor, complétalo lo antes posible.</p>
			<p>Saludos,</p>
			<p><i>Equipo de MySurface</i></p>`;
		} else {
			// English language
			subject = "MySurface questionnaire";
			html = `<h2>Hello ${name},</h2>
			<p>You can fill out the questionnaire assigned to you by clicking <a href="${url}">HERE</a>. Please complete it as soon as possible.</p>
			<p>Best regards,</p>
			<p><i>The MySurface Team</i></p>`;
		}

		let mailOptions = {
			from: "My Surface® <info@myaudit.org>",
			to: email,
			subject: subject,
			html: html,
		};

		const response = await sendMessage(mailOptions);
		return response;
	} catch (error) {
		console.log("Error fetching: " + error);
		return new Response("Error processing request", { status: 500 });
	}
}
