import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa6";

async function getParticipants() {
	const supabase = createClientComponentClient();
	const { data, error } = await supabase
		.from("participants")
		.select("name, email");

	if (error) {
		console.error("Error fetching participants:", error);
		return [];
	}

	return data || [];
}

interface Participant {
	id: string;
	name: string;
	email: string;
}

export default function TeamMembersList() {
	const [participants, setParticipants] = useState<Participant[]>([]);

	useEffect(() => {
		getParticipants().then((data: Participant[]) => setParticipants(data));
	}, []);

	return (
		<div className="overflow-auto">
			<table className="w-full">
				<tbody>
					{participants.map((participant) => (
						<tr key={participant.id}>
							<td className="py-2 flex justify-center items-center">
								<div className="border-2 border-gray-200 shadow-sm dark:opacity-80 rounded-full w-10 h-10 flex items-center justify-center bg-gradient-to-br from-cyan-300 to-sky-500">
									<FaUser className="w-5 h-5 text-white" />
								</div>
							</td>
							<td className="p-2 font-bold">
								{participant.name}
							</td>
							<td className="p-2">{participant.email}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
