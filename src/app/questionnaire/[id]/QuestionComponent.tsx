"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface QuestionComponentProps {
  question: string;
  onAnswer: (value: number) => void;
  selectedValue?: number;
}

export default function QuestionComponent({
  question,
  onAnswer,
  selectedValue,
}: QuestionComponentProps) {
  const handleButtonClick = (value: number) => {
    onAnswer(value);
  };

  return (
    <div>
      <h3>{question}</h3>
      <div className="mt-4 space-x-2">
        {[...Array(11)].map((_, index) => (
          <Button
            key={index}
            onClick={() => handleButtonClick(index)}
            variant={selectedValue === index ? "default" : "outline"}
          >
            {index}
          </Button>
        ))}
      </div>
    </div>
  );
}
