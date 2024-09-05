import React from "react";
import { Steps } from "antd";

const BookProgressbar: React.FC = () => {
  const stepsRender = [
    {
      title: "Basic Info",
      path: "step1",
    },
    {
      title: "Details",
      path: "step2",
    },
    {
      title: "Publication Info",
      path: "step3",
    },
    {
      title: "Additional Info",
      path: "step4",
    },
    {
      title: "Review",
      path: "step5",
    },
  ];

  const currentStep = stepsRender.findIndex((step) =>
    window.location.pathname.includes(step.path)
  );
  return (
    <Steps
      current={currentStep}
      labelPlacement="vertical"
      size="small"
      items={stepsRender}
      percent={(currentStep / stepsRender.length) * 100}
    />
  );
};

export default BookProgressbar;
