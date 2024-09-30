import React, { useState, useEffect, useRef } from "react";
import VerseContent from "./VerseContent";
import { VerseModel } from "../../DataModels/VerseModel";
import { IoCloseSharp } from "react-icons/io5";
import { IoMdAdd } from "react-icons/io";
import Verse from "./components/Verse";

type verseTabType = {
  verses: VerseModel[];
  activeTab: number;
  setVerses: React.Dispatch<React.SetStateAction<VerseModel[]>>;
  setActiveTab: React.Dispatch<React.SetStateAction<number>>;
  setInputDisabled: React.Dispatch<React.SetStateAction<boolean>>;
};

const VerseTabs: React.FC<verseTabType> = ({
  activeTab,
  setActiveTab,
  setInputDisabled,
  verses,
  setVerses,
}) => {
  const [disableAdd, setDisableAdd] = useState(false);

  const handleTabChange = (verse: VerseModel) => {
    setActiveTab(verse.number);
  };

  const handleVerseAdd = () => {
    const newVerse = {
      hymnId: 1,
      number: verses.length + 1,
      lyrics: "sample text",
    };
    if (newVerse.number < 13) {
      setVerses([...verses, newVerse]);
      setActiveTab(newVerse.number);
      setInputDisabled(false);
    } else {
      setDisableAdd(true);
    }
  };

  const handleTabRemove = (verseToRemove: VerseModel) => {
    const updatedVerses = verses.filter(
      (v) => v.number !== verseToRemove.number
    );
    // Re-number verses
    const renumberedVerses = updatedVerses.map((verse, index) => ({
      ...verse,
      number: index + 1,
    }));

    setVerses(renumberedVerses);
    setDisableAdd(false);
  };

  useEffect(() => {
    if (verses.length > 0) {
      const lastVerseNumber = verses[verses.length - 1].number;
      if (activeTab > lastVerseNumber) {
        setActiveTab(lastVerseNumber);
      }
    }
  }, [verses, activeTab, setActiveTab]);

  return (
    <div>
      <div role="tablist" className="tabs tabs-lifted relative">
        {verses.map((verse, index) => (
          <React.Fragment key={verse.number}>
            <input
              type="radio"
              name="my_tabs_2"
              role="tab"
              className="tab w-full "
              aria-label={`Verse ${verse.number}`}
              checked={activeTab === verse.number}
              onChange={() => handleTabChange(verse)}
            />
            {activeTab === verse.number && (
              <div
                role="tabpanel"
                className="tab-content bg-base-100 border-base-300 rounded-box p-6"
              >
                <span>TestContent verse {verse.number}</span>
                <VerseContent
                  key={verse.number}
                  setInputDisabled={setInputDisabled}
                  verse={verse}
                />
              </div>
            )}
            <button
              className="btn btn-ghost btn-circle btn-sm absolute top-0 right-0"
              onClick={() => handleTabRemove(verse)}
            >
              <IoCloseSharp />
            </button>
          </React.Fragment>
        ))}
        <button
          className="btn btn-ghost btn-circle btn-sm right-0"
          onClick={handleVerseAdd}
          disabled={disableAdd}
        >
          <IoMdAdd />
        </button>
      </div>
    </div>
  );
};

export default VerseTabs;
