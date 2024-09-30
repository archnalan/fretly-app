import React, { useState, useEffect } from "react";

type ErrorMessageProps = {
  errorMessage: string;
};

const ErrorMessage: React.FC<ErrorMessageProps> = ({ errorMessage }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (errorMessage) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 3000); // 3 seconds

      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  return (
    <div className="w-full flex justify-end absolute">
      <div
        className={`w-1/4  h-fit alert alert-error text-wrap transition-transform duration-500 transform ${
          isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        }`}
        role="alert"
        style={{ transition: "transform 1s, opacity 1s" }}
      >
        <span className="text-sm">{errorMessage}</span>
      </div>
    </div>
  );
};

export default ErrorMessage;
