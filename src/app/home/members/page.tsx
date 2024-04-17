"use client";
import React, { useState, useEffect } from "react";
import FormAddParticipant from "./FormAddParticipant";
import TableParticipants from "./TableParticipants";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import CreateQuestionnairesButton from "./CreateQuestionnairesButton";
import ResetPhaseButton from "./ResetPhaseButton";
import CreateResultButton from "./CreateResultButton";
import T from "@/components/translations/translation";
import DeleteAllParticipantsButton from "./DeleteAllParticipantsButton";

export default function Page() {
	const supabase = createClientComponentClient();
	const [participants, setParticipants] = useState([]);
	const [questionnaires, setQuestionnaires] = useState(null);
	const [phase, setPhase] = useState("");

	useEffect(() => {
		fetchQuestionnaires();
	}, []);

	useEffect(() => {
		if (questionnaires) {
			fetchParticipants();
		}
	}, [questionnaires]);

	const fetchQuestionnaires = async () => {
		try {
			const { data, error } = await supabase
				.from("questionnaires")
				.select("*");
			if (error) throw error;
			setQuestionnaires(data);
			console.log("Questionnaires fetched successfully");
		} catch (error) {
			console.error("Error fetching questionnaires:", error.message);
		}
	};

	const fetchParticipants = async () => {
		try {
			const { data, error } = await supabase
				.from("participants")
				.select(
					`
              *,
              questionnaires:questionnaire (
                id,
                completed
              )
            `
				)
				.order("name");
			if (error) throw error;
			const updatedParticipants = data.map((participant) => {
				let questionnaireStatus = "undefined";
				if (participant.questionnaires) {
					questionnaireStatus = participant.questionnaires.completed
						? "completed"
						: "tocomplete";
				}
				return { ...participant, questionnaireStatus };
			});
			setParticipants(updatedParticipants);
			console.log("Participants fetched successfully");
		} catch (error) {
			console.error("Error fetching participants:", error.message);
		}
	};

	const fetchPhase = async () => {
		try {
			const { data: appSettings, error: appSettingsError } =
				await supabase
					.from("app_settings")
					.select("*")
					.eq("setting_name", "phase")
					.single();
			if (appSettingsError) throw appSettingsError;
			setPhase(appSettings.setting_value);
		} catch (error) {
			console.error("Error fetching phase:", error.message);
		}
	};

	useEffect(() => {
		fetchPhase();
	}, []);

	const onParticipantAdded = (newParticipant) => {
		const linkedQuestionnaire = questionnaires.find(
			(q) => q.id === newParticipant.questionnaire.id
		);
		if (linkedQuestionnaire) {
			newParticipant.questionnaireStatus = linkedQuestionnaire.completed
				? "completed"
				: "tocomplete";
		} else {
			newParticipant.questionnaireStatus = "undefined";
		}
		setParticipants((prevParticipants) => [
			...prevParticipants,
			newParticipant,
		]);
	};

	const allQuestionnairesCompleted =
		questionnaires && questionnaires.length > 0
			? questionnaires.every((questionnaire) => questionnaire.completed)
			: false;

	const participantCount = participants ? participants.length : 0;

	return (
		<div>
			<TableParticipants
				participants={participants}
				questionnaires={questionnaires}
				phase={phase}
			/>
			<div className="mt-2 p-5 shadow-md rounded-lg bg-white dark:bg-black bg-opacity-90">
				<h2 className="mb-2">
					<T tkey="participants.form.title" />
				</h2>
				<div className="flex flex-col gap-y-2 md:flex-row md:justify-between md:items-end flex-wrap">
					<div className="mb-4 md:mb-0">
						<FormAddParticipant
							onParticipantAdded={onParticipantAdded}
							phase={phase}
						/>
					</div>
					<CreateQuestionnairesButton
						phase={phase}
						participantCount={participantCount}
					/>
					<ResetPhaseButton phase={phase} />
					<DeleteAllParticipantsButton
						participantCount={participantCount}
					/>
				</div>
				<CreateResultButton
					phase={phase}
					allQuestionnairesCompleted={allQuestionnairesCompleted}
				/>
			</div>
		</div>
	);
}
