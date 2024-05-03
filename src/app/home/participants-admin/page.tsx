"use client";
import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
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
import {
	Select,
	MenuItem,
} from "@mui/material";

export default function Results() {
	const [loading, setLoading] = useState(true);
	const [participants, setParticipants] = useState([]);
	const supabase = createClientComponentClient();
	const [currentPage, setCurrentPage] = useState(1);
	const [participantsPerPage, setParticipantsPerPage] = useState(5);
	const [totalRows, setTotalRows] = useState(0);

	const handleResultsPerPageChange = (event) => {
		setParticipantsPerPage(event.target.value);
		setCurrentPage(1);
	};

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [participantsPerPage]);

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			const { data: fetchedParticipants, error: participantsError } = await supabase
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
				.order("created_at", { ascending: false });
			if (participantsError) throw participantsError;
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

			let { data: fetchedAppSettings, error: appSettingsError } =
				await supabase.from("app_settings").select("*");

			if (appSettingsError)
				console.error("Error loading app settings", appSettingsError);
			else {
				let participantsWithUserEmail = updatedParticipants.map(
					(participant) => {
						let appSetting = fetchedAppSettings.find(
							(setting) => setting.user_id === participant.user_id
						);
						return {
							...participant,
							user_email: appSetting
								? appSetting.email
								: "Email not found",
						};
					}
				);
				setParticipants(participantsWithUserEmail || []);
			}
			setLoading(false);
		};

		fetchData();
	}, []);

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
				<T tkey={tkey}/>
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
		!loading && (
			<>
				<div className="w-full m-auto">
					<h2 className="text-3xl pb-2">All Participants</h2>
					{participants.length > 0 ? (
						<>
							<Table className="w-full">
								<TableHeader>
									<THeadRow>
										{[
											"Participant's Name",
											"Participant's Email",
											"Owner's Email",
											"Creation Date",
											"Questionnaire Status",
										].map((header, index) => (
											<TableHead key={index}>
												{header}
											</TableHead>
										))}
									</THeadRow>
								</TableHeader>
								<TableBody className="bg-white dark:bg-black divide-y divide-gray-200 dark:divide-gray-500">
									{currentParticipants.map((participant) => {
										const date = new Date(
											participant.created_at
										);
										const formattedDate =
											date.toLocaleDateString("en-CA");
										const formattedTime =
											date.toLocaleTimeString("en-CA");

										return (
											<TBodyRow key={participant.id}>
												<TableCell className="px-6 py-2 whitespace-nowrap">
													{participant.name}
												</TableCell>
												<TableCell className="px-6 py-2 whitespace-nowrap">
													{participant.email}
												</TableCell>
												<TableCell className="px-6 py-2 whitespace-nowrap">
													{participant.user_email}
												</TableCell>
												<TableCell className="px-6 py-2 whitespace-nowrap">
													{formattedDate}
													<br />
													{formattedTime}
												</TableCell>
												<TableCell className="px-6 py-2 whitespace-nowrap">
													{renderQuestionnaireStatus(
														participant.questionnaireStatus
													)}
												</TableCell>
											</TBodyRow>
										);
									})}
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
										onClick={() =>
											setCurrentPage(currentPage - 1)
										}
										disabled={currentPage === 1}
										className="w-full inline-block"
									>
										Previous
									</Button>
									<Button
										onClick={() =>
											setCurrentPage(currentPage + 1)
										}
										disabled={
											currentPage ===
											Math.ceil(
												participants.length /
													participantsPerPage
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
												participants.length /
													participantsPerPage
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
											onChange={
												handleResultsPerPageChange
											}
											sx={{
												margin: "auto",
												fontFamily: "inherit",
												fontWeight: "bold",
												backgroundColor: "white",
											}}
										>
											{participantsPerPageOptions.map(
												(option) => (
													<MenuItem
														key={option}
														value={option}
													>
														{option}
													</MenuItem>
												)
											)}
										</Select>
									</div>
								</div>
							)}
						</>
					) : (
						<p>No data</p>
					)}
				</div>
			</>
		)
	);
}
