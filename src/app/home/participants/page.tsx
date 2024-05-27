"use client";
import React, { useState, useEffect } from "react";
import FormAddParticipant from "./FormAddParticipant";
import TableParticipants from "./TableParticipants";
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
import { fetchUser } from "@/db/auth_user/fetchUser";
import { fetchSettings } from "@/db/app_settings/fetchSettingsByUserId";
import { fetchAssesseds } from "@/db/assessed/fetchAssessedsByUserIdAndProcessId";
import { fetchParticipants } from "@/db/participants/fetchParticipantsWithStatusByUserId";
import { fetchQuestionnaires } from "@/db/questionnaires/fetchQuestionnairesByIds";

export default function Participants() {
	const [participants, setParticipants] = useState([]);
	const [questionnaires, setQuestionnaires] = useState(null);
	const [isEnrollmentPhase, setIsEnrollmentPhase] = useState(true);
	const [lang, setLang] = useState(null);
	const [org, setOrg] = useState(null);
	const [process, setProcess] = useState(null);
	const [assesseds, setAssesseds] = useState([]);
	const [loading, setLoading] = useState(true);
	const [userId, setUserId] = useState(null);

	const fetchParticipantsWithStatus = async (userId) => {
		try {
			const fetchedParticipants = await fetchParticipants(userId);
			const updatedParticipants = fetchedParticipants.map(
				(participant) => {
					let questionnaireStatus = "undefined";
					if (participant.questionnaires) {
						questionnaireStatus = participant.questionnaires
							.completed
							? "completed"
							: "tocomplete";
					}
					return { ...participant, questionnaireStatus };
				}
			);
			setParticipants(updatedParticipants);
		} catch (error) {
			console.error("Error fetching participants:", error.message);
		}
	};

	const fetchQuestionnairesByIds = async () => {
		try {
			const questionnaireIds = participants
				.filter(
					(p) =>
						p.questionnaire !== null &&
						p.questionnaire !== undefined
				)
				.map((p) => p.questionnaire);
			const fetchedQuestionnaires = fetchQuestionnaires(questionnaireIds);
			setQuestionnaires(fetchedQuestionnaires);
		} catch (error) {
			console.error("Error fetching questionnaires:", error.message);
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
					const fetchedSettings = await fetchSettings(fetchedUserId);
					setIsEnrollmentPhase(fetchedSettings.isEnrollmentPhase);
					setLang(fetchedSettings.language_id);
					setOrg(fetchedSettings.organization_id);
					setProcess(fetchedSettings.process_id);

					const fetchedAssesseds = await fetchAssesseds(
						fetchedUserId,
						fetchedSettings.process_id
					);
					setAssesseds(fetchedAssesseds);
					await fetchParticipantsWithStatus(fetchedUserId);
					if (participants) {
						await fetchQuestionnairesByIds();
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

	useEffect(() => {
		const loadAssessedData = async () => {
			if (!userId || !process) {
				return;
			}
			const data = await fetchAssesseds(userId, process);
			setAssesseds(data);
		};

		if (process && process != 1) {
			loadAssessedData();
		}
	}, [process]);

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
			<div>
				<h2 className="ml-5 uppercase text-lg font-semibold mt-4 mb-4">
					<T tkey="participants.titles.set-process.title" />
				</h2>
				<SelectProcess
					userId={userId}
					process={process}
					setProcess={setProcess}
					isEnrollmentPhase={isEnrollmentPhase}
				/>
			</div>
			{process != 1 &&
				(process == 2 ? (
					<h2 className="ml-5 uppercase text-lg font-semibold mt-6 mb-2">
						<T tkey="participants.titles.leaders.title" />
					</h2>
				) : (
					<h2 className="ml-5 uppercase text-lg font-semibold mt-6 mb-2">
						<T tkey="participants.titles.products.title" />
					</h2>
				))}
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
			<div className="flex flex-col gap-y-2">
				<h2 className="ml-5 uppercase text-lg font-semibold mt-6 mb-2">
					<T tkey="participants.titles.participants.title" />
				</h2>
				<FormAddParticipant
					onParticipantAdded={onParticipantAdded}
					isEnrollmentPhase={isEnrollmentPhase}
				/>
				<TableParticipants
					participants={participants}
					setParticipants={setParticipants}
					isEnrollmentPhase={isEnrollmentPhase}
					lang={lang}
					org={org}
					selectedProcess={process}
					userId={userId}
				/>
			</div>
			<h2 className="ml-5 uppercase text-lg font-semibold mt-6 mb-2">
				<T tkey="participants.titles.manage.title" />
			</h2>
			<div className="p-5 shadow-md rounded-lg bg-white dark:bg-black bg-opacity-90">
				<h2 className="mb-2 font-semibold text-lg border-l-4 border-mid_blue pl-2">
					<T tkey="participants.titles.manage.subtitle" />
				</h2>
				<div className="flex flex-col gap-y-2 md:gap-x-4 md:flex-row md:justify-start md:flex-wrap">
					<CreateQuestionnairesButton
						isEnrollmentPhase={isEnrollmentPhase}
						participantCount={participantCount}
						setIsEnrollmentPhase={setIsEnrollmentPhase}
						fetchQuestionnaires={fetchQuestionnairesByIds}
						fetchParticipants={() =>
							fetchParticipantsWithStatus(userId)
						}
						process={process}
						assessedCount={assessedCount}
						userId={userId}
					/>
					<ResetPhaseButton
						isEnrollmentPhase={isEnrollmentPhase}
						setIsEnrollmentPhase={setIsEnrollmentPhase}
						fetchQuestionnaires={fetchQuestionnairesByIds}
						fetchParticipants={() =>
							fetchParticipantsWithStatus(userId)
						}
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
						selectedProcess={process}
						userId={userId}
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
