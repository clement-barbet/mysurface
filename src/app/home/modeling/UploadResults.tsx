"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Papa from "papaparse";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { ErrorMessage } from "@/components/ui/msg/error_msg";
import { SuccessMessage } from "@/components/ui/msg/success_msg";
import { useRouter } from "next/navigation";

function UploadResults({ processId, reportName }) {
	const [file, setFile] = useState(null);
	const supabase = createClientComponentClient();
	const [fileName, setFileName] = useState("");
	const [successMessage, setSuccessMessage] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const _ = require("lodash");
    const router = useRouter();

	// Insert into database
	async function addResultToDatabase(participantsData) {
		try {
            console.log("process_id", processId);
            console.log("report_name", reportName);
			const { data: insertedResult, error: insertError } = await supabase
				.from("results")
				.insert([
					{
						id: Date.now().toString(),
						created_at: new Date().toISOString(),
						result: JSON.stringify(participantsData),
						report_name: reportName,
						process_id: processId,
					},
				])
				.select("*")
				.single();

			if (insertError) {
				setErrorMessage(
					`Error inserting result into DB: ${insertError}`
				);
			} else {
				setSuccessMessage(`Result added successfully.`);
                const resultId = insertedResult.id;
				router.push(`/home/results/${resultId}`);
			}
		} catch (error) {
			setErrorMessage(`Error inserting result into DB: ${error}`);
		}
	}

	const handleFileChange = (event) => {
		setFile(event.target.files[0]);
		setFileName(event.target.files[0].name);
	};

	const handleFileUpload = async () => {
		if (!file) return;

		Papa.parse(file, {
			header: true,
			complete: async (results) => {
				const fileExtension = file.name.split(".").pop();
				if (fileExtension !== "csv") {
					setErrorMessage(
						"Invalid file type. Please upload a CSV file."
					);
					return;
				}

				const maxRows = 5000;
				if (results.data.length > maxRows) {
					setErrorMessage(
						`Too many rows: ${results.data.length}. The limit is ${maxRows}.`
					);
					return;
				}

				// Group data by evaluator_id
				const groupedData = _.groupBy(results.data, "evaluator_name");

				// Transform data to match the database schema
				const transformedData = _.map(
					groupedData,
					(data, participantName) => {
						const participantData = data.map((row) => {
							const interactionRatings = [
								parseFloat(row.rating1),
								parseFloat(row.rating2),
							];
							const interactionWeights = [
								parseFloat(row.weight1),
								parseFloat(row.weight2),
							];
							console.log(interactionRatings, interactionWeights);
							const influenceRatings = [parseFloat(row.rating3)];
							const influenceWeights = [parseFloat(row.weight3)];

							// Calculate interaction and influence grades
							const interactionGrade =
								interactionWeights.reduce(
									(sum, weight, i) =>
										sum + interactionRatings[i] * weight,
									0
								) /
								(interactionWeights.reduce(
									(sum, weight) => sum + weight,
									0
								) *
									10);
							const influenceGrade =
								influenceWeights.reduce(
									(sum, weight, i) =>
										sum + influenceRatings[i] * weight,
									0
								) /
								(influenceWeights.reduce(
									(sum, weight) => sum + weight,
									0
								) *
									10);

							return {
								participantId: row.evaluated_id,
								participantName: row.evaluated_name,
								answers: [
									{
										rating: row.rating1,
										weight: row.weight1,
									},
									{
										rating: row.rating2,
										weight: row.weight2,
									},
									{
										rating: row.rating3,
										weight: row.weight3,
									},
								],
								interactionGrade,
								influenceGrade,
							};
						});

						return {
							participantName,
							data: participantData,
						};
					}
				);
				console.log(JSON.stringify(transformedData));
				addResultToDatabase(transformedData);
			},
		});
	};

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
			<div className="p-5 shadow-md rounded-lg bg-white dark:bg-black bg-opacity-90">
				<h2 className="font-semibold text-xl  border-l-4 border-mid_blue pl-2">
					Upload results
				</h2>
				<div className="mt-4 w-full flex flex-col md:flex-row md:space-x-8 justify-between gap-y-2 md:gap-y-0">
					<div className="md:w-4/5">
						<input
							type="file"
							accept=".csv"
							id="fileUploadAssesseds"
							onChange={handleFileChange}
							className="hidden"
						/>
						<label
							htmlFor="fileUploadAssesseds"
							className="cursor-pointer text-sm border border-accent_color hover:bg-accent_light py-2 px-4 rounded inline-block transition-all duration-300 ease-in-out font-medium"
						>
							Select file
						</label>
						{fileName && (
							<span className="ms-2 text-sm text-darkest_gray">
								{fileName}
							</span>
						)}
					</div>
					<Button
						type="submit"
						id="uploadCsvBtn"
						className="w-full md:w-1/5"
						onClick={handleFileUpload}
					>
						Upload
					</Button>
				</div>
			</div>
		</>
	);
}

export default UploadResults;
