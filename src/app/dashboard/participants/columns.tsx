/*
name: string;
email: string;
questionnaire: uuid|empty;
*/
import { z } from "zod";

const participantsSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  questionnaire: z.union([z.string().uuid(), z.null()]),
});

export type Participants = z.infer<typeof participantsSchema>;

/*
CONTEXT : Your job is to create `ColumnDef` for the Participants type

EXAMPLE INPUT : 
```ts
// create ColumnDef instructions for status, email and amount
export type Payment = {
  id: string
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  email: string
}
```

EXAMPLE OUTPUT : 
```ts
import { ColumnDef } from "@tanstack/react-table"
export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
]
```
*/

import { ColumnDef } from "@tanstack/react-table";
export const columns: ColumnDef<Participants>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "questionnaire",
    header: "Questionnaire",
  },
];
