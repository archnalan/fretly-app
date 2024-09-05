import React, { useState } from "react";
import VerseContent from "./VerseContent";
import { VerseModel } from "../../DataModels/VerseModel";

type verseTabType = {
  verses: VerseModel[];
  activeTab: number;
  setActiveTab: React.Dispatch<React.SetStateAction<number>>;
  setInputDisabled: React.Dispatch<React.SetStateAction<boolean>>;
};

const VerseTabs: React.FC<verseTabType> = ({
  activeTab,
  setActiveTab,
  setInputDisabled,
  verses,
}) => {
  const handleTabChange = (num: number) => {
    setActiveTab(num);
  };

  return (
    <div>
      <div className="tabs tabs-lifted">
        {verses.map((verse) => (
          <input
            key={verse.number}
            type="radio"
            name="verse_tabs"
            id={`tab${verse.number}`}
            className="tab"
            aria-label={`Verse ${verse.number}`}
            checked={activeTab === verse.number}
            onChange={() => handleTabChange(verse.number)}
          />
        ))}
      </div>
      <div className="tab-content bg-base-100 border-base-300 rounded-box p-6">
        {verses.map(
          (verse) =>
            activeTab === verse.number && (
              <VerseContent
                key={verse.number}
                setInputDisabled={setInputDisabled}
                verse={verse}
              />
            )
        )}
      </div>
    </div>
  );
};

export default VerseTabs;
