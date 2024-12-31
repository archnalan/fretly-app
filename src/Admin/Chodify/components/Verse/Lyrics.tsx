import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useRef,
  useEffect,
} from "react";
import { FaCaretUp } from "react-icons/fa";

type LyricsProps = {
  lineNumber: number;
  focused: boolean;
  onFocusLine?: () => void;
};

const Lyrics = forwardRef<HTMLInputElement, LyricsProps>(
  ({ lineNumber, focused, onFocusLine }, ref) => {
    const [lyric, setLyric] = useState("");
    const [lyrics, setLyrics] = useState<string[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
      focus: () => {
        inputRef.current?.focus();
      },
    }));

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
        className="w-full border rounded-2xl p-[4rem_2rem_1rem] flex gap-3 flex-wrap bg-base-100 cursor-move"
        onFocus={onFocusLine}
      >
        <label className="badge badge-primary absolute top-2 left-2">
          Lyric Line {lineNumber.toString().padStart(2, "0")}
        </label>

        {lyrics.map((lyric, index) => (
          <div
            key={index}
            className="p-[0_0rem] max-h-[2rem] flex align-center justify-between gap-[0.6rem] rounded-sm bg-info text-base-100"
          >
            <span className="flex-1 ml-2 text-sm overflow-hidden text-ellipsis self-center ">
              {lyric}
            </span>
            <div className="flex align-center gap-1">
              <div className="h-[100%] w-[1rem] flex justify-center self-center bg-base">
                <span
                  className="text-red-900 cursor-pointer"
                  onClick={() => deleteLyric(index)}
                >
                  &times;
                </span>
              </div>
              <div className="h-[100%] w-[0.01em] bg-base border "></div>
              <div className="pt-[5%] w-[1rem] flex items-center cursor-pointer">
                <FaCaretUp />
              </div>
            </div>
          </div>
        ))}

        <input
          type="text"
          id="lyric-input"
          placeholder="Enter lyric segment..."
          className="h-[2rem] p-0 outline-none border-none text-lg w-[12rem] bg-transparent"
          value={lyric}
          maxLength={50}
          onChange={(e) => setLyric(e.target.value)}
          onKeyDown={handleKeyDown}
          ref={inputRef}
        />
      </div>
    );
  }
);

export default Lyrics;
