function FormAddManager({ process }) {
	if (process != 2) {
		return null;
	}
	return (
		<div className="my-2 p-5 shadow-md rounded-lg bg-white dark:bg-black bg-opacity-90">
			<h2 className="mb-2 font-bold">Add new manager</h2>
		</div>
	);
}

export default FormAddManager;
