// app/questionnaire/QuestionnaireForm.tsx
"use client";
// app/questionnaire/QuestionnaireForm.tsx
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";
import QuestionComponent from "./QuestionComponent";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import T from "@/components/translations/translation";
import i18n from "@/i18n";

interface Participant {
	id: string;
	name: string;
	questionnaire: string;
}

interface Assessed {
	id: string;
	name: string;
	description: string;
}

interface Questionnaire {
	id: string;
	completed: boolean;
	data: any;
}

interface Question {
	id: string;
	question: string;
	question_type: "interaction" | "influence";
	weight: number;
}

interface QuestionnaireFormProps {
	questionnaireId: string;
	assesseds: Assessed[];
	questions: Question[];
	owner: Participant;
	language: string;
}

export default function QuestionnaireForm({
	questionnaireId,
	assesseds,
	questions,
	owner,
	language,
}: QuestionnaireFormProps) {
	const [answers, setAnswers] = useState<{
		[key: string]: { [key: string]: number };
	}>({});
	const [currentAssessedIndex, setCurrentAssessedIndex] = useState(0);
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const router = useRouter();

	const handleAnswer = (
		participantId: string,
		questionId: string,
		value: number
	) => {
		setAnswers((prevAnswers) => ({
			...prevAnswers,
			[participantId]: {
				...prevAnswers[participantId],
				[questionId]: value,
			},
		}));

		if (currentQuestionIndex < questions.length - 1) {
			setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
		} else {
			setCurrentQuestionIndex(0);
			setCurrentAssessedIndex((prevIndex) => prevIndex + 1);
		}
	};

	const calculateTotalGrade = (
		participantId: string,
		questionType: "interaction" | "influence"
	) => {
		const participantAnswers = answers[participantId] || {};
		const relevantQuestions = questions.filter(
			(question) => question.question_type === questionType
		);
		const totalWeight = relevantQuestions.reduce(
			(sum, question) => sum + question.weight,
			0
		);
		const totalScore = relevantQuestions.reduce(
			(sum, question) =>
				sum + (participantAnswers[question.id] || 0) * question.weight,
			0
		);
		return totalWeight > 0 ? totalScore / (totalWeight * 10) : 0;
	};

	const handleSubmit = async () => {
		const supabase = createClientComponentClient();

		const questionnaireData = assesseds.map((assessed) => ({
			participantId: assessed.id,
			participantName: assessed.name,
			answers: questions.map((question) => ({
				questionText: question.question.replace("%s", assessed.name),
				rating: answers[assessed.id]?.[question.id] || 0,
				weight: question.weight,
			})),
			interactionGrade: calculateTotalGrade(assessed.id, "interaction"),
			influenceGrade: calculateTotalGrade(assessed.id, "influence"),
		}));

		const { error: updateError } = await supabase
			.from("questionnaires")
			.update({ data: questionnaireData, completed: true })
			.eq("id", questionnaireId);

		if (updateError) {
			console.error("Error updating questionnaire:", updateError);
		} else {
			return router.push("/thank-you");
		}
	};

	const langMap = {
		"1": "en",
		"2": "cs",
		"3": "es",
	};

	const langCode = langMap[language] || "en";

	i18n.changeLanguage(langCode);

	return (
		<div>
			<h2>
				<b>
					<T tkey="questionnaire.evaluator" />
				</b>
				: <span className="evaluator">{owner.name}</span>
			</h2>
			{assesseds.map((assessed, assessedIndex) => (
				<div key={assessed.id}>
					<h2
						style={{
							display:
								assessedIndex === currentAssessedIndex
									? "block"
									: "none",
						}}
					>
						<b>
							<T tkey="questionnaire.evaluated" />
						</b>
						: <span className="participant">{assessed.name}</span>
					</h2>
					<h2
						className="mb-4"
						style={{
							display:
								assessedIndex === currentAssessedIndex
									? "block"
									: "none",
						}}
					>
						<b>
							<T tkey="questionnaire.description" />
						</b>
						:{" "}
						<span className="participant">
							{assessed.description}
						</span>
					</h2>
					{questions.map((question, questionIndex) => (
						<div
							key={question.id}
							className="mb-8"
							style={{
								display:
									assessedIndex < currentAssessedIndex ||
									(assessedIndex === currentAssessedIndex &&
										questionIndex <= currentQuestionIndex)
										? "block"
										: "none",
							}}
						>
							<QuestionComponent
								question={question.question.replace(
									"%s",
									assessed.name
								)}
								onAnswer={(value) =>
									handleAnswer(
										assessed.id,
										question.id,
										value
									)
								}
								selectedValue={
									answers[assessed.id]?.[question.id]
								}
							/>
						</div>
					))}
				</div>
			))}

			{currentAssessedIndex === assesseds.length && (
				<Button
					onClick={handleSubmit}
					variant="login"
					className="uppercase"
				>
					<T tkey="questionnaire.button" />
				</Button>
			)}
		</div>
	);
}
