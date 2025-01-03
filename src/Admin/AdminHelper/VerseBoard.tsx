import React, { useState, DragEvent, FormEvent } from "react";
import { FiPlus, FiTrash } from "react-icons/fi";
import { motion } from "framer-motion";
import { FaFire } from "react-icons/fa";

interface SegmentType {
  id: string;
  segment: string;
  lyricLine: string;
  chordId?: string;
}

const DEFAULT_SONG: SegmentType[] = [
  // LINE 01
  {
    segment: "Amazing",
    id: "1",
    lyricLine: "1",
    chordId: "1",
  },
  { segment: "Grace", id: "2", lyricLine: "1", chordId: "17" },
  // LINE 02
  { segment: "How", id: "3", lyricLine: "2" },
  { segment: "sweet the", id: "4", lyricLine: "2", chordId: "4" },
  {
    segment: "sound",
    id: "5",
    lyricLine: "5",
    chordId: "1",
  },
  // LINE 03
  { segment: "That saved a wretch like", id: "6", lyricLine: "3" },
  { segment: "me", id: "7", lyricLine: "3", chordId: "5" },

  // LINE 04
  {
    segment: "I ",
    id: "8",
    lyricLine: "4",
  },
  {
    segment: "once was",
    id: "9",
    lyricLine: "4",
    chordId: "1",
  },
  { segment: "lost, but", id: "10", lyricLine: "4", chordId: "17" },
  {
    segment: "now am",
    id: "11",
    lyricLine: "4",
    chordId: "4",
  },
  {
    segment: "found,",
    id: "12",
    lyricLine: "4",
    chordId: "1",
  },
  // LINE 5
  {
    segment: "Was",
    id: "13",
    lyricLine: "5",
  },
  {
    segment: "blind, but",
    id: "14",
    lyricLine: "5",
    chordId: "6",
  },
  {
    segment: "now I",
    id: "15",
    lyricLine: "5",
    chordId: "5",
  },
  {
    segment: "see.",
    id: "16",
    lyricLine: "5",
    chordId: "1",
  },
];

interface RowProps {
  line: string;
  segments: SegmentType[];
  setSegments: React.Dispatch<React.SetStateAction<SegmentType[]>>;
}

interface DropIndicatorProps {
  beforeId: string | null;
  lyricLine: string;
}

interface BurnBarrelProps {
  setSegments: React.Dispatch<React.SetStateAction<SegmentType[]>>;
}

interface AddSegmentProps {
  lyricLine: string;
  setSegments: React.Dispatch<React.SetStateAction<SegmentType[]>>;
}

export const VerseBoard: React.FC = () => {
  return (
    <div className="h-screen w-full bg-neutral-900 text-neutral-50">
      <Board />
    </div>
  );
};

const Board: React.FC = () => {
  const [segments, setSegments] = useState<SegmentType[]>(DEFAULT_SONG);

  const lines = [...new Set(segments.map((segment) => segment.lyricLine))];

  return (
    <div className="flex flex-col h-full w-full gap-3 p-12 overflow-scroll">
      {lines.map((line) => (
        <Row
          key={line}
          line={line}
          segments={segments}
          setSegments={setSegments}
        />
      ))}
      <BurnBarrel setSegments={setSegments} />
    </div>
  );
};

const Row: React.FC<RowProps> = ({ line, segments, setSegments }) => {
  const [active, setActive] = useState(false);

  const handleDragStart = (e: DragEvent, segment: SegmentType) => {
    e.dataTransfer.setData("segmentId", segment.id);
  };

  const handleDragEnd = (e: DragEvent) => {
    const segmentId = e.dataTransfer.getData("segmentId");

    setActive(false);
    clearHighlights();

    const indicators = getIndicators();
    const { element } = getNearestIndicator(e, indicators);

    const before = element.dataset.before || "-1";

    if (before !== segmentId) {
      let copy = [...segments];

      let segmentToTransfer = copy.find((s) => s.id === segmentId);
      if (!segmentToTransfer) return;
      segmentToTransfer = { ...segmentToTransfer, lyricLine: line };

      copy = copy.filter((s) => s.id !== segmentId);

      const moveToBack = before === "-1";

      if (moveToBack) {
        copy.push(segmentToTransfer);
      } else {
        const insertAtIndex = copy.findIndex((el) => el.id === before);
        if (insertAtIndex === undefined) return;

        copy.splice(insertAtIndex, 0, segmentToTransfer);
      }

      setSegments(copy);
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    highlightIndicator(e);

    setActive(true);
  };

  const clearHighlights = (els?: HTMLElement[]) => {
    const indicators = els || getIndicators();

    indicators.forEach((i) => {
      i.style.opacity = "0";
    });
  };

  const highlightIndicator = (e: DragEvent) => {
    const indicators = getIndicators();

    clearHighlights(indicators);

    const el = getNearestIndicator(e, indicators);

    el.element.style.opacity = "1";
  };

  const getNearestIndicator = (e: DragEvent, indicators: HTMLElement[]) => {
    const DISTANCE_OFFSET = 50;

    const el = indicators.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();

        const offset = e.clientX - (box.left + DISTANCE_OFFSET);

        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      {
        offset: Number.NEGATIVE_INFINITY,
        element: indicators[indicators.length - 1],
      }
    );

    return el;
  };

  const getIndicators = () => {
    return Array.from(
      document.querySelectorAll(`[data-lyric-line="${line}"]`)
    ) as HTMLElement[];
  };

  const handleDragLeave = () => {
    clearHighlights();
    setActive(false);
  };

  const filteredSegments = segments.filter((s) => s.lyricLine === line);

  return (
    <div className="flex mb-6">
      <div className="mr-3 flex items-center justify-center">
        <h3 className="font-medium text-neutral-500">Line {line}</h3>
      </div>
      <div
        onDrop={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`flex h-full w-full gap-3 transition-colors ${
          active ? "bg-neutral-800/50" : "bg-neutral-800/0"
        }`}
      >
        {filteredSegments.map((s) => (
          <Segment key={s.id} {...s} handleDragStart={handleDragStart} />
        ))}
        <DropIndicator beforeId={null} lyricLine={line} />
        <AddSegment lyricLine={line} setSegments={setSegments} />
      </div>
    </div>
  );
};

const Segment: React.FC<
  SegmentType & {
    handleDragStart: (e: DragEvent, segment: SegmentType) => void;
  }
> = ({ segment, id, lyricLine, chordId, handleDragStart }) => {
  return (
    <>
      <DropIndicator beforeId={id} lyricLine={lyricLine} />
      <motion.div
        layout
        layoutId={id}
        draggable="true"
        onDragStart={(e) =>
          handleDragStart(e, { segment, id, lyricLine, chordId })
        }
        className="cursor-grab rounded border border-neutral-700 bg-neutral-800 p-3 active:cursor-grabbing"
      >
        <p className="text-sm text-neutral-100">{segment}</p>
      </motion.div>
    </>
  );
};

const DropIndicator: React.FC<DropIndicatorProps> = ({
  beforeId,
  lyricLine,
}) => {
  return (
    <div
      data-before={beforeId || "-1"}
      data-lyric-line={lyricLine}
      className="my-1 w-0.5 h-10 bg-violet-400 opacity-0"
    />
  );
};

const BurnBarrel: React.FC<BurnBarrelProps> = ({ setSegments }) => {
  const [active, setActive] = useState(false);

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setActive(true);
  };

  const handleDragLeave = () => {
    setActive(false);
  };

  const handleDragEnd = (e: DragEvent) => {
    const segmentId = e.dataTransfer.getData("segmentId");

    setSegments((pv) => {
      return pv.filter((c) => c.id !== segmentId);
    });

    setActive(false);
  };

  return (
    <div
      onDrop={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`fixed bottom-0 right-0 flex h-36 w-36 flex-col items-center justify-center rounded border border-neutral-700 bg-neutral-800 transition-colors ${
        active ? "border-red-500 bg-red-500/20" : ""
      }`}
    >
      <FaFire className="text-2xl text-red-500" />
      <p className="text-xs text-neutral-500">Remove</p>
    </div>
  );
};

const AddSegment: React.FC<AddSegmentProps> = ({ lyricLine, setSegments }) => {
  const [form, setForm] = useState(false);
  const [segment, setSegment] = useState("");
  const [chord, setChord] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!segment) return;

    setSegments((pv) => {
      const newSegment: SegmentType = {
        id: Date.now().toString(),
        segment,
        lyricLine,
      };

      return [...pv, newSegment];
    });

    setSegment("");
    setForm(false);
  };

  if (!form) {
    return (
      <button
        onClick={() => setForm(true)}
        className="mt-3 flex items-center gap-2 rounded border border-dashed border-neutral-700 bg-neutral-800/60 px-2 py-1.5 text-sm text-neutral-400"
      >
        <FiPlus /> Add a segment
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-3 flex gap-2 rounded border border-neutral-700 bg-neutral-800/60 p-3"
    >
      <div className="flex flex-col justify-between ">
        <label htmlFor="chord" className="text-xs text-neutral-400">
          chord
        </label>
        <label htmlFor="segment" className="text-xs text-neutral-400">
          Segment
        </label>
      </div>
      <div className="flex flex-col justify-between gap-2">
        <div className="flex">
          <input
            id="chord"
            value={chord}
            onChange={(e) => setChord(e.target.value)}
            type="text"
            autoComplete="off"
            className="rounded bg-neutral-900 p-1.5 text-neutral-200 outline-none mr-2"
          />
          <div className="flex flex-col justify-between gap-1 mr-1">
            <button
              type="button"
              onClick={() => setForm(false)}
              className="rounded border border-neutral-700 bg-neutral-900 px-2 py-1.5 text-sm text-neutral-100"
            >
              <span className="text-xs text-neutral-400">Cancel</span>
            </button>
            <button
              type="button"
              onClick={() => setForm(false)}
              className="rounded border border-neutral-700 bg-neutral-900 px-2 py-1.5 text-sm text-neutral-100"
            >
              <span className="text-xs text-neutral-400">New chord</span>
            </button>
          </div>
          <button
            type="submit"
            className="rounded border border-neutral-700 bg-neutral-900 px-2 py-1.5 text-sm text-neutral-100"
          >
            Save
          </button>
        </div>

        <input
          id="segment"
          value={segment}
          onChange={(e) => setSegment(e.target.value)}
          type="text"
          autoComplete="off"
          className="rounded bg-neutral-900 p-1.5 text-neutral-200 outline-none"
        />
      </div>
    </form>
  );
};
