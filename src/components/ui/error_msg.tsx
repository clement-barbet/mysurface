import React from 'react';

interface ErrorMessageProps {
  errorMessage: string;
  setErrorMessage: (message: string) => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ errorMessage, setErrorMessage }) => {
  return (
    errorMessage && (
      <div className="w-full text-red-600 font-bold bg-red-200 p-4 fixed top-0 z-50 flex justify-between items-center drop-shadow-sm">
        <p>{errorMessage}</p>
        <button
          onClick={() => setErrorMessage("")}
          className="font-bold text-2xl"
        >
          ×
        </button>
      </div>
    )
  );
};

export { ErrorMessage };