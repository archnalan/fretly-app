import React, { useEffect, useState } from "react";
import { VerseModel } from "../../DataModels/VerseModel";
import { LineModel } from "../../DataModels/LineModel";
import { SegmentModel } from "../../DataModels/SegmentModel";
import { ChordModel } from "../../DataModels/ChordModel";
import { VerseContext } from "../../Contexts/VerseContext";
import { LuArrowUpLeftSquare } from "react-icons/lu";
import VerseContent from "./VerseContent";
import SongTitle from "./SongTitle";
import VerseTabs from "./VerseTab.tsx";
import { TbEdit } from "react-icons/tb";
import { useThemeContext } from "../../Contexts/ThemeContext.ts";
import { useNavigate } from "react-router-dom";
import { getFromLocalStorage } from "../AdminHelper/TempLocalStorage.ts";
import { PayLoadSchema } from "../../DataModels/PayLoad.ts";

const Chordify: React.FC = () => {
  const [inputVerse, setInputVerse] = useState<VerseModel>({
    number: 1,
    hymnId: 0,
    lyrics: "",
  });
  const [lines, setLines] = useState<LineModel[]>([]);
  const [verses, setVerses] = useState<VerseModel[]>([
    { hymnId: 1, number: 1, lyrics: "" },
  ]);
  const [segments, setSegments] = useState<SegmentModel[]>([]);
  const [chords, setChords] = useState<ChordModel[]>([]);
  const [inputDisabled, setInputDisabled] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState(1);
  const { theme } = useThemeContext();

  const navigate = useNavigate();

  const handleVerse = (e: React.MouseEvent) => {
    e.preventDefault();

    if (inputVerse.lyrics !== "") {
      let lyricLines = inputVerse.lyrics.trim().split("\n");

      let newLines = lyricLines.map((line, index) => ({
        lyricLineOrder: index + 1,
        verseId: inputVerse.hymnId,
        lineLyrics: line,
      }));
      console.log("🚀 ~ newLines ~ newLines:", newLines);

      setLines(newLines);
      setInputVerse((prevVerse) => ({ ...prevVerse, lyrics: "" })); // clear text area after submission
      setInputDisabled(true);
    }
  };

  useEffect(() => {
    const storedPayload = getFromLocalStorage("versePayload");

    if (storedPayload) {
      const validationResult = PayLoadSchema.safeParse(storedPayload);

      if (validationResult.success) {
        console.log("🚀 ~ Retrieved and validated payload:", storedPayload);
        // You can use the retrieved data here if necessary
      } else {
        console.error(
          "🚀 ~ Invalid payload retrieved from local storage:",
          validationResult.error
        );
        // Optionally remove the invalid payload from local storage
        //localStorage.removeItem("versePayload");
      }
    }
  }, []);

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
        <div className="w-full h-full bg-base-200 px-5 overflow-y-scroll">
          <div
            className={`${
              theme === "dark" ? "" : "text-dark-"
            } flex flex-col justify-between items-start mx-2`}
          >
            <div className="w-full ms-5 me-5">
              <div className="flex items-center mb-4 z-1">
                <div className="tooltip tooltip-bottom" data-tip="add song">
                  <button
                    className="btn btn-ghost hover:bg-transparent "
                    /* onClick={navigate("/admin/songs/create/step1")} */
                  >
                    <TbEdit size={30} />
                  </button>
                </div>
                <SongTitle setVerse={setInputVerse} />
              </div>
            </div>
            <div className="w-full z-0">
              <VerseTabs
                verses={verses}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                setInputDisabled={setInputDisabled}
                setVerses={setVerses}
              />
            </div>

            <div className="w-full flex justify-center">
              {/*  <div className="pb-10">
                <VerseContent
                  setInputDisabled={setInputDisabled}
                  verse={currVerse}
                />
              </div> */}

              <div className="w-3/4 fixed bottom-0 ">
                <textarea
                  className="w-full h-25 max-h-60 mb-6 relative rounded-xl p-4 border focus:border-gray-700"
                  placeholder={`${inputDisabled ? "" : "Enter Verse here..."}`}
                  value={inputVerse.lyrics}
                  onChange={(e) => {
                    setInputVerse((prevVerse) => ({
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
          </div>
        </div>
      </VerseContext.Provider>
    </>
  );
};

export default Chordify;
