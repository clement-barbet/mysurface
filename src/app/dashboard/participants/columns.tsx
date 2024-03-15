import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { z } from "zod";

const participantsSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  questionnaire: z.union([z.string().uuid(), z.null()]),
});

export type Participants = z.infer<typeof participantsSchema>;

export const columns = (questionnaires: any[]): ColumnDef<Participants>[] => [
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
            Undefined
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
              Completed
            </div>
          );
        } else {
          return (
            <div className="bg-yellow-500 text-white px-2 py-1 rounded">
              To Complete
            </div>
          );
        }
      }
      return (
        <div className="bg-gray-300 text-white px-2 py-1 rounded">
          Undefined
        </div>
      );
    },
  },
  {
    accessorKey: "questionnaire",
    header: "Questionnaire",
    cell: ({ row }) => {
      const questionnaireId = row.original.questionnaire;
      return questionnaireId ? (
        <Button
          onClick={() =>
            navigator.clipboard.writeText(
              `localhost:3000/questionnaire/${questionnaireId}`
            )
          }
          className=" bg-blue-500 px-2 py-1 rounded text-white"
        >
          Copy Link
        </Button>
      ) : null;
    },
  },
];
