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
import { Select, MenuItem } from "@mui/material";

function TableParticipants({
	participants: initialParticipants,
	questionnaires,
	isEnrollmentPhase,
	lang,
	org,
}) {
	const headers_T = [
		"participants.table.headers.name",
		"participants.table.headers.email",
		"participants.table.headers.status",
		"participants.table.headers.questionnaire",
		"participants.table.headers.delete",
	];

	const [currentPage, setCurrentPage] = useState(1);
	const [participantsPerPage, setParticipantsPerPage] = useState(5);
	const [participants, setParticipants] = useState([]);
	const [totalRows, setTotalRows] = useState(0);

	const handleResultsPerPageChange = (event) => {
		setParticipantsPerPage(event.target.value);
		setCurrentPage(1);
	};

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [participantsPerPage]);

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
			const updatedTotalRows = totalRows - 1;
			setTotalRows(updatedTotalRows);
			if (participantsPerPage > updatedTotalRows) {
				setParticipantsPerPage(updatedTotalRows);
			}
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

	const indexOfLastParticipant = currentPage * participantsPerPage;
	const indexOfFirstParticipant =
		indexOfLastParticipant - participantsPerPage;
	const currentParticipants = participants.slice(
		indexOfFirstParticipant,
		indexOfLastParticipant
	);
	useEffect(() => {
		setTotalRows(participants.length);
	}, [participants]);

	let participantsPerPageOptions;

	if (totalRows >= 5) {
		participantsPerPageOptions = Array.from(
			{ length: Math.floor(totalRows / 5) },
			(_, i) => (i + 1) * 5
		);

		if (totalRows % 5 !== 0) {
			participantsPerPageOptions.push(totalRows);
		}
	}

	return (
		<>
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
					<TableBody className="bg-white dark:bg-black divide-y divide-gray-200 dark:divide-gray-500">
						{currentParticipants.length ? (
							currentParticipants.map((participant) => {
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
														<div className="evaluator-name text-sm font-medium text-gray-900 dark:text-white">
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
													const url = `${baseUrl}/questionnaire/${questionnaireId}/${lang}/${org}`;
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
													disabled={
														!isEnrollmentPhase
													}
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
				<div className="flex flex-col flex-wrap justify-center">
					<div className="w-1/3 m-auto pt-4 flex flex-row gap-x-6 items-center justify-center">
						<Button
							onClick={() => setCurrentPage(1)}
							disabled={currentPage === 1}
							variant="delete"
							className="w-full inline-block"
						>
							First
						</Button>
						<Button
							onClick={() => setCurrentPage(currentPage - 1)}
							disabled={currentPage === 1}
							className="w-full inline-block"
						>
							Previous
						</Button>
						<Button
							onClick={() => setCurrentPage(currentPage + 1)}
							disabled={
								currentPage ===
								Math.ceil(
									participants.length / participantsPerPage
								)
							}
							className="w-full inline-block"
						>
							Next
						</Button>
						<Button
							onClick={() =>
								setCurrentPage(
									Math.ceil(
										participants.length /
											participantsPerPage
									)
								)
							}
							disabled={
								currentPage ===
								Math.ceil(
									participants.length / participantsPerPage
								)
							}
							variant="delete"
							className="w-full inline-block"
						>
							Last
						</Button>
					</div>
				</div>
				{totalRows > 5 && (
					<div className="flex flex-row justify-center items-baseline gap-x-2 mt-4">
						<p>Results per page: </p>
						<div>
							<Select
								value={participantsPerPage}
								onChange={handleResultsPerPageChange}
								sx={{
									margin: "auto",
									fontFamily: "inherit",
									fontWeight: "bold",
									backgroundColor: "white",
								}}
							>
								{participantsPerPageOptions.map((option) => (
									<MenuItem key={option} value={option}>
										{option}
									</MenuItem>
								))}
							</Select>
						</div>
					</div>
				)}
			</div>
			<div className="block md:hidden">
				{participants.length
					? participants.map((participant) => {
							if (participant) {
								return (
									<div
										key={participant.id}
										className="md:hidden rounded-md border shadow-md bg-white dark:bg-black p-3 mb-4 flex flex-col gap-y-2"
									>
										<p className="hidden">
											{participant.id}
										</p>
										<p>
											<strong>
												<T tkey={headers_T[0]} />:{" "}
											</strong>
											{participant.name}
										</p>
										<p>
											<strong>
												<T tkey={headers_T[1]} />:{" "}
											</strong>
											{participant.email}
										</p>
										<p>
											<strong>
												<T tkey={headers_T[2]} />:{" "}
											</strong>
											{renderQuestionnaireStatus(
												participant.questionnaireStatus
											)}
										</p>
										<p>
											<strong>
												<T tkey={headers_T[3]} />:{" "}
											</strong>
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
										</p>
										<p>
											<Button
												className="w-full"
												disabled={!isEnrollmentPhase}
												variant="delete"
												onClick={() =>
													deleteParticipant(
														participant.id
													)
												}
											>
												<T tkey={headers_T[4]} />
											</Button>
										</p>
									</div>
								);
							}
							return null;
					  })
					: null}
			</div>
		</>
	);
}

export default TableParticipants;
