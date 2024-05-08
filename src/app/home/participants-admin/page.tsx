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
import usePagination from "@/components/ui/pagination/usePagination";
import Pagination from "@/components/ui/pagination/pagination";

export default function Results() {
	const [loading, setLoading] = useState(true);
	const [participants, setParticipants] = useState([]);
	const supabase = createClientComponentClient();

	const {
		currentPage,
		setCurrentPage,
		itemsPerPage,
		handleItemsPerPageChange,
		currentItems,
		itemsPerPageOptions,
	} = usePagination(participants, 10);

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			const { data: fetchedParticipants, error: participantsError } =
				await supabase
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
				<T tkey={tkey} />
			</div>
		);
	};

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
									{currentItems.map((participant) => {
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
							<Pagination
								currentPage={currentPage}
								setCurrentPage={setCurrentPage}
								items={participants}
								itemsPerPage={itemsPerPage}
								handleItemsPerPageChange={
									handleItemsPerPageChange
								}
								itemsPerPageOptions={itemsPerPageOptions}
							/>
						</>
					) : (
						<p>No data</p>
					)}
				</div>
			</>
		)
	);
}
