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
  editModeSegmentId: string | null;
  setFocus: React.Dispatch<React.SetStateAction<string | null>>;
  onFocusRow: () => void;
  setSegments: React.Dispatch<React.SetStateAction<SegmentType[]>>;
  setChords: React.Dispatch<React.SetStateAction<ChordType[]>>;
  setEditModeSegmentId: React.Dispatch<React.SetStateAction<string | null>>;
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
  chords: ChordType[];
  formOpen: boolean;
  addFormChord: string;
  addFormSegment: string;
  onAddClick?: () => void;
  setSegments: React.Dispatch<React.SetStateAction<SegmentType[]>>;
  setChords: React.Dispatch<React.SetStateAction<ChordType[]>>;
  setFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setAddFormSegment: React.Dispatch<React.SetStateAction<string>>;
  setAddFormChord: React.Dispatch<React.SetStateAction<string>>;
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
  const [trackLines, setTrackLines] = useState<string[]>([]);
  const segmentLines = Array.from(new Set(segments.map((s) => s.lyricLine)));
  const lines = Array.from(new Set([...segmentLines, ...trackLines])).sort(
    (a, b) => parseInt(a) - parseInt(b)
  );
  const [editModeSegmentId, setEditModeSegmentId] = useState<string | null>(
    null
  );
  const [isOver, setIsOver] = useState(false);

  useEffect(() => {
    setTrackLines(Array.from(new Set(segments.map((s) => s.lyricLine))));
  }, []);

  useEffect(() => {
    const linesWithSegments = Array.from(
      new Set(segments.map((s) => s.lyricLine))
    );
    const emptyLines = trackLines.filter(
      (line) => !linesWithSegments.includes(line)
    );
    if (emptyLines.length > 0) {
      const newTrackLines = trackLines.filter(
        (line) => !emptyLines.includes(line)
      );
      if (newTrackLines.length !== trackLines.length) {
        const currentFocusedLine = focusedRow;
        const { updatedSegments, updatedTrackLines, lineMap } = renumberLines(
          segments,
          newTrackLines
        );
        setSegments(updatedSegments);
        setTrackLines(updatedTrackLines);
        if (currentFocusedLine) {
          if (emptyLines.includes(focusedRow)) {
            if (updatedTrackLines.length > 0) {
              setFocusedRow(updatedTrackLines[0]);
            } else {
              setFocusedRow(null);
            }
          } else {
            setFocusedRow(lineMap[currentFocusedLine] || currentFocusedLine);
          }
        }
      }
    }
  }, [segments]);

  const renumberLines = (segments: SegmentType[], trackLines: string[]) => {
    const lineOrder = [...trackLines].sort((a, b) => parseInt(a) - parseInt(b));
    const newLineMap = Object.fromEntries(
      lineOrder.map((line, index) => [line, (index + 1).toString()])
    );
    const updatedSegments = segments.map((segment) => ({
      ...segment,
      lyricLine: newLineMap[segment.lyricLine] || segment.lyricLine,
    }));
    const updatedTrackLines = trackLines.map(
      (line) => newLineMap[line] || line
    );

    return { updatedSegments, updatedTrackLines, lineMap: newLineMap };
  };

  const addLine = (line: string) => {
    const lineIndex = lines.indexOf(line);
    const tempLineId = `temp_${Date.now()}`;

    const newSegmentId = Date.now().toString();
    const newSegment: SegmentType = {
      id: newSegmentId,
      segment: "New lyric...",
      lyricLine: tempLineId,
    };

    const newTrackLines = [...trackLines];
    newTrackLines.splice(lineIndex + 1, 0, tempLineId);
    setTrackLines(newTrackLines);

    setSegments((prev) => [...prev, newSegment]);

    const { updatedSegments, updatedTrackLines } = renumberLines(
      [...segments, newSegment],
      newTrackLines
    );

    setSegments(updatedSegments);
    setTrackLines(updatedTrackLines);
    const newLineNumber = updatedTrackLines[lineIndex + 1];
    setEditModeSegmentId(newSegmentId);
    setFocusedRow(newLineNumber);
  };

  const handleVerseSave = () => {
    //renumber the segments and lines before saving
    // const { updatedSegments } = renumberLines(segments, trackLines);
    // console.log(updatedSegments);
  };

  const handleLineDelete = (line: string) => {
    const lineIndex = lines.indexOf(line);
    const newSegments = segments.filter((s) => s.lyricLine !== line);

    const newTrackLines = trackLines.filter((l) => l !== line);
    const { updatedSegments, updatedTrackLines } = renumberLines(
      newSegments,
      newTrackLines
    );

    setSegments(updatedSegments);
    setTrackLines(updatedTrackLines);

    if (updatedTrackLines.length > 0) {
      const nextIndex = Math.min(lineIndex, updatedTrackLines.length - 1);
      setFocusedRow(updatedTrackLines[nextIndex]);
    } else {
      setFocusedRow(null);
    }
    setEditModeSegmentId(null);
  };

  useEffect(() => {
    setFocusedRow(lines[0]);
  }, []);

  const handleSegmentRemoval = (segmentId: string) => {
    setSegments((prev) => prev.filter((s) => s.id !== segmentId));
  };

  return (
    <div className="flex flex-col h-full w-full gap-3 p-12 overflow-scroll">
      <p className="text-gray-600 text-sm ">
        Each segment can be assigned a chord.
      </p>
      {lines.map((line) => (
        <div
          key={line}
          className="relative mb-[2rem]"
          id={`line-${line}`}
          onClick={() => {
            if (focusedRow !== line) setFocusedRow(line);
          }}
        >
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
            editModeSegmentId={editModeSegmentId}
            setEditModeSegmentId={setEditModeSegmentId}
          />
          {focusedRow === line && (
            <div className="absolute bottom-[-2rem] right-7 ">
              <button
                className="btn btn-sm rounded-t-none rounded-r-none text-primary border-primary border-t-neutral/10 border-r-0 "
                onClick={() => addLine(line)}
              >
                <FiPlus />
                <span className="text-xs text-primary">New Line</span>
              </button>
              <button
                className={`btn btn-sm rounded-t-none rounded-l-none border-primary border-t-neutral/10 ${
                  isOver
                    ? "text-error bg-error/50  ring-red-600 ring-inset ring-2"
                    : "text-error"
                }`}
                onClick={() => {
                  if (lines.length > 1) {
                    document.getElementById(`my_modal_${line}`)?.showModal();
                  }
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
                  if (!(lines.length === 1 && segments.length === 1)) {
                    handleSegmentRemoval(segmentId);
                  }
                }}
              >
                <FiTrash />{" "}
                <span
                  className={`text-xs ${
                    isOver ? "text-neutral-500 " : "text-error"
                  }`}
                >
                  Remove
                </span>
              </button>
              <dialog id={`my_modal_${line}`} className="modal">
                <div className="modal-box">
                  <h3 className="font-bold text-lg">Delete Line</h3>
                  <div className="pt-4">
                    <p>Are you sure you want to delete this line?</p>
                    <p>Segments in this line will be deleted.</p>
                  </div>
                  <form method="dialog" className="modal-action">
                    <button className="btn btn-sm btn-circle btn-ghost text-error border-none absolute right-2 top-2">
                      ✕
                    </button>
                    <button
                      className=" btn btn-error"
                      onClick={() => handleLineDelete(line)}
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </dialog>
            </div>
          )}
        </div>
      ))}
      <div>
        <button className="btn btn-primary" onClick={handleVerseSave}>
          Save
        </button>
      </div>

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
  editModeSegmentId,
  setEditModeSegmentId,
}) => {
  const [active, setActive] = useState(false);
  const [editSegment, setEditSegment] = useState<SegmentType | null>(null);
  const [editedSegment, setEditedSegment] = useState<SegmentType | null>(null);
  const [editedChord, setEditedChord] = useState<ChordType | null>(null);
  const [addFormOpen, setAddFormOpen] = useState(false);
  const [addFormChord, setAddFormChord] = useState("");
  const [addFormSegment, setAddFormSegment] = useState("");

  useEffect(() => {
    if (!focused) {
      if (editSegment) {
        handleSave();
      }
      if (addFormOpen) {
        if (addFormSegment && addFormSegment.trim() !== "") {
          handleAddFormSave();
        } else {
          setAddFormOpen(false);
        }
      }
    }
  }, [focused]);

  useEffect(() => {
    if (editModeSegmentId) {
      const segmentToEdit = segments.find((s) => s.id === editModeSegmentId);
      if (segmentToEdit) {
        setEditSegment(segmentToEdit);
        setEditedSegment(segmentToEdit);
        const curentChord = chords.find((c) => c.id === segmentToEdit.chordId);
        setEditedChord(curentChord || { id: "", chord: "" });
      }
    }
  }, [editModeSegmentId, segments, chords]);

  const handleAddFormSave = () => {
    if (!addFormSegment || addFormSegment.trim() === "") {
      setAddFormOpen(false);
      return;
    }

    setChords((prev) => {
      const newChord: ChordType = {
        id: Date.now().toString(),
        chord: addFormChord,
      };

      setSegments((prev) => {
        const newSegment: SegmentType = {
          id: Date.now().toString(),
          segment: addFormSegment,
          lyricLine: line,
          chordId: addFormChord ? newChord.id : undefined,
        };

        return [...prev, newSegment];
      });

      return addFormChord ? [...prev, newChord] : prev;
    });

    setAddFormSegment("");
    setAddFormChord("");
    setAddFormOpen(false);
  };

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

  const handleDoubleClick = (seg: SegmentType) => {
    if (editSegment && editedSegment) {
      handleSave();
    }

    if (addFormOpen) {
      setAddFormOpen(false);
    }

    setEditSegment(seg);
    setEditedSegment(seg);
    const curentChord = chords.find((c) => c.id === seg.chordId);
    setEditedChord(curentChord || { id: "", chord: "" });
  };

  const handleSave = () => {
    if (editSegment && editedSegment) {
      setSegments((prevSegments) =>
        prevSegments.map((s) =>
          s.id === editSegment.id
            ? {
                ...s,
                segment: editedSegment.segment,
                chordId: editedChord?.id,
              }
            : s
        )
      );
    }
    setEditSegment(null);
    setEditModeSegmentId(null);
  };

  const filteredSegments = segments.filter((s) => s.lyricLine === line);
  return (
    <div
      tabIndex={0}
      className={`w-full relative p-[2.5rem_2rem_1rem] flex gap-3 flex-wrap  ${
        focused
          ? "ring-1 rounded-2xl ring-primary"
          : "ring-1 rounded-2xl ring-neutral/20"
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
          <div
            key={s.id}
            className="h-full flex items-center gap-2"
            onDoubleClick={() => handleDoubleClick(s)}
          >
            <Segment
              {...s}
              chords={chords}
              handleDragStart={handleDragStart}
              focused={focused}
              setSegments={setSegments}
              setChords={setChords}
              editedSegment={editedSegment}
              handleSave={handleSave}
              editing={editSegment?.id === s.id}
              setEditSegment={setEditSegment}
              setEditedSegment={setEditedSegment}
              editedChord={editedChord}
              setEditedChord={setEditedChord}
              handleCancel={() => setEditSegment(null)}
            />
          </div>
        ))}
        <DropIndicator beforeId={null} lyricLine={line} />
        <AddSegment
          chords={chords}
          lyricLine={line}
          setSegments={setSegments}
          setChords={setChords}
          focused={focused}
          onAddClick={editSegment ? handleSave : undefined}
          formOpen={addFormOpen}
          setFormOpen={setAddFormOpen}
          setAddFormSegment={setAddFormSegment}
          setAddFormChord={setAddFormChord}
          addFormSegment={addFormSegment}
          addFormChord={addFormChord}
        />
      </div>
    </div>
  );
};

const Segment: React.FC<
  SegmentType & {
    chords: ChordType[];
    focused: boolean;
    editing: boolean;
    editedSegment: SegmentType | null;
    editedChord: ChordType | null;
    handleSave: () => void;
    handleCancel: () => void;
    handleDragStart: (e: DragEvent, segment: SegmentType) => void;
    setSegments: React.Dispatch<React.SetStateAction<SegmentType[]>>;
    setChords: React.Dispatch<React.SetStateAction<ChordType[]>>;
    setEditedSegment: React.Dispatch<React.SetStateAction<SegmentType | null>>;
    setEditSegment: React.Dispatch<React.SetStateAction<SegmentType | null>>;
    setEditedChord: React.Dispatch<React.SetStateAction<ChordType | null>>;
  }
> = ({
  segment,
  id,
  chords,
  focused,
  lyricLine,
  chordId,
  editedChord,
  handleDragStart,
  editedSegment,
  setEditedSegment,
  setEditedChord,
  editing,
  handleSave,
  handleCancel,
}) => {
  const chord = chords.find((c) => c.id === chordId)?.chord || "";

  const handleSegmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedSegment((prev) => {
      if (prev) {
        return { ...prev, segment: e.target.value };
      }
      return null;
    });
  };

  const handleChordChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedChordId = e.target.value;
    setEditedChord((prev) => {
      if (prev) {
        return { ...prev, id: selectedChordId };
      }
      return null;
    });
  };

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
        className={`h-[5rem] flex items-center cursor-grab rounded p-2 active:cursor-grabbing ${
          focused ? "bg-neutral" : "bg-neutral/65"
        }`}
      >
        {editing ? (
          <form onSubmit={handleSave} className="flex relative">
            <div className="flex flex-col gap-2 me-1">
              <select
                value={editedChord?.id || ""}
                onChange={handleChordChange}
                className="select min-h-[1.2rem] h-[1.5rem] rounded-sm max-w-[12rem] bg-base-100/75"
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
                autoFocus
                draggable="false"
                value={
                  editedSegment?.segment != null ? editedSegment.segment : ""
                }
                onChange={(e) => {
                  e.stopPropagation();
                  handleSegmentChange(e);
                }}
                className="input h-[1.5rem] rounded-sm bg-base-100/75 max-w-[12rem]"
              />
            </div>
            <button
              className="btn btn-ghost btn-xs absolute -top-3 -right-2 rounded-full"
              onClick={handleCancel}
            >
              <span className="text-xs text-error ">&times;</span>
            </button>

            <div className="flex flex-col gap-2 mr-2 me-2">
              <button
                type="submit"
                className="btn h-[3rem] w-[3rem] min-h-[1.5rem] bg-primary/50 border-none text-base-100 self-center rounded-full"
              >
                <FiEdit />
              </button>
            </div>
          </form>
        ) : (
          <div className="h-full flex flex-col justify-between">
            <div className="h-1.5rem">
              <p className="text-sm text-neutral-100">{chord}</p>
            </div>
            <div className="mt-2">
              <p className="text-sm text-neutral-100">{segment}</p>
            </div>
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
      className="my-1 w-0.5 h-20 bg-violet-400 opacity-0"
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
  chords,
  lyricLine,
  setSegments,
  setChords,
  focused,
  onAddClick,
  formOpen,
  setFormOpen,
  addFormSegment,
  setAddFormSegment,
  addFormChord,
  setAddFormChord,
}) => {
  useEffect(() => {
    if (formOpen === false && addFormSegment && addFormSegment.trim() !== "") {
      handleSubmit();
    }
  }, [formOpen]);

  const handleAddClick = () => {
    if (onAddClick) onAddClick();
    setFormOpen(true);
  };

  const handleSubmit = (e?: FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (!addFormSegment || addFormSegment.trim() === "") {
      setFormOpen(false);
      return;
    }

    setChords((pv: ChordType[]) => {
      if (addFormChord && addFormChord !== "") {
        const newChord: ChordType = {
          id: Date.now().toString(),
          chord: chords.find((c) => c.id === addFormChord)?.chord || "",
        };

        setSegments((pv) => {
          const newSegment: SegmentType = {
            id: Date.now().toString(),
            segment: addFormSegment.trim(),
            lyricLine,
            chordId: newChord.id,
          };

          return [...pv, newSegment];
        });

        return [...pv, newChord];
      } else {
        // No chord selected, just create the segment
        setSegments((pv) => {
          const newSegment: SegmentType = {
            id: Date.now().toString(),
            segment: addFormSegment.trim(),
            lyricLine,
          };

          return [...pv, newSegment];
        });

        return pv;
      }
    });

    setAddFormSegment("");
    setAddFormChord("");
    setTimeout(() => {
      setFormOpen(true);
    }, 10);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ delay: 0.1 }}
        layout
        layoutId={""}
        className="h-[5rem] flex self-center cursor-grab rounded"
      >
        {!formOpen ? (
          <button
            onClick={handleAddClick}
            className={`h-full flex items-center gap-2 p-2 rounded border border-dashed text-sm ${
              focused
                ? "text-neutral border-neutral-700 bg-neutral-800/10"
                : "text-neutral/50 border-neutral-300 bg-neutral-800/5"
            }`}
          >
            <FiPlus /> Add a segment
          </button>
        ) : (
          <div
            className={`h-full rounded flex items-center p-2 ${
              focused ? "bg-neutral" : "bg-neutral/65"
            }`}
          >
            <form onSubmit={handleSubmit} className="flex relative">
              <div className="flex flex-col gap-2 me-1">
                <select
                  value={addFormChord}
                  onChange={(e) => setAddFormChord(e.target.value)}
                  className="select min-h-[1.2rem] h-[1.5rem] rounded-sm max-w-[12rem] bg-base-100/75"
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
                  autoFocus
                  draggable="false"
                  value={addFormSegment}
                  onChange={(e) => setAddFormSegment(e.target.value)}
                  className="input input-ghost h-[1.5rem] bg-base-100/75 rounded-sm max-w-[12rem]"
                />
              </div>
              <button
                className="btn btn-ghost btn-xs absolute -top-3 -right-2 rounded-full"
                onClick={() => setFormOpen(false)}
              >
                <span className="text-xs text-error ">&times;</span>
              </button>

              <div className="flex flex-col gap-2 mr-2 me-2">
                <button
                  type="submit"
                  className="btn h-[3rem] w-[3rem] min-h-[1.5rem] bg-primary/50 border-none text-base-100 self-center rounded-full"
                >
                  <FiEdit />
                </button>
              </div>
            </form>
          </div>
        )}
      </motion.div>
    </>
  );
};
