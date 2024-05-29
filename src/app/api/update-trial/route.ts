import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
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

export async function POST(req: Request) {
	try {
		const supabase = createServerComponentClient({ cookies });
		const { logged_user_id, lang, email, name } = await req.json();

		const { data, error } = await supabase.rpc("update_billing_trial", {
			logged_user_id: logged_user_id,
		});

		if (error) {
			throw new Error(error.message);
		}

		let subject;
		let html;
		let baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
		let url = new URL("/home/license", baseUrl).toString();

		if (lang == 2) {
			// Czech language
			subject = "Zkušební verze MySurface zdarma";
			html = `<h2>Ahoj ${name},</h2>
            <p>Aktivovali jste zkušební licenci v aplikaci MySurface, která vyprší za 30 dní. Užijte si to!</p>
            <p>Vždy můžete vylepšit svou verzi zakoupením roční licence <a href="${url}">ZDE</a>.</p>
            <p>S pozdravem,</p>
            <p><i>Tým MySurface</i></p>`;
		} else if (lang == 3) {
			// Spanish language
			subject = "Prueba Gratuita de MySurface";
			html = `<h2>Hola ${name},</h2>
            <p>Has activado una licencia de prueba gratuita en MySurface App, la cual expirará en 30 días. ¡Disfrútala!</p>
            <p>Siempre puedes mejorar tu versión adquiriendo una licencia anual <a href="${url}">AQUÍ</a>.</p>
            <p>Saludos cordiales,</p>
            <p><i>El equipo de MySurface</i></p>`;
		} else {
			// English language
			subject = "MySurface Free Trial";
			html = `<h2>Hello ${name},</h2>
			<p>You have activated a free trial license in MySurface App, which will expire in 30 days. Enjoy it!</p>
            <p>You can always upgrade your version by purchasing an annual license <a href="${url}">HERE</a>.</p>
			<p>Best regards,</p>
			<p><i>The MySurface Team</i></p>`;
		}

		let mailOptions = {
			from: "My Surface® <info@myaudit.org>",
			to: email,
			subject: subject,
			html: html,
		};

		try {
			await sendMessage(mailOptions);
		} catch (emailError) {
			console.error("Failed to send email: ", emailError);
			throw new Error("Failed to send email");
		}

		return new Response("Updated billing trial and email sent", {
			status: 200,
		});
	} catch (error) {
		console.error("Failed to update billing trial: ", error);
		return new Response(
			"Failed to update billing trial or to send confirmation email",
			{ status: 500 }
		);
	}
}
