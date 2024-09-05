import React, { useRef } from "react";
import Chord from "./Chord";
import { useVerseContext } from "../../../Contexts/VerseContext";
import { SegmentModel } from "../../../DataModels/SegmentModel";

interface Props {
  segment: SegmentModel;
}
const LyricSegment: React.FC<Props> = ({ segment }) => {
  const { setSegments } = useVerseContext();

  const chordInputRef = useRef<HTMLInputElement>(null);

  const handleInputFocus = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    chordInputRef.current?.focus();
  };

  const updatedChordId = (chordId: number | null) => {
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

  return (
    <div className="flex flex-col mr-[1rem] cursor-pointer">
      <div className="segment__chord">
        <Chord
          ref={chordInputRef}
          segment={segment}
          setChordId={updatedChordId}
        />
      </div>
      <div className="segment__lyric" onClick={handleInputFocus}>
        <span key={segment.lyricOrder}>{segment.lyric}</span>
      </div>
    </div>
  );
};

export default LyricSegment;
