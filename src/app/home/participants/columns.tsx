import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { z } from "zod";
import T from "@/components/translations/translation";
import Link from "next/link";

const participantsSchema = z.object({
	id: z.string().uuid(),
	name: z.string().min(2).max(50),
	email: z.string().email(),
	questionnaire: z.union([z.string().uuid(), z.null()]),
	delete: z.string(),
});

export type Participants = z.infer<typeof participantsSchema>;

export const columns = (questionnaires: any[]): ColumnDef<Participants>[] => [
	/*{
		accessorKey: "id",
		header: "ID",
	},
	*/
	{
		accessorKey: "name",
		header: "Name",
	},
	{
		accessorKey: "email",
		header: "Email",
	},
	{
		id: "status",
		header: "Status",
		cell: ({ row }) => {
			const questionnaire = row.original.questionnaire;
			if (questionnaire === null) {
				return (
					<div className="bg-gray-300 text-white px-2 py-1 rounded">
						<T tkey="participants.table.status.undefined" />
					</div>
				);
			}
			const linkedQuestionnaire = questionnaires.find(
				(q) => q.id === questionnaire
			);
			if (linkedQuestionnaire) {
				if (linkedQuestionnaire.completed) {
					return (
						<div className="bg-green-500 text-white px-2 py-1 rounded">
							<T tkey="participants.table.status.completed" />
						</div>
					);
				} else {
					return (
						<div className="bg-yellow-500 text-white px-2 py-1 rounded">
							<T tkey="participants.table.status.tocomplete" />
						</div>
					);
				}
			}
			return (
				<div className="bg-gray-300 text-white px-2 py-1 rounded">
					<T tkey="participants.table.status.undefined" />
				</div>
			);
		},
	},
	{
		accessorKey: "questionnaire",
		header: "Questionnaire",
		cell: ({ row }) => {
			const questionnaireId = row.original.questionnaire;
			const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
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
		},
	},
	{
		accessorKey: "delete",
		header: "Delete",
		cell: ({ row }) => {
			const participantId = row.original.id;
			return participantId ? (
				<>
					<Button
						variant="delete"
						onClick={async () => {
							const response = await fetch("/api/participants", {
								method: "DELETE",
								headers: {
									"Content-Type": "application/json",
								},
								body: JSON.stringify({ id: participantId }),
							});

							if (response.ok) {
								location.reload();
							} else {
								console.error(
									"Error deleting participant:",
									response.statusText
								);
							}
						}}
					>
						<T tkey="participants.table.buttons.delete" />
					</Button>
				</>
			) : null;
		},
	},
];
