import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { cookies } from "next/headers";
const formSchema = z.object({
	name: z.string().min(2, {
		message: "Name must be at least 2 characters.",
	}),
	email: z.string().email({
		message: "Invalid email address.",
	}),
});

export async function POST(request: Request) {
	const supabase = createServerComponentClient({ cookies });

	try {
		const body = await request.json();
		const data = formSchema.parse(body);

		const { error } = await supabase.from("participants").insert([data]);

		if (error) {
			throw error;
		}

		return NextResponse.json({
			message: "Participant created successfully",
		});
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: error.issues },
				{ status: 400, statusText: "Bad Request" }
			);
		}

		console.error("Error creating participant:", error);
		return NextResponse.json(
			{ error: "An error occurred while creating the participant" },
			{ status: 500, statusText: "Internal Server Error" }
		);
	}
}

export async function DELETE(request: Request) {
	const supabase = createServerComponentClient({ cookies });

	try {
		const body = await request.json();
		const { id } = body;

		const { error } = await supabase
			.from("participants")
			.delete()
			.eq("id", id);

		if (error) {
			throw error;
		}

		return NextResponse.json({
			message: "Participant deleted successfully",
		});
	} catch (error) {
		console.error("Error deleting participant:", error);
		return NextResponse.json(
			{ error: "An error occurred while deleting the participant" },
			{ status: 500, statusText: "Internal Server Error" }
		);
	}
}
