"use client";

import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	THeadRow,
	TBodyRow,
} from "@/components/ui/table";

import T from "@/components/translations/translation";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faYinYang } from "@fortawesome/free-solid-svg-icons";

const headers_T = [
	"participants.table.headers.name",
	"participants.table.headers.email",
	"participants.table.headers.status",
	"participants.table.headers.questionnaire",
	"participants.table.headers.delete",
];

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
}

export function DataTable<TData, TValue>({
	columns,
	data,
}: DataTableProps<TData, TValue>) {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<>
			<div className="rounded-md border overflow-auto w-full hidden md:block">
				<Table className="w-full">
					<TableHeader>
						<THeadRow>
							{headers_T.map((header, index) => (
								<TableHead key={index}>
									<T tkey={header} />
								</TableHead>
							))}
						</THeadRow>
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TBodyRow
									key={row.id}
									data-state={
										row.getIsSelected() && "selected"
									}
								>
									{row
										.getVisibleCells()
										.map((cell, index) => (
											<TableCell
												key={cell.id}
												className="whitespace-nowrap"
											>
												{index === 0 && (
													<div className="inline-block mr-5">
														<div className="border-2 border-gray-200 shadow-sm dark:opacity-80 rounded-full w-10 h-10 flex items-center justify-center bg-gradient-to-br from-cyan-500 to-sky-800">
															<FontAwesomeIcon
																icon={faYinYang}
																className="w-5 h-5 text-white"
															/>
														</div>
													</div>
												)}
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext()
												)}
											</TableCell>
										))}
								</TBodyRow>
							))
						) : (
							<TBodyRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									<T tkey="participants.table.nodata" />
								</TableCell>
							</TBodyRow>
						)}
					</TableBody>
				</Table>
			</div>
			{table.getRowModel().rows?.length ? (
				table.getRowModel().rows.map((row, rowIndex) => (
					<div
						key={rowIndex}
						className="md:hidden rounded-md border shadow-md bg-white dark:bg-black p-3 mb-4"
					>
						{row.getVisibleCells().map((cell, cellIndex) => (
							<div key={cellIndex} className="py-2">
								<div>
									{cellIndex !== headers_T.length - 1 && (
										<span className="font-bold">
											<T tkey={headers_T[cellIndex]} />:{" "}
										</span>
									)}

									{flexRender(
										cell.column.columnDef.cell,
										cell.getContext()
									)}
								</div>
							</div>
						))}
					</div>
				))
			) : (
				<div>
					<T tkey="participants.table.nodata" />
				</div>
			)}
		</>
	);
}
