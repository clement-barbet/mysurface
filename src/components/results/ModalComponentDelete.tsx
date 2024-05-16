import { Modal, Box, Typography, TextField } from "@mui/material";
import { Button } from "@/components/ui/button";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import T from "@/components/translations/translation";

interface ModalComponentProps {
	open: boolean;
	setOpen: (value: boolean) => void;
	setResults: (value: any) => void;
	results: any;
	selectedResult: any;
	table: string;
}

const ModalComponent: React.FC<ModalComponentProps> = ({
	open,
	setOpen,
	setResults,
	results,
	selectedResult,
	table,
}) => {
	const supabase = createClientComponentClient();
	const deleteReport = async () => {
		const { error } = await supabase
			.from(table)
			.delete()
			.eq("id", selectedResult.id);

		if (error) console.error("Error deleting report", error);
		else {
			const updatedResults = results.filter(
				(result) => result.id !== selectedResult.id
			);
			setResults(updatedResults);
		}

		handleClose();
	};

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<Modal
			open={open}
			onClose={handleClose}
			aria-labelledby="modal-modal-title"
			aria-describedby="modal-modal-description"
		>
			<Box
				sx={{
					position: "absolute",
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
					width: "90%",
					maxWidth: 400,
					bgcolor: "background.paper",
					borderRadius: "10px",
					boxShadow: 24,
					p: 4,
				}}
			>
				<Typography
					id="modal-modal-title"
					variant="h6"
					component="h2"
					sx={{ mb: 2, textAlign: "center", fontFamily: "inherit" }}
				>
					<T tkey="results.modal.question" />
				</Typography>
				<div className="flex gap-x-2 mt-2">
					<Button
						onClick={deleteReport}
						variant="delete"
						className="w-1/2"
					>
						<T tkey="results.modal.options.yes" />
					</Button>
					<Button onClick={handleClose} className="w-1/2">
						<T tkey="results.modal.options.no" />
					</Button>
				</div>
			</Box>
		</Modal>
	);
};

export default ModalComponent;
