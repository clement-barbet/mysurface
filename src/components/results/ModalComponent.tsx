import { Modal, Box, Typography, TextField } from "@mui/material";
import { Button } from "@/components/ui/button";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

interface ModalComponentProps {
	open: boolean;
    setOpen: (value: boolean) => void;
    setResults: (value: any) => void;
    results: any;
	reportName: string;
	setReportName: (value: string) => void;
    selectedResult: any;
}

const ModalComponent: React.FC<ModalComponentProps> = ({
	open,
    setOpen,
    setResults,
    results,
	reportName,
	setReportName,
    selectedResult,
}) => {
    const supabase = createClientComponentClient();
	const handleSave = async () => {
		const { error } = await supabase
			.from("deleted_reports")
			.update({ report_name: reportName })
			.eq("id", selectedResult.id);

		if (error) console.error("Error updating report name", error);
		else {
			setResults(
				results.map((result) =>
					result.id === selectedResult.id
						? { ...result, report_name: reportName }
						: result
				)
			);
		}

		setOpen(false);
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
					width: 400,
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
					sx={{
						mb: 2,
						textAlign: "center",
						fontFamily: "inherit",
					}}
				>
					Update Report Name
				</Typography>
				<TextField
					autoFocus
					margin="dense"
					id="name"
					label="Name"
					type="text"
					fullWidth
					value={reportName}
					onChange={(e) => setReportName(e.target.value)}
				/>
				<Button onClick={handleSave} variant="login" className="mt-2">
					SAVE
				</Button>
			</Box>
		</Modal>
	);
};

export default ModalComponent;
