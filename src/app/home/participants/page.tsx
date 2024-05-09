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
	const [isEnrollmentPhase, setIsEnrollmentPhase] = useState(true);
	const [lang, setLang] = useState(null);
	const [org, setOrg] = useState(null);

	const fetchParticipants = async () => {
		try {
			const user = await supabase.auth.getUser();
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
				.eq("user_id", user.data.user.id)
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

	const fetchQuestionnaires = async () => {
		try {
			const questionnaireIds = participants
				.filter(
					(p) =>
						p.questionnaire !== null &&
						p.questionnaire !== undefined
				)
				.map((p) => p.questionnaire);
			const { data, error } = await supabase
				.from("questionnaires")
				.select("id, data, completed")
				.in("id", questionnaireIds);
			if (error) throw error;
			setQuestionnaires(data);
			console.log("Questionnaires fetched successfully");
		} catch (error) {
			console.error("Error fetching questionnaires:", error.message);
		}
	};

	const fetchPhase = async () => {
		try {
			const user = await supabase.auth.getUser();
			const { data: appSettings, error: appSettingsError } =
				await supabase
					.from("app_settings")
					.select("*")
					.eq("user_id", user.data.user.id)
					.single();
			if (appSettingsError) throw appSettingsError;
			setIsEnrollmentPhase(appSettings.isEnrollmentPhase);
			setLang(appSettings.language_id);
			setOrg(appSettings.organization_id);
		} catch (error) {
			console.error("Error fetching phase:", error.message);
		}
	};

	useEffect(() => {
		fetchParticipants();
	}, []);

	useEffect(() => {
		if (participants) {
			fetchQuestionnaires();
		}
	}, [participants]);

	useEffect(() => {
		fetchPhase();
	}, []);

	const onParticipantAdded = (newParticipant) => {
		if (newParticipant.questionnaire) {
			const linkedQuestionnaire = questionnaires.find(
				(q) => q.id === newParticipant.questionnaire.id
			);
			if (linkedQuestionnaire) {
				newParticipant.questionnaireStatus =
					linkedQuestionnaire.completed ? "completed" : "tocomplete";
			} else {
				newParticipant.questionnaireStatus = "undefined";
			}
		} else {
			console.error("newParticipant.questionnaire is undefined");
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
		<>
			<div className="mb-2 p-5 shadow-md rounded-lg bg-white dark:bg-black bg-opacity-90">
				<h2 className="mb-2 font-bold">
					<T tkey="participants.form.title" />
				</h2>
				<div className="w-full my-4">
					<FormAddParticipant
						onParticipantAdded={onParticipantAdded}
						isEnrollmentPhase={isEnrollmentPhase}
					/>
				</div>
			</div>
			<TableParticipants
				participants={participants}
				questionnaires={questionnaires}
				isEnrollmentPhase={isEnrollmentPhase}
				lang={lang}
				org={org}
			/>
			<div className="my-2 p-5 shadow-md rounded-lg bg-white dark:bg-black bg-opacity-90">
				<h2 className="mb-2 font-bold">
					<T tkey="participants.buttons-section.title" />
				</h2>
				<div className="flex flex-col gap-y-2 md:space-x-4 md:flex-row md:justify-start md:flex-wrap">
					<CreateQuestionnairesButton
						isEnrollmentPhase={isEnrollmentPhase}
						participantCount={participantCount}
					/>
					<ResetPhaseButton isEnrollmentPhase={isEnrollmentPhase} />
					<DeleteAllParticipantsButton
						participantCount={participantCount}
					/>
					<CreateResultButton
						isEnrollmentPhase={isEnrollmentPhase}
						allQuestionnairesCompleted={allQuestionnairesCompleted}
					/>
				</div>
			</div>
		</>
	);
}
