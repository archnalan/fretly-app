import React, { useEffect, useState } from "react";
import axios from "axios";
import { VerseModel } from "../../DataModels/VerseModel";
import { LineModel } from "../../DataModels/LineModel";
import { SegmentModel } from "../../DataModels/SegmentModel";
import { ChordModel } from "../../DataModels/ChordModel";
import { PayLoadSchema } from "../../DataModels/PayLoad";
import { VerseContext } from "../../Contexts/VerseContext";
import Verse from "./components/Verse";

type verseContentType = {
  verse: VerseModel;
  setInputDisabled: React.Dispatch<React.SetStateAction<boolean>>;
};

const VerseContent: React.FC<verseContentType> = ({
  verse,
  setInputDisabled,
}) => {
  const [lines, setLines] = useState<LineModel[]>([]);
  const [segments, setSegments] = useState<SegmentModel[]>([]);
  const [chords, setChords] = useState<ChordModel[]>([]);

  const handleSave = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      const payload = {
        verseCreate: {
          number: verse.number,
          hymnId: verse.hymnId,
        },

        linesCreate: lines.map((line) => ({
          lyricLineOrder: line.lyricLineOrder,
          verseId: line.verseId,
        })),

        segmentsCreate: segments,

        chordsCreate: chords,
      };

      console.log("🚀 ~ handleSave ~ payload:", payload);

      const validationResult = PayLoadSchema.safeParse(payload);

      if (!validationResult.success) {
        console.error(
          "🚀 ~ handleSave ~ validationResult.success:",
          validationResult.error
        );
      }

      const response = axios.post(
        "https://localhost:7077/api/verses/create",
        payload,
        {
          headers: {
            "content-Type": "application/json",
          },
        }
      );

      console.log("🚀 ~ handleSave ~ response:", response);
    } catch (error) {
      console.error("Error Saving verse", error);
    }
  };

  useEffect(() => {
    console.log("🚀 ~ useEffect ~ chords:", chords);
  }, [chords]);

  useEffect(() => {
    console.log("🚀 ~ useEffect ~ SEGMENTS:", segments);
  }, [segments]);

  return (
    <>
      <VerseContext.Provider
        value={{ lines, setLines, segments, setSegments, chords, setChords }}
      >
        <div className="w-full h-full flex flex-col justify-between items-center bg-base-200 mb-8">
          <div className="pb-10">
            <Verse
              setInputDisabled={setInputDisabled}
              handleSave={handleSave}
            />
          </div>
        </div>
      </VerseContext.Provider>
    </>
  );
};

export default VerseContent;
