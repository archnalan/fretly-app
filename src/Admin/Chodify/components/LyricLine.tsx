import React, { useEffect, useState } from "react";
import LyricSegment from "./LyricSegment.tsx";
import { CiEdit } from "react-icons/ci";
import { MdOutlineDelete } from "react-icons/md";
import { TbPlaylistAdd } from "react-icons/tb";
import { LineModel } from "../../../DataModels/LineModel.ts";
import { useVerseContext } from "../../../Contexts/VerseContext.ts";
import { SegmentModel } from "../../../DataModels/SegmentModel.ts";

interface Props {
  lineIndex: number;
  line: LineModel;
  lines: LineModel[];
  setLines: React.Dispatch<React.SetStateAction<LineModel[]>>;
  editLine: () => void;
  addInput: () => void;
}

const LyricLine: React.FC<Props> = ({
  lineIndex,
  line,
  lines,
  setLines,
  editLine,
  addInput,
}) => {
  const { setSegments } = useVerseContext();
  const [lineSegments, setLineSegments] = useState<SegmentModel[]>([]);

  useEffect(() => {
    const lyricLineId = line.lyricLineOrder;
    const handleLine = (line: string) => {
      if (line !== "") {
        let segs = line.trim().split(" ");

        let newSegments = segs.map((seg, index) => ({
          lyric: seg,
          lyricOrder: index + 1,
          lyricLineId,
          chordId: null,
        }));
        console.log("🚀 ~ handleLine ~ newSegmentshere:", newSegments);

        setLineSegments(newSegments);
      }
    };

    handleLine(line.lineLyrics);
  }, [line.lineLyrics]);

  useEffect(() => {
    setSegments((prevSegments) => [
      ...prevSegments.filter((seg) => seg.lyricLineId !== line.lyricLineOrder),
      ...lineSegments,
    ]);
  }, [lineSegments]);

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();

    setLines(lines.filter((_, index) => index !== lineIndex));
  };
  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    editLine();
  };

  const handleInputAdd = (e: React.MouseEvent) => {
    e.preventDefault();

    addInput();
  };
  return (
    <div className="flex">
      <div className="flex-1 flex mb-[1rem]">
        {lineSegments.map((segment, index) => (
          <LyricSegment key={index} segment={segment} />
        ))}
      </div>
      <div className="flex items-end border-gray-400">
        <span className="mr-[1rem] cursor-pointer">
          <CiEdit onClick={handleEdit} />
        </span>
        <span className="cursor-pointer mr-[1rem]" onClick={handleDelete}>
          <MdOutlineDelete />
        </span>
        <span
          className="cursor-pointer"
          onClick={() => {
            handleInputAdd;
          }}
        >
          <TbPlaylistAdd />
        </span>
      </div>
    </div>
  );
};

export default LyricLine;
