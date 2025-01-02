import React, { useCallback, useState } from "react";
import LyricLines from "./LyricLines";
import { IoMdAdd } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import TabsComponent from "../../../AdminHelper/TabsComponent";
import { Item } from "../../../../DataModels/TabsModel";

const Verses = () => {
  const [verses, setVerses] = useState<number[]>([1]);
  const [activeVerse, setActiveVerse] = useState<number | null>(1);
  const MAX_VERSES = 12;

  const addVerseTab = () => {
    const newVerse = Math.max(...verses) + 1;
    setVerses((prevVerses) => [...prevVerses, newVerse]);
    setActiveVerse(newVerse);
  };

  const handleVerseRemove = (verse: number) => {
    console.log("🚀 ~ handleVerseRemove ~ verse:", verse);
    setVerses((prevVerses) => prevVerses.filter((v) => v !== verse));
    if (activeVerse === verse) {
      setActiveVerse(verses.length > 1 ? verses[0] : null);
    }
  };

  const TabItems: Item[] = verses.map((verse, index) => ({
    id: index,
    title: <label>Verse</label>,
    content: (
      <div className="w-full">
        <label>Enter lyrics for stanza {verse}</label>
        <LyricLines />
      </div>
    ),
  }));

  /*  const handleAddTab = useCallback(
    (addTab: (title: JSX.Element, content: JSX.Element) => void) => {
      const addNewTab = () => {
        const newVerse = verses.length + 1;
        setVerses((prevVerses) => [...prevVerses, newVerse]);

        const newTitle = (
          <label
            htmlFor={`tab-${newVerse}`}
            className="w-full tab"
            role="tab"
            id={`tab-${newVerse}`}
            onClick={() => {
              setActiveVerse(newVerse);
            }}
          >
            <span>{newVerse}</span>
          </label>
        );

        const newContent = (
          <div
            role="tabpanel"
            className="tab-content bg-base-100 border-base-300 rounded-box p-6"
          >
            <label>Enter lyrics for stanza {newVerse}</label>
            <LyricLines />
          </div>
        );

        addTab(newTitle, newContent);
      };

      // Example: Add a new tab when needed, you can replace this with your logic
      addNewTab();
    },
    []
  ); */
  return (
    <TabsComponent initialItems={TabItems} itemsCountLimit={MAX_VERSES}>
      {/* <div
      className="w-full tabs tabs-lifted relative"
      role="tablist"
      id="song 1"
    >
      {verses.map((stanza, index) => (
        <React.Fragment key={index}>
          {/* <input
            type="radio"
            name="my_tabs_2"
            role="tab"
            className="tab"
            aria-label={`Verse ${index + 1}`}
            id={`tab-${stanza}`}
          /> 
          <label
            htmlFor={`tab-${stanza}`}
            className="w-full tab"
            role="tab"
            id={`tab-${stanza}`}
            onClick={() => setActiveVerse(stanza)}
          >
            <span>{`Verse ${index + 1}`}</span>
            <button
              type="button"
              className="icon-button"
              aria-label={`Remove verse ${index}`}
              onClick={() => handleVerseRemove(stanza)}
            >
              <IoClose />
            </button>
          </label>
          <div
            role="tabpanel"
            className="tab-content bg-base-100 border-base-300 rounded-box p-6"
          >
            <label>Enter lyrics for stanza {stanza}</label>
            <LyricLines />
          </div>
          {/* <div className="absolute flex top-1 right-1 ">
            <span
              className="badge-ghost rounded-full cursor-pointer"
              onClick={addVerseTab}
            >
              <IoMdAdd />
            </span>
            {verses.length > 1 && (
              <span
                className="badge-ghost rounded-full cursor-pointer"
                onClick={() => handleVerseRemove(verse)}
              >
                &times;
              </span>
            )}
          </div> 
        </React.Fragment>
      ))}
      <div className="right-1/2">
        <button
          className="btn btn-ghost btn-circle btn-sm "
          onClick={addVerseTab}
          disabled={verses.length > 11}
        >
          <IoMdAdd />
        </button>
      </div>
    </div> */}
    </TabsComponent>
  );
};

export default Verses;
