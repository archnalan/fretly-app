import React, { useEffect, useState } from "react";
import axios from "axios";
import { VerseModel } from "../../DataModels/VerseModel";
import { PayLoadSchema } from "../../DataModels/PayLoad";
import { useVerseContext } from "../../Contexts/VerseContext";
import Verse from "./components/Verse";
import {
  getFromLocalStorage,
  saveToLocalStorage,
} from "../AdminHelper/TempLocalStorage";

type verseContentType = {
  verse: VerseModel;
  setInputDisabled: React.Dispatch<React.SetStateAction<boolean>>;
};

const VerseContent: React.FC<verseContentType> = ({
  verse,
  setInputDisabled,
}) => {
  const { lines, chords, segments } = useVerseContext();

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

      saveToLocalStorage("versePayLoad", payload);

      /* const response = axios.post(
        "https://localhost:7077/api/verses/create",
        payload,
        {
          headers: {
            "content-Type": "application/json",
          },
        }
      );
 
      console.log("🚀 ~ handleSave ~ response:", response);*/
    } catch (error) {
      console.error("Error Saving verse", error);
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

  useEffect(() => {
    console.log("🚀 ~ useEffect ~ chords:", chords);
  }, [chords]);

  useEffect(() => {
    console.log("🚀 ~ useEffect ~ SEGMENTS:", segments);
  }, [segments]);

  return (
    <>
      <div className="w-full h-full flex flex-col justify-between items-center">
        <div className="pb-3">
          <Verse setInputDisabled={setInputDisabled} handleSave={handleSave} />
        </div>
      </div>
    </>
  );
};

export default VerseContent;
