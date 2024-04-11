import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faYinYang } from "@fortawesome/free-solid-svg-icons";
import T from "@/components/translation";

async function getParticipants() {
	const supabase = createClientComponentClient();
	const { data, error } = await supabase
		.from("participants")
		.select("id, name, email");

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

	if (participants.length === 0) {
		return <p className="text-sm italic text-center"><T tkey="dashboard.team.nodata"/></p>;
	}

	return (
		<div className="overflow-auto">
			<table className="w-full">
				<tbody>
					{participants.map((participant) => (
						<tr key={participant.id}>
							<td className="py-2 flex justify-center items-center">
								<div className="border-2 border-gray-200 shadow-sm dark:opacity-80 rounded-full w-10 h-10 flex items-center justify-center bg-gradient-to-br from-cyan-500 to-sky-800">
									<FontAwesomeIcon
										icon={faYinYang}
										className="w-5 h-5 text-white"
									/>
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
