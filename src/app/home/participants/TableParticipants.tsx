import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faYinYang } from "@fortawesome/free-solid-svg-icons";
import T from "@/components/translations/translation";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	THeadRow,
	TBodyRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import Link from "next/link";

function TableParticipants({
	participants: initialParticipants,
	questionnaires,
	isEnrollmentPhase,
}) {
	const headers_T = [
		"participants.table.headers.name",
		"participants.table.headers.email",
		"participants.table.headers.status",
		"participants.table.headers.questionnaire",
		"participants.table.headers.delete",
	];

	const [participants, setParticipants] = useState([]);
	useEffect(() => {
		setParticipants(initialParticipants);
	}, [initialParticipants]);

	const deleteParticipant = async (participantId) => {
		const response = await fetch("/api/participants", {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ id: participantId }),
		});

		if (response.ok) {
			setParticipants(
				participants.filter(
					(participant) => participant.id !== participantId
				)
			);
		} else {
			console.error("Error deleting participant:", response.statusText);
		}
	};

	const renderQuestionnaireStatus = (status) => {
		let color;
		let tkey;

		switch (status) {
			case "completed":
				color = "bg-green-500";
				tkey = "participants.table.status.completed";
				break;
			case "tocomplete":
				color = "bg-yellow-500";
				tkey = "participants.table.status.tocomplete";
				break;
			default:
				color = "bg-gray-300";
				tkey = "participants.table.status.undefined";
				break;
		}

		return (
			<div className={`${color} text-white px-2 py-1 rounded`}>
				<T tkey={tkey} />
			</div>
		);
	};

	return (
		<div className="rounded-md border overflow-auto w-full hidden md:block">
			<Table className="w-full">
				<TableHeader>
					<THeadRow>
						{headers_T.map((header, index) => {
							return (
								<TableHead key={index}>
									<T tkey={header} />
								</TableHead>
							);
						})}
					</THeadRow>
				</TableHeader>
				<TableBody className="bg-white divide-y divide-gray-200">
					{participants.length ? (
						participants.map((participant) => {
							if (participant) {
								return (
									<TBodyRow key={participant.id}>
										<TableCell className="px-6 py-4 whitespace-nowrap hidden">
											{participant.id}
										</TableCell>
										<TableCell className="px-6 py-4 whitespace-nowrap">
											<div className="flex items-center">
												<div className="inline-block mr-5">
													<div className="border-2 border-gray-200 shadow-sm dark:opacity-80 rounded-full w-10 h-10 flex items-center justify-center bg-gradient-to-br from-cyan-500 to-sky-800">
														<FontAwesomeIcon
															icon={faYinYang}
															className="w-5 h-5 text-white"
														/>
													</div>
												</div>
												<div className="ml-4">
													<div className="evaluator-name text-sm font-medium text-gray-900">
														{participant.name}
													</div>
												</div>
											</div>
										</TableCell>
										<TableCell className="px-6 py-4 whitespace-nowrap">
											<div className="text-sm text-gray-500">
												{participant.email}
											</div>
										</TableCell>
										<TableCell className="px-6 py-4 whitespace-nowrap">
											{renderQuestionnaireStatus(
												participant.questionnaireStatus
											)}
										</TableCell>
										<TableCell className="px-6 py-4 whitespace-nowrap">
											{(() => {
												const questionnaireId =
													participant.questionnaire;
												const baseUrl =
													process.env
														.NEXT_PUBLIC_BASE_URL;
												const url = `${baseUrl}/questionnaire/${questionnaireId}`;
												return questionnaireId ? (
													<Link href={url}>
														<Button
															/*
															COMMENTED OUT BECAUSE IT DOESN'T WORK WELL IN CYPRESS FOR TESTING
															onClick={() => {
																navigator.clipboard.writeText(url);
															}}
															*/
															className="linkToQuestionnaire bg-blue-500 px-2 py-1 rounded text-white"
														>
															<T tkey="participants.table.buttons.copy" />
														</Button>
													</Link>
												) : null;
											})()}
										</TableCell>
										<TableCell className="px-6 py-4 text-sm text-left whitespace-nowrap">
											<Button
												disabled={!isEnrollmentPhase}
												variant="delete"
												onClick={() =>
													deleteParticipant(
														participant.id
													)
												}
											>
												<T tkey="participants.table.buttons.delete" />
											</Button>
										</TableCell>
									</TBodyRow>
								);
							}
							return null;
						})
					) : (
						<TBodyRow>
							<TableCell
								colSpan={headers_T.length}
								className="px-6 py-4 whitespace-nowrap text-center"
							>
								<T tkey="participants.table.nodata" />
							</TableCell>
						</TBodyRow>
					)}
				</TableBody>
			</Table>
		</div>
	);
}

export default TableParticipants;
