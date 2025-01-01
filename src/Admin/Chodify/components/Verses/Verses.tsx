import React, { useState } from "react";
import LyricLines from "./LyricLines";
import { IoMdAdd } from "react-icons/io";

const Verses = () => {
  const [verses, setVerses] = useState<number[]>([1]);

  const addVerseTab = () => {
    setVerses((prevVerses) => [...prevVerses, prevVerses.length + 1]);
  };

  const handleVerseRemove = (verse: number) => {
    setVerses((prevVerses) => prevVerses.filter((v) => v !== verse));
  };

  return (
    <div className="w-full flex flex-col align-center justify-center">
      <div className="w-3/4 tabs tabs-lifted border" role="tablist" id="song 1">
        {verses.map((verse) => (
          <React.Fragment key={verse}>
            <input
              type="radio"
              name="my_tabs_2"
              role="tab"
              className="tab"
              aria-label={`verse ${verse}`}
              id={`tab-${verse}`}
              autoComplete="off"
            />
            <div
              role="tabpanel"
              className="tab-content bg-base-100 border-base-300 rounded-box p-6"
            >
              <label>Enter lyrics for verse{verse}</label>
              <LyricLines />
            </div>
            <div className="absolute flex top-1 right-1 ">
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
      </div>
    </div>
  );
};

export default Verses;
