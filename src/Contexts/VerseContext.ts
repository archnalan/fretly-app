import { createContext, useContext } from "react";
import { SegmentModel } from "../DataModels/SegmentModel";
import { LineModel } from "../DataModels/LineModel";
import { ChordModel } from "../DataModels/ChordModel";

interface verseContextType {
  lines: LineModel[];
  chords: ChordModel[];
  segments: SegmentModel[];
  inputDisabled: boolean;
  setLines:React.Dispatch<React.SetStateAction<LineModel[]>>
  setChords: React.Dispatch<React.SetStateAction<ChordModel[]>>;
  setSegments: React.Dispatch<React.SetStateAction<SegmentModel[]>>;
  setInputDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}
export const VerseContext = createContext<verseContextType | undefined>(
  undefined
);

export const useVerseContext = () => {
  const context = useContext(VerseContext);

  if (!context) {
    throw new Error("useSegmentContext must be used within a SegmentProvider");
  }

  return context;
}