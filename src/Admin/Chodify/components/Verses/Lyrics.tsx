import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useRef,
  useEffect,
} from "react";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import AddChord from "./AddChord";

type LyricsProps = {
  lineNumbering: number;
  focused: boolean;
  onFocusLine?: () => void;
};

const Lyrics = forwardRef<HTMLInputElement, LyricsProps>(
  ({ lineNumbering, focused, onFocusLine }, ref) => {
    const [lyric, setLyric] = useState("");
    const [lyrics, setLyrics] = useState<string[]>([]);
    const [currentChordIndex, setCurrentChordIndex] = useState<number | null>(
      null
    );
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
      focus: () => {
        inputRef.current?.focus();
      },
    }));

    const ClearLyrics = () => {
      setLyrics([]);
    };

    useEffect(() => {
      if (focused && inputRef.current) {
        inputRef.current.focus();
      }
    }, [focused]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        const newLyric = lyric.trim();
        if (newLyric.length === 0) {
          return;
        }
        setLyrics([...lyrics, newLyric]);
        setTimeout(() => {
          setLyric("");
        }, 0);
      }
    };

    const deleteLyric = (index: number) => {
      const newLyrics = [...lyrics];
      newLyrics.splice(index, 1);
      setLyrics(newLyrics);
    };
    return (
      <div
        tabIndex={0}
        className={`w-full border rounded-2xl p-[4rem_2rem_1rem] flex gap-3 flex-wrap bg-base-100  ${
          focused ? "ring-1 border-info" : ""
        }`}
        onFocus={onFocusLine}
      >
        <label
          className={`absolute top-2 left-2 badge ${
            focused ? " badge-primary  " : "badge-ghost"
          }`}
        >
          Lyric Line {lineNumbering.toString().padStart(2, "0")}
        </label>

        {lyrics.map((lyric, index) => (
          <div key={index} className="relative flex flex-col cursor-move">
            {currentChordIndex === index && (
              <div className="max-h-[1.75rem] absolute top-[-50%] border overflow-clip">
                <AddChord />
              </div>
            )}
            <div
              className={`p-[0_0rem] h-[2rem] flex align-center justify-between gap-[0.6rem] rounded-sm text-base-100 mt-[1rem] ${
                focused ? " bg-neutral" : "bg-neutral-content"
              }`}
            >
              <span
                className={`flex-1 ml-2 text-sm overflow-hidden text-ellipsis self-center ${
                  focused ? "" : "text-neutral"
                }`}
              >
                {lyric}
              </span>
              <div className="flex align-center gap-1">
                <div className="h-[100%] w-[1rem] flex justify-center self-center bg-base">
                  <span
                    className="text-base flex items-center cursor-pointer"
                    onClick={() => deleteLyric(index)}
                  >
                    &times;
                  </span>
                </div>
                <div className="h-[100%] w-[0.01em] bg-base border "></div>
                <div
                  className="w-[1rem] flex items-center cursor-pointer"
                  onClick={() => {
                    setCurrentChordIndex(
                      index === currentChordIndex ? null : index
                    );
                  }}
                >
                  {currentChordIndex === index ? (
                    <FaCaretDown />
                  ) : (
                    <FaCaretUp />
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        {focused && (
          <input
            type="text"
            id="lyric-input"
            autoComplete="off"
            placeholder="Enter lyric segment..."
            className="h-[2rem] p-0 flex-grow outline-none border-none text-lg w-[12rem] bg-transparent mt-[1rem]"
            value={lyric}
            maxLength={50}
            onChange={(e) => setLyric(e.target.value)}
            onKeyDown={handleKeyDown}
            ref={inputRef}
          />
        )}
      </div>
    );
  }
);

export default Lyrics;
