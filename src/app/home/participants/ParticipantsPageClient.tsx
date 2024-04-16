"use client";
import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import ParticipantsTable from "./participants-table";
import CreateQuestionnairesButton from "./CreateQuestionnairesButton";
import { CreateParticipantForm } from "./CreateParticipantForm";
import CreateResultButton from "./CreateResultButton";
import ResetPhaseButton from "./ResetPhaseButton";
import T from "@/components/translations/translation";
import DeleteAllParticipantsButton from "./DeleteAllParticipantsButton";

export default function ParticipantsPageClient({
	initialParticipants,
	initialQuestionnaires,
	initialAppSettings,
}) {
	const [participants, setParticipants] = useState(initialParticipants);
	const [questionnaires, setQuestionnaires] = useState(initialQuestionnaires);
	const [appSettings, setAppSettings] = useState(initialAppSettings);

	useEffect(() => {
		const supabase = createClientComponentClient();

		const fetchData = async () => {
			const { data: participants, error: participantsError } =
				await supabase.from("participants").select("*");

			const { data: questionnaires, error: questionnairesError } =
				await supabase.from("questionnaires").select("*");

			const { data: appSettings, error: appSettingsError } =
				await supabase
					.from("app_settings")
					.select("*")
					.eq("setting_name", "phase")
					.single();

			if (participantsError || questionnairesError || appSettingsError) {
				console.error(
					"Error fetching data:",
					participantsError || questionnairesError || appSettingsError
				);
				// Handle the error appropriately
			} else {
				setParticipants(participants);
				setQuestionnaires(questionnaires);
				setAppSettings(appSettings);
			}
		};

		fetchData();
	}, []);

	const allQuestionnairesCompleted =
		questionnaires && questionnaires.length > 0
			? questionnaires.every((questionnaire) => questionnaire.completed)
			: false;

	const participantCount = participants ? participants.length : 0;
	console.log("Participants count:", participantCount);

	return (
		<div>
			<ParticipantsTable
				initialParticipants={participants}
				questionnaires={questionnaires}
			/>
			<div className="mt-2 p-5 shadow-md rounded-lg bg-white dark:bg-black bg-opacity-90">
				<h2 className="mb-2"><T tkey="participants.form.title" /></h2>
				<div className="flex flex-col gap-y-2 md:flex-row md:justify-between md:items-end">
					<CreateParticipantForm phase={appSettings?.setting_value} />
					<CreateQuestionnairesButton
						phase={appSettings?.setting_value}
						participantCount={participantCount}
					/>
					<ResetPhaseButton phase={appSettings?.setting_value} />
					<DeleteAllParticipantsButton participantCount={participantCount} />
				</div>
				<CreateResultButton
					phase={appSettings?.setting_value}
					allQuestionnairesCompleted={allQuestionnairesCompleted}
				/>
			</div>
		</div>
	);
}
