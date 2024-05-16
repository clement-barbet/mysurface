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
import TableAssessed from "./TableAssessed";
import Loading from "@/components/ui/loading";

export default function Participants() {
	const supabase = createClientComponentClient();
	const [participants, setParticipants] = useState([]);
	const [questionnaires, setQuestionnaires] = useState(null);
	const [isEnrollmentPhase, setIsEnrollmentPhase] = useState(true);
	const [lang, setLang] = useState(null);
	const [org, setOrg] = useState(null);
	const [process, setProcess] = useState(null);
	const [assesseds, setAssesseds] = useState([]);
	const [loading, setLoading] = useState(true);
	const [userId, setUserId] = useState(null);

	const fetchUser = async () => {
		try {
			const fetchedUser = await supabase.auth.getUser();
			if (!fetchedUser.data.user)
				throw new Error("User not authenticated");
			return fetchedUser.data.user;
		} catch (error) {
			console.error("Error fetching user", error);
		}
	};

	const fetchAssesseds = async (userId, processId) => {
		try {
			const { data, error } = await supabase
				.from("assessed")
				.select("*")
				.eq("user_id", userId)
				.eq("type", processId == 2 ? "leader" : "product")
				.order("name");
			if (error) throw error;
			setAssesseds(data);
			console.log("Assesseds fetched successfully");
		} catch (error) {
			console.error("Error fetching assesseds:", error.message);
		}
	};

	const fetchParticipants = async (userId) => {
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
				.eq("user_id", userId)
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

	const fetchPhase = async (userId) => {
		try {
			const { data: appSettings, error: appSettingsError } =
				await supabase
					.from("app_settings")
					.select("*")
					.eq("user_id", userId)
					.single();
			if (appSettingsError) throw appSettingsError;
			setIsEnrollmentPhase(appSettings.isEnrollmentPhase);
			setLang(appSettings.language_id);
			setOrg(appSettings.organization_id);
			setProcess(appSettings.process_id);
			return appSettings;
		} catch (error) {
			console.error("Error fetching phase:", error.message);
		}
	};

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				const fetchedUser = await fetchUser();
				const fetchedUserId = fetchedUser.id;
				setUserId(fetchedUserId);
				if (fetchedUserId) {
					const fetchedSettings = await fetchPhase(fetchedUserId);
					const processId = fetchedSettings.process_id;
					await fetchAssesseds(fetchedUserId, processId);
					await fetchParticipants(fetchedUserId);
					if (participants) {
						await fetchQuestionnaires();
					}
				}
			} catch (error) {
				console.error("Error fetching data", error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
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

	if (loading) {
		return <Loading />;
	}

	return (
		<div className="flex flex-col gap-y-2">
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
						fetchParticipants={() => fetchParticipants(userId)}
						process={process}
						assessedCount={assessedCount}
						userId={userId}
					/>
					<ResetPhaseButton
						isEnrollmentPhase={isEnrollmentPhase}
						setIsEnrollmentPhase={setIsEnrollmentPhase}
						fetchQuestionnaires={fetchQuestionnaires}
						fetchParticipants={() => fetchParticipants(userId)}
						userId={userId}
					/>
					<DeleteAllParticipantsButton
						participantCount={participantCount}
						setParticipants={setParticipants}
						setIsEnrollmentPhase={setIsEnrollmentPhase}
						userId={userId}
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
						userId={userId}
					/>
				</div>
			</div>
		</div>
	);
}
