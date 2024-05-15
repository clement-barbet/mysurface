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
import CreateSendEmailsButton from "./CreateSendEmailsButton";
import SelectProcess from "./SelectProcess";
import FormAddAssessed from "./FormAddAssessed";
import { Table } from "@mui/material";
import TableAssessed from "./TableAssessed";

export default function Page() {
	const supabase = createClientComponentClient();
	const [participants, setParticipants] = useState([]);
	const [questionnaires, setQuestionnaires] = useState(null);
	const [isEnrollmentPhase, setIsEnrollmentPhase] = useState(true);
	const [lang, setLang] = useState(null);
	const [org, setOrg] = useState(null);
	const [process, setProcess] = useState(null);
	const [userId, setUserId] = useState(null);
	const [assesseds, setAssesseds] = useState([]);

	const fetchAssesseds = async () => {
		try {
			const user = await supabase.auth.getUser();
			const { data, error } = await supabase
				.from("assessed")
				.select("*")
				.eq("user_id", user.data.user.id)
				.eq("type", process == 2 ? "leader" : "product")
				.order("name");
			if (error) throw error;
			setAssesseds(data);
			console.log("Assesseds fetched successfully");
		} catch (error) {
			console.error("Error fetching assesseds:", error.message);
		}
	};

	const fetchParticipants = async () => {
		try {
			const user = await supabase.auth.getUser();
			setUserId(user.data.user.id);
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
			setProcess(appSettings.process_id);
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
	}, [process]);

	useEffect(() => {
		fetchAssesseds();
	}, [process]);

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
		setParticipants((currentParticipants) => [
			...currentParticipants,
			newParticipant,
		]);
	};

	const onAssessedAdded = (newAssessed) => {
		setAssesseds((currentAssesseds) => [...currentAssesseds, newAssessed]);
	};

	const atLeastOneQuestionnaireCompleted =
		questionnaires && questionnaires.length > 0
			? questionnaires.some((questionnaire) => questionnaire.completed)
			: false;

	const participantCount = participants ? participants.length : 0;
	const assessedCount = assesseds ? assesseds.length : 0;

	useEffect(() => {
		console.log("participants updated page.tsx", participants);
	}, [participants]);

	return (
		<div className="flex flex-col gap-y-4 m-2">
			<SelectProcess
				userId={userId}
				process={process}
				setProcess={setProcess}
				isEnrollmentPhase={isEnrollmentPhase}
			/>
			<FormAddAssessed
				process={process}
				onAssessedAdded={onAssessedAdded}
				isEnrollmentPhase={isEnrollmentPhase}
			/>
			<TableAssessed
				assesseds={assesseds}
				setAssesseds={setAssesseds}
				isEnrollmentPhase={isEnrollmentPhase}
				process={process}
			/>
			<FormAddParticipant
				onParticipantAdded={onParticipantAdded}
				isEnrollmentPhase={isEnrollmentPhase}
			/>
			<TableParticipants
				participants={participants}
				setParticipants={setParticipants}
				questionnaires={questionnaires}
				isEnrollmentPhase={isEnrollmentPhase}
				lang={lang}
				org={org}
				selectedProcess={process}
				userId={userId}
			/>
			<div className="p-5 shadow-md rounded-lg bg-white dark:bg-black bg-opacity-90">
				<h2 className="mb-2 font-semibold text-xl border-l-4 border-mid_blue pl-2">
					<T tkey="participants.titles.manage" />
				</h2>
				<div className="flex flex-col gap-y-2 md:gap-x-4 md:flex-row md:justify-start md:flex-wrap">
					<CreateQuestionnairesButton
						isEnrollmentPhase={isEnrollmentPhase}
						participantCount={participantCount}
						setIsEnrollmentPhase={setIsEnrollmentPhase}
						fetchQuestionnaires={fetchQuestionnaires}
						fetchParticipants={fetchParticipants}
						process={process}
						assessedCount={assessedCount}
					/>
					<ResetPhaseButton
						isEnrollmentPhase={isEnrollmentPhase}
						setIsEnrollmentPhase={setIsEnrollmentPhase}
						fetchQuestionnaires={fetchQuestionnaires}
						fetchParticipants={fetchParticipants}
					/>
					<DeleteAllParticipantsButton
						participantCount={participantCount}
						setParticipants={setParticipants}
						setIsEnrollmentPhase={setIsEnrollmentPhase}
					/>
					<CreateSendEmailsButton
						isEnrollmentPhase={isEnrollmentPhase}
						participants={participants}
						lang={lang}
						org={org}
					/>
					<CreateResultButton
						isEnrollmentPhase={isEnrollmentPhase}
						participantCount={participantCount}
						atLeastOneQuestionnaireCompleted={
							atLeastOneQuestionnaireCompleted
						}
						process={process}
					/>
				</div>
			</div>
		</div>
	);
}
