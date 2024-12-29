import React from "react";

const BookProgressbar: React.FC = () => {
  const stepsRender = [
    {
      title: "Basic Info",
      path: "step1",
      number: 1,
    },
    {
      title: "Details",
      path: "step2",
      number: 2,
    },
    {
      title: "Publication Info",
      path: "step3",
      number: 3,
    },
    {
      title: "Additional Info",
      path: "step4",
      number: 4,
    },
    {
      title: "Review",
      path: "step5",
      number: 5,
    },
  ];

  const currentStep = stepsRender.findIndex((step) =>
    window.location.pathname.includes(step.path)
  );
  return (
    <>
      <ul className="steps w-full">
        {stepsRender.map((step, index) => (
          <li
            key={index}
            data-content={`${index < currentStep ? "✔" : `${step.number}`}`}
            className={`step ${
              index <= currentStep
                ? "step-primary text-primary"
                : "step-neutral text-neutral"
            } `}
          >
            {step.title}
          </li>
        ))}
      </ul>
    </>
  );
};

export default BookProgressbar;
