import React, { useState, DragEvent, FormEvent, useEffect } from "react";
import { FiEdit, FiPlus, FiTrash } from "react-icons/fi";
import { motion } from "framer-motion";
import { FaFire } from "react-icons/fa";

interface SegmentType {
  id: string;
  segment: string;
  lyricLine: string;
  chordId?: string;
}

interface ChordType {
  id: string;
  chord: string;
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
    lyricLine: "2",
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

const DEFAULT_SONG_CHORDS: ChordType[] = [
  {
    id: "1",
    chord: "G",
  },
  {
    id: "17",
    chord: "G7",
  },
  {
    id: "5",
    chord: "D",
  },
  {
    id: "4",
    chord: "C",
  },
  {
    id: "6",
    chord: "Em",
  },
];

interface RowProps {
  line: string;
  focused: boolean;
  segments: SegmentType[];
  chords: ChordType[];
  setFocus: React.Dispatch<React.SetStateAction<string | null>>;
  setSegments: React.Dispatch<React.SetStateAction<SegmentType[]>>;
  setChords: React.Dispatch<React.SetStateAction<ChordType[]>>;
  onFocusRow: () => void;
}

interface DropIndicatorProps {
  beforeId: string | null;
  lyricLine: string;
}

interface BurnBarrelProps {
  setSegments: React.Dispatch<React.SetStateAction<SegmentType[]>>;
  setChords: React.Dispatch<React.SetStateAction<ChordType[]>>;
}

interface AddSegmentProps {
  lyricLine: string;
  focused: boolean;
  setSegments: React.Dispatch<React.SetStateAction<SegmentType[]>>;
  setChords: React.Dispatch<React.SetStateAction<ChordType[]>>;
}

export const VerseBoard: React.FC = () => {
  return (
    <div className="h-screen w-full bg-base-200 text-neutral overflow-y-auto">
      <Board />
    </div>
  );
};

const Board: React.FC = () => {
  const [segments, setSegments] = useState<SegmentType[]>(DEFAULT_SONG);
  const [chords, setChords] = useState<ChordType[]>(DEFAULT_SONG_CHORDS);
  const [focusedRow, setFocusedRow] = useState<string | null>(null);
  const lines = Array.from(new Set(segments.map((s) => s.lyricLine)));
  const [isOver, setIsOver] = useState(false);

  const addLine = (line: string) => {
    const newLineNumber = (
      Math.max(...segments.map((s) => parseInt(s.lyricLine))) + 1
    ).toString();
    const newSegment: SegmentType = {
      id: Date.now().toString(),
      segment: "New Segment",
      lyricLine: newLineNumber,
    };

    const index = segments.findIndex((s) => s.lyricLine === line);
    const updatedSegments = [
      ...segments.slice(0, index + 1),
      newSegment,
      ...segments.slice(index + 1),
    ];

    setSegments(updatedSegments);
    setFocusedRow(newLineNumber);
  };

  const handleLineDelete = (line: string) => {
    const newSegments = segments.filter((s) => s.lyricLine !== line);
    setSegments(newSegments);

    if (newSegments.length > 0) {
      setFocusedRow(newSegments[0].lyricLine);
    } else {
      setFocusedRow(null);
    }
  };
  useEffect(() => {
    setFocusedRow(lines[0]);
  }, []);

  return (
    <div className="flex flex-col h-full w-full gap-3 p-12 overflow-scroll">
      <p className="text-gray-600 text-sm ">
        Each segment can be assigned a chord.
      </p>
      {lines.map((line) => (
        <div key={line} className="relative mb-[1rem]" id={`line-${line}`}>
          <Row
            key={line}
            line={line}
            focused={focusedRow === line}
            setFocus={setFocusedRow}
            segments={segments}
            setSegments={setSegments}
            chords={chords}
            setChords={setChords}
            onFocusRow={() => setFocusedRow(line)}
          />
          {focusedRow === line && (
            <div className="absolute bottom-[-2rem] right-7 ">
              <button
                className="btn btn-sm rounded-t-none rounded-r-none text-primary border-primary border-t-0 border-r-0 "
                onClick={() => addLine(line)}
              >
                <FiEdit />
                <span className="text-xs text-primary">New</span>
              </button>
              <button
                className={`btn btn-sm rounded-t-none rounded-l-none border-primary border-t-0 ${
                  isOver
                    ? "text-error bg-error/50  ring-red-600 ring-inset ring-2"
                    : "text-error"
                }`}
                onClick={() => {
                  line.length === 1
                    ? window.location.reload
                    : handleLineDelete(line);
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsOver(true);
                }}
                onDragLeave={() => setIsOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsOver(false);
                  const segmentId = e.dataTransfer.getData("segmentId");
                  // Remove the segment from the state
                  setSegments((prev) => prev.filter((s) => s.id !== segmentId));
                }}
              >
                <FiTrash />{" "}
                <span
                  className={`text-xs ${
                    isOver ? "text-neutral-500 " : "text-error"
                  }`}
                >
                  Del
                </span>
              </button>
            </div>
          )}
        </div>
      ))}

      <BurnBarrel setSegments={setSegments} setChords={setChords} />
    </div>
  );
};

const Row: React.FC<RowProps> = ({
  line,
  focused,
  setFocus,
  onFocusRow,
  segments,
  chords,
  setSegments,
  setChords,
}) => {
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

      // Remove the segment from its original line
      copy = copy.filter((s) => s.id !== segmentId);

      // Add the segment to the new line
      segmentToTransfer = { ...segmentToTransfer, lyricLine: line };

      const moveToBack = before === "-1";

      if (moveToBack) {
        copy.push(segmentToTransfer);
      } else {
        const insertAtIndex = copy.findIndex((el) => el.id === before);
        if (insertAtIndex === undefined) return;

        copy.splice(insertAtIndex, 0, segmentToTransfer);
      }

      setSegments(copy);
      setFocus(line);
    }
  };

  /* const handleDeleteClick = () => {
    const filteredSegments = segments.filter((s) => s.lyricLine === line);

    if (filteredSegments.length > 0) {
      // Delete the last segment in the line
      const lastSegment = filteredSegments[filteredSegments.length - 1];
      setSegments((prevSegments) =>
        prevSegments.filter((s) => s.id !== lastSegment.id)
      );
    } else {
      // If no segments are left, delete the line
      handleLineDelete(line);
    }
  };
   */
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
    <div
      tabIndex={0}
      className={`w-full relative p-[2.5rem_2rem_1rem] flex gap-3 flex-wrap  ${
        focused ? "ring-1 rounded-2xl ring-primary" : ""
      }`}
      onFocus={onFocusRow}
    >
      <label
        className={`absolute top-2 left-10 badge ${
          focused ? " badge-primary  " : ""
        }`}
      >
        Lyric Line {line.padStart(2, "0")}
      </label>

      <div
        onDrop={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`flex flex-wrap h-full w-full gap-1 transition-colors ${
          active ? "bg-neutral/15" : "bg-neutral/0"
        }`}
      >
        {filteredSegments.map((s) => (
          <Segment
            key={s.id}
            {...s}
            chords={chords}
            handleDragStart={handleDragStart}
            focused={focused}
            setSegments={setSegments}
            setChords={setChords}
          />
        ))}
        <DropIndicator beforeId={null} lyricLine={line} />
        <AddSegment
          lyricLine={line}
          setSegments={setSegments}
          setChords={setChords}
          focused={focused}
        />
      </div>
    </div>
  );
};

const Segment: React.FC<
  SegmentType & {
    chords: ChordType[];
    focused: boolean;
    handleDragStart: (e: DragEvent, segment: SegmentType) => void;
    setSegments: React.Dispatch<React.SetStateAction<SegmentType[]>>;
    setChords: React.Dispatch<React.SetStateAction<ChordType[]>>;
  }
> = ({
  segment,
  id,
  chords,
  focused,
  lyricLine,
  chordId,
  handleDragStart,
  setSegments,
  setChords,
    
}) => {
  const [editing, setEditing] = useState(false);
  const [editedSegment, setEditedSegment] = useState(segment);
  const [editedChord, setEditedChord] = useState(chordId);

  const handleDoubleClick = () => {
    setEditing(true);
  };
  const handleCancel = () => {
    setEditing(false);
  };

  const handleSave = () => {
    setSegments((prevSegments) =>
      prevSegments.map((s) =>
        s.id === id ? { ...s, segment: editedSegment, chordId: editedChord } : s
      )
    );
    setEditing(false);
  };

  const chord = chords.find((c) => c.id === chordId)?.chord || "";

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
        onDoubleClick={handleDoubleClick}
        className={`cursor-grab rounded p-3 active:cursor-grabbing ${
          focused ? "bg-neutral" : "bg-neutral/65"
        }`}
      >
        {editing ? (
          <div className="flex flex-col gap-2">
            <select
              value={editedChord}
              onChange={(e) => setEditedChord(e.target.value)}
              className="select select-bordered w-full max-w-xs"
            >
              <option value="">No Chord</option>
              {chords.map((chord) => (
                <option key={chord.id} value={chord.id}>
                  {chord.chord}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={editedSegment}
              onChange={(e) => setEditedSegment(e.target.value)}
              className="input input-bordered w-full max-w-xs "
            />

            <div className="w-100 flex gap-2 justify-end">
              <button
                type="button"
                onClick={handleCancel}
                className="rounded border border-neutral-700  px-2  text-neutral-900 me-1"
              >
                <span className="text-xs ">Cancel</span>
              </button>
              <button
                onClick={handleSave}
                className="rounded bg-primary px-2 text-sm text-neutral-100"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col justify-between gap-2">
            <p className="text-sm text-neutral-100">{chord}</p>
            <p className="text-sm text-neutral-100">{segment}</p>
          </div>
        )}
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

const AddSegment: React.FC<AddSegmentProps> = ({
  lyricLine,
  setSegments,
  setChords,
  focused,
}) => {
  const [form, setForm] = useState(false);
  const [segment, setSegment] = useState("");
  const [chord, setChord] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!segment) return;
    /*  if (!chord) return; */

    setChords((pv: ChordType[]) => {
      const newChord: ChordType = {
        id: Date.now().toString(),
        chord,
      };
      setSegments((pv) => {
        const newSegment: SegmentType = {
          id: Date.now().toString(),
          segment,
          lyricLine,
          chordId: newChord.id,
        };

        return [...pv, newSegment];
      });

      return [...pv, newChord];
    });

    setSegment("");
    setChord("");
    setForm(false);
  };

  if (!form) {
    return (
      <button
        onClick={() => setForm(true)}
        className={`flex items-center gap-2 rounded border border-dashed  px-2 py-1.5 text-sm  ${
          focused
            ? "text-neutral border-neutral-700 bg-neutral-800/10"
            : "text-neutral/50 border-neutral-300 bg-neutral-800/5"
        }`}
      >
        <FiPlus /> Add a segment
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex items-center gap-2 rounded p-3 ${
        focused ? " bg-neutral" : "  bg-neutral-800/10"
      }`}
    >
      {/*  <div className="h-full flex flex-col justify-between ">
        <label htmlFor="chord" className="text-xs text-neutral">
          chord
        </label>
        <label htmlFor="segment" className="text-xs text-neutral">
          Segment
        </label>
      </div> */}
      <div className="flex flex-col justify-between gap-2">
        <div className="flex">
          {/* <select
            value={editedChord}
            onChange={(e) => setEditedChord(e.target.value)}
            className="w-full rounded bg-base-200 text-neutral outline-none"
          >
            <option value="">No Chord</option>
            {chords.map((chord) => (
              <option key={chord.id} value={chord.id}>
                {chord.chord}
              </option>
            ))} 
          </select>*/}
          <input
            id="chord"
            value={chord}
            onChange={(e) => setChord(e.target.value)}
            type="text"
            autoComplete="off"
            placeholder="chord here..."
            className="rounded bg-base-200 text-neutral outline-none mr-2 placeholder:text-xs border border-neutral-700"
          />
          <button
            type="button"
            onClick={() => setForm(false)}
            className="rounded border border-neutral-700  px-2  text-neutral-900 me-1"
          >
            <span className="text-xs ">Cancel</span>
          </button>
          <button
            type="submit"
            className="rounded bg-primary px-2 text-sm text-neutral-100"
          >
            Save
          </button>
        </div>

        <input
          id="segment"
          value={segment}
          onChange={(e) => setSegment(e.target.value)}
          type="text"
          placeholder="lyric segment here..."
          autoComplete="off"
          className="rounded bg-base-200 text-neutral outline-none placeholder:text-xs border border-neutral-700"
        />
      </div>
    </form>
  );
};
