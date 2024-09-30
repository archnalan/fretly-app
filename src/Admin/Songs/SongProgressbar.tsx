import React from "react";

const SongProgressbar: React.FC = () => {
  const stepsRender = [
    {
      title: "Basic Info",
      path: "step1",
      number: 1,
    },
    {
      title: "Additional Info",
      path: "step2",
      number: 2,
    },
    {
      title: "Review",
      path: "step3",
      number: 3,
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

export default SongProgressbar;
