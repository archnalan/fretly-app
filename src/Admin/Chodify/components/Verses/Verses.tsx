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
    id: index + 1,
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
    <div className="w-full p-3 h-full overflow-y-auto flex flex-col items-center bg-base-200 ">
      <div className="w-3/4 mb-[3rem]">
        <TabsComponent
          initialItems={TabItems}
          itemsCountLimit={MAX_VERSES}
        ></TabsComponent>
      </div>
    </div>
  );
};

export default Verses;
