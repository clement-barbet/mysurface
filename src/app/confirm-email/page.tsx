import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ConfirmPage() {
	return (
		<>
			<div className="flex flex-col items-center gap-y-4 mt-5 px-10 md:px-0">
				<h2 className="w-full md:w-1/2 text-4xl pb-4 text-left">
					Email confirmed
				</h2>
				<div className="flex justify-center items-center w-full md:w-1/2">
					<Link href="/login" className="w-full">
						<Button variant="login" className="w-full">LOG IN</Button>
					</Link>
				</div>
			</div>
		</>
	);
}
