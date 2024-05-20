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
import { useState } from "react";
import { ErrorMessage } from "@/components/ui/msg/error_msg";
import { SuccessMessage } from "@/components/ui/msg/success_msg";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

function TableAssessed({
	assesseds,
	setAssesseds,
	isEnrollmentPhase,
	process,
}) {
	const supabase = createClientComponentClient();
	const headers_T = [
		"participants.table.headers.name",
		"participants.table.headers.description",
		"participants.table.headers.delete",
	];
	const [successMessage, setSuccessMessage] = useState("");
	const [errorMessage, setErrorMessage] = useState("");

	const deleteAssessed = async (assessedId) => {
		try {
			const { error: deleteAssessedError } = await supabase
				.from("assessed")
				.delete()
				.eq("id", assessedId);

			if (deleteAssessedError) {
				throw deleteAssessedError;
			}

			const updatedAssesseds = assesseds.filter(
				(assessed) => assessed.id != assessedId
			);
			setAssesseds(updatedAssesseds);
			setSuccessMessage("success.participants.assessed.delete");
		} catch (error) {
			console.error("Error deleting assessed:", error);
			setErrorMessage("error.participants.assessed.delete");
		}
	};

	if (process == 1 || !process) {
		return null;
	}

	return (
		<>
			<ErrorMessage
				errorMessage={errorMessage}
				setErrorMessage={setErrorMessage}
			/>
			<SuccessMessage
				successMessage={successMessage}
				setSuccessMessage={setSuccessMessage}
			/>
			<div className="overflow-auto w-full hidden md:block p-5 shadow-md rounded-lg bg-white dark:bg-black bg-opacity-90">
				<h2 className="mb-4 font-semibold text-lg  text-black dark:text-white border-l-4 border-mid_blue pl-2">
					{process == 2 ? (
						<T tkey="participants.titles.leaders.subtitle" />
					) : (
						<T tkey="participants.titles.products.subtitle" />
					)}
				</h2>
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
						{assesseds.length ? (
							assesseds.map((assessed) => {
								if (assessed) {
									return (
										<TBodyRow key={assessed.id}>
											<TableCell className="px-6 py-4 whitespace-nowrap hidden">
												{assessed.id}
											</TableCell>
											<TableCell className="px-6 py-4 whitespace-nowrap">
												<div className="flex items-center">
													<div className="inline-block mr-5">
														<div className="border-2 border-gray-200 shadow-sm dark:opacity-80 rounded-full w-10 h-10 flex items-center justify-center bg-gradient-to-br from-accent_color to-accent_hover">
															<FontAwesomeIcon
																icon={faYinYang}
																className="w-5 h-5 text-white"
															/>
														</div>
													</div>
													<div className="ml-4">
														<div className="evaluator-name text-sm font-medium text-gray-900 dark:text-white">
															{assessed.name}
														</div>
													</div>
												</div>
											</TableCell>
											<TableCell className="px-6 py-4 whitespace-nowrap">
												<div className="text-sm text-gray-500">
													{assessed.description}
												</div>
											</TableCell>
											<TableCell className="px-6 py-4 text-sm text-left whitespace-nowrap">
												<Button
													disabled={
														!isEnrollmentPhase
													}
													variant="delete"
													onClick={() =>
														deleteAssessed(
															assessed.id
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
									{process == 2 ? (
										<T tkey="participants.table.nodata-leaders" />
									) : (
										<T tkey="participants.table.nodata-products" />
									)}
								</TableCell>
							</TBodyRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className="overflow-auto w-full block md:hidden p-5 shadow-md rounded-lg bg-white dark:bg-black bg-opacity-90">
				<h2 className="mb-4 font-semibold text-lg  text-black dark:text-white border-l-4 border-mid_blue pl-2">
					{process == 2 ? (
						<T tkey="participants.titles.leaders.subtitle" />
					) : (
						<T tkey="participants.titles.products.subtitle" />
					)}
				</h2>
				{assesseds.length
					? assesseds.map((assessed) => {
							if (assessed) {
								return (
									<div
										key={assessed.id}
										className="md:hidden rounded-md border shadow-md bg-white dark:bg-black p-3 mb-4 flex flex-col gap-y-2"
									>
										<p className="hidden">{assessed.id}</p>
										<p>
											<strong>
												<T tkey={headers_T[0]} />:{" "}
											</strong>
											{assessed.name}
										</p>
										<p>
											<strong>
												<T tkey={headers_T[1]} />:{" "}
											</strong>
											{assessed.description}
										</p>
										<p>
											<Button
												className="w-full"
												disabled={!isEnrollmentPhase}
												variant="delete"
												onClick={() =>
													deleteAssessed(assessed.id)
												}
											>
												<T tkey={headers_T[2]} />
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

export default TableAssessed;
