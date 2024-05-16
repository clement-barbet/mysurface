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
import { ErrorMessage } from "@/components/ui/msg/error_msg";
import { SuccessMessage } from "@/components/ui/msg/success_msg";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

function TableNotifications({ notifications, setNotifications }) {
	const supabase = createClientComponentClient();
	const headers_T = [
		"news.table.headers.message",
		"news.table.headers.link",
		"news.table.headers.date",
		"news.table.headers.language",
		"news.table.headers.delete",
	];
	const [successMessage, setSuccessMessage] = useState("");
	const [errorMessage, setErrorMessage] = useState("");

	const deleteNotification = async (notificationId) => {
		try {
			const { error: notificationDeleteError } = await supabase
				.from("notifications")
				.delete()
				.eq("id", notificationId);

			if (notificationDeleteError) {
				throw notificationDeleteError;
			}

			const updatedNotifications = notifications.filter(
				(notification) => notification.id != notificationId
			);
			setNotifications(updatedNotifications);
		} catch (error) {
			console.error("Error deleting notification:", error);
			setErrorMessage("Error deleting notification.");
		}
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
					{notifications.length ? (
						notifications.map((notification) => {
							if (notification) {
								const date = new Date(notification.created_at);
								const formattedDate =
									date.toLocaleDateString("en-CA");
								const formattedTime =
									date.toLocaleTimeString("en-CA");
								return (
									<TBodyRow key={notification.id}>
										<TableCell className="px-6 py-4 whitespace-nowrap hidden">
											{notification.id}
										</TableCell>
										<TableCell className="px-6 py-4 whitespace-nowrap">
											<div className="text-sm text-gray-500">
												{notification.message}
											</div>
										</TableCell>
										<TableCell className="px-6 py-4 whitespace-nowrap">
											<div className="text-sm text-gray-500">
												{notification.link}
											</div>
										</TableCell>
										<TableCell className="px-6 py-4 whitespace-nowrap">
											<div className="text-sm text-gray-500">
												{formattedDate}
												<br />
												{formattedTime}
											</div>
										</TableCell>
										<TableCell className="px-6 py-4 whitespace-nowrap">
											<div className="text-sm text-gray-500">
												{notification.language}
											</div>
										</TableCell>
										<TableCell className="px-6 py-4 text-sm text-left whitespace-nowrap">
											<Button
												variant="delete"
												onClick={() =>
													deleteNotification(
														notification.id
													)
												}
											>
												<T tkey="news.table.buttons.delete" />
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
								No notifications.
							</TableCell>
						</TBodyRow>
					)}
				</TableBody>
			</Table>
		</>
	);
}

export default TableNotifications;
