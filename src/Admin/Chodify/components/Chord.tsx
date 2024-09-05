import React, {
  useState,
  forwardRef,
  FormEvent,
  MouseEvent,
  RefObject,
} from "react";
import { SegmentModel } from "../../../DataModels/SegmentModel";
import { useVerseContext } from "../../../Contexts/VerseContext";
import { ChordModel } from "../../../DataModels/ChordModel";

type Props = {
  ref: RefObject<HTMLInputElement>;
  segment: SegmentModel;
};

const Chord = forwardRef<HTMLInputElement, Props>(({ segment }, ref) => {
  const { setSegments, setChords } = useVerseContext();

  const [chordName, setChordName] = useState<string>("");
  const [chordError, setChordError] = useState<string>("");

  const handleChordInput = (e: FormEvent<EventTarget>) => {
    e.preventDefault();

    const addedChord = chordName.trim();

    const chordRegex =
      /^([A-G])(#|b|##|bb)?(m|maj|min|dim|aug|M7|maj7|m7|7|sus2|sus4|add\d+|6|9|11|13|dim7|m6|m9|m11|m13|maj9|maj11|maj13)?(\/[A-G](#|b)?)?$/;

    if (addedChord.match(chordRegex)) {
      const newChord: ChordModel = {
        chordName: addedChord,
        lineId: segment.lyricLineId,
        segmentOrderNo: segment.lyricOrder,
        chordDifficulty: 1,
      };

      setChords((prevChords) => {
        console.log("🚀 ~ setChords ~ newChord:", newChord);
        console.log("🚀 ~ handleChordInput ~ prevChords:", prevChords);
        return [...prevChords, newChord];
      });

      console.log(
        "🚀 ~ handleChordInput ~ segment.lyricOrder:",
        segment.lyricOrder
      );
      setChordId(segment.lyricOrder);

      setChordName(""); // reset the state before moving on
      (ref as React.RefObject<HTMLInputElement>).current?.blur();
    } else {
      console.error("Error: " + chordName + " is Invalid chord");
      setChordError(chordName + " is Invalid Chord");
    }
  };

  const setChordId = (chordId: number | null) => {
    console.log("🚀 ~ updatedChordId ~ chordId:", chordId);
    setSegments((prevSegments) =>
      prevSegments.map((seg) =>
        seg.lyricLineId === segment.lyricLineId &&
        seg.lyricOrder === segment.lyricOrder
          ? { ...seg, chordId }
          : seg
      )
    );
  };

  const handleRevision = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setChordError("");
    (ref as React.RefObject<HTMLInputElement>).current?.focus();
  };

  const removeChord = () => {
    setChords((prevChords) =>
      prevChords.filter(
        (chord) =>
          !(
            chord.lineId === segment.lyricLineId &&
            chord.segmentOrderNo === segment.lyricOrder
          )
      )
    );
  };
  const clearPrevChord = () => {
    removeChord();
  };
  return (
    <div className="w-fit">
      <strong className="flex">
        {chordError ? (
          <div className="relative w-full flex">
            <button
              className="bg-red-500 text-white border border-black rounded px-4 py-1 cursor-pointer"
              onDoubleClick={handleRevision}
            >
              ?
            </button>

            <div className="hidden absolute bottom-[calc(100%+0.5em)] w-full border border-gray-400 group-hover:block">
              <p className="font-light text-xs bg-black text-white m-0 rounded p-2">
                {chordError}
              </p>
            </div>
          </div>
        ) : (
          <>
            <form className="inline-block">
              <input
                ref={ref}
                className="w-full border-none font-inter text-lg font-bold box-content placeholder:text-sm placeholder:font-medium"
                placeholder="C#..."
                onChange={(e) => setChordName(e.target.value)}
                onBlur={(e) => {
                  if (e.target.value.trim() !== "") {
                    clearPrevChord();
                    handleChordInput(e);
                  } else {
                    setChordId(null);
                    removeChord();
                  }
                }}
              />
            </form>
            {/* <ChordSelect /> */}
          </>
        )}
      </strong>
    </div>
  );
});
export default Chord;
