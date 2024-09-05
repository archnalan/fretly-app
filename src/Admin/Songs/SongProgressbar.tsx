import React from "react";
import { Steps } from "antd";

const SongProgressbar: React.FC = () => {
  const stepsRender = [
    {
      title: "Basic Info",
      path: "step1",
    },
    {
      title: "Additional Info",
      path: "step2",
    },
    {
      title: "Review",
      path: "step3",
    },
  ];

  const currentStep = stepsRender.findIndex((step) =>
    window.location.pathname.includes(step.path)
  );
  return (
    <Steps
      current={currentStep}
      labelPlacement="vertical"
      items={stepsRender}
      percent={(currentStep / stepsRender.length) * 100}
    />
  );
};

export default SongProgressbar;
