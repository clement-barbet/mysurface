// app/questionnaire/QuestionnaireForm.tsx
"use client";
// app/questionnaire/QuestionnaireForm.tsx
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";
import QuestionComponent from "./QuestionComponent";

interface Participant {
  id: string;
  name: string;
  email: string;
  questionnaire: string;
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
  participants: Participant[];
  questions: Question[];
}

export default function QuestionnaireForm({
  questionnaireId,
  participants,
  questions,
}: QuestionnaireFormProps) {
  const [answers, setAnswers] = useState<{
    [key: string]: { [key: string]: number };
  }>({});
  const [currentParticipantIndex, setCurrentParticipantIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

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
      setCurrentParticipantIndex((prevIndex) => prevIndex + 1);
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

    const questionnaireData = participants.map((participant) => ({
      participantId: participant.id,
      participantName: participant.name,
      answers: questions.map((question) => ({
        questionText: question.question.replace("%s", participant.name),
        rating: answers[participant.id]?.[question.id] || 0,
        weight: question.weight,
      })),
      interactionGrade: calculateTotalGrade(participant.id, "interaction"),
      influenceGrade: calculateTotalGrade(participant.id, "influence"),
    }));

    const { error: updateError } = await supabase
      .from("questionnaires")
      .update({ data: questionnaireData, completed: true })
      .eq("id", questionnaireId);

    if (updateError) {
      console.error("Error updating questionnaire:", updateError);
    } else {
      // Questionnaire updated successfully
      // You can perform any additional actions or show a success message
    }
  };

  return (
    <div>
      {participants.map((participant, participantIndex) => (
        <div key={participant.id}>
          <h2
            style={{
              display:
                participantIndex === currentParticipantIndex ? "block" : "none",
            }}
          >
            Participant: {participant.name}
          </h2>
          {questions.map((question, questionIndex) => (
            <div
              key={question.id}
              className="mb-8"
              style={{
                display:
                  participantIndex < currentParticipantIndex ||
                  (participantIndex === currentParticipantIndex &&
                    questionIndex <= currentQuestionIndex)
                    ? "block"
                    : "none",
              }}
            >
              <QuestionComponent
                question={question.question.replace("%s", participant.name)}
                onAnswer={(value) =>
                  handleAnswer(participant.id, question.id, value)
                }
                selectedValue={answers[participant.id]?.[question.id]}
              />
            </div>
          ))}
        </div>
      ))}

      {currentParticipantIndex === participants.length && (
        <button onClick={handleSubmit}>Submit</button>
      )}
    </div>
  );
}
