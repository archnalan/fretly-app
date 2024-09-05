import React, { useState } from "react";
import { VerseModel } from "../../DataModels/VerseModel";
import { LineModel } from "../../DataModels/LineModel";
import { SegmentModel } from "../../DataModels/SegmentModel";
import { ChordModel } from "../../DataModels/ChordModel";
import { VerseContext } from "../../Contexts/VerseContext";
import { LuArrowUpLeftSquare } from "react-icons/lu";
import VerseContent from "./VerseContent";
import SongTitle from "./SongTitle";
import VerseTabs from "./VerseTab.tsx";

const Chordify: React.FC = () => {
  const [verse, setVerse] = useState<VerseModel>({
    number: 1,
    hymnId: 0,
    lyrics: "",
  });
  const [lines, setLines] = useState<LineModel[]>([]);
  const [segments, setSegments] = useState<SegmentModel[]>([]);
  const [chords, setChords] = useState<ChordModel[]>([]);
  const [inputDisabled, setInputDisabled] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState(1);

  const handleVerse = (e: React.MouseEvent) => {
    e.preventDefault();

    if (verse.lyrics !== "") {
      let lyricLines = verse.lyrics.trim().split("\n");

      let newLines = lyricLines.map((line, index) => ({
        lyricLineOrder: index + 1,
        verseId: verse.hymnId,
        lineLyrics: line,
      }));
      console.log("🚀 ~ newLines ~ newLines:", newLines);

      setLines(newLines);
      setVerse((prevVerse) => ({ ...prevVerse, lyrics: "" })); // clear text area after submission
      setInputDisabled(true);
    }
  };

  const handleVerseNumChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVerse((prevVerse) => ({
      ...prevVerse,
      number: parseInt(e.target.value),
    }));
  };
  const verses: VerseModel[] = [
    { hymnId: 1, number: 1, lyrics: "Lyrics for verse 1" },
    { hymnId: 1, number: 2, lyrics: "Lyrics for verse 2" },
    { hymnId: 1, number: 3, lyrics: "Lyrics for verse 3" },
    // Add more verses as needed
  ];

  return (
    <>
      <VerseContext.Provider
        value={{
          lines,
          setLines,
          segments,
          setSegments,
          chords,
          setChords,
          inputDisabled,
          setInputDisabled,
        }}
      >
        <div className="w-full h-full flex flex-col justify-between items-center bg-base-200 mb-8">
          <div className="">
            <SongTitle setVerse={setVerse} />
            <VerseTabs
              verses={verses}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              setInputDisabled={setInputDisabled}
            />
          </div>

          <div className="pb-10">
            <VerseContent setInputDisabled={setInputDisabled} verse={verse} />
          </div>

          <div className="flex fixed bottom-0 w-3/4">
            <textarea
              className="w-full h-20 max-h-60 mb-6 mr-4 rounded-xl p-4 border focus:border-gray-700"
              placeholder={`${inputDisabled ? "" : "Enter Verse here..."}`}
              value={verse.lyrics}
              onChange={(e) => {
                setVerse((prevVerse) => ({
                  ...prevVerse,
                  lyrics: e.target.value,
                }));
              }}
              disabled={inputDisabled}
            ></textarea>
            <button
              type="submit"
              className="absolute right-4 top-2 border-none bg-transparent"
              onClick={handleVerse}
              disabled={inputDisabled}
            >
              <LuArrowUpLeftSquare
                className={`text-2xl cursor-pointer ${
                  inputDisabled ? "text-gray-500" : "text-black"
                }`}
              />
            </button>
          </div>
        </div>
      </VerseContext.Provider>
    </>
  );
};

export default Chordify;
