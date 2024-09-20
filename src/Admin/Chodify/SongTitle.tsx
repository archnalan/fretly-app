import React, { useEffect, useState } from "react";
import { SongModel, SongWithCategorySchema } from "../../DataModels/SongModel";
import { VerseModel } from "../../DataModels/VerseModel";
import SongRequest from "../../API/SongRequest";

type SongTitleType = {
  setVerse: React.Dispatch<React.SetStateAction<VerseModel>>;
};

const SongTitle: React.FC<SongTitleType> = ({ setVerse }) => {
  const [hymns, setHymns] = useState<SongModel[]>([]);

  useEffect(() => {
    const getSongs = async () => {
      try {
        const response = await SongRequest.fetchAllSongs();

        const validatedSong = SongWithCategorySchema.array().safeParse(
          response.data.$values
        );
        if (!validatedSong.success) {
          console.error(
            "🚀 ~ getSongs ~ validatedSong.error:",
            validatedSong.error.issues
          );
          return;
        }

        setHymns(validatedSong.data);

        setVerse((prevVerse) => ({
          ...prevVerse,
          hymnId: validatedSong.data[0].id,
        }));
      } catch (error) {
        console.error("Error fetching Hymns", error);
      }
    };
    getSongs();
  }, []);

  const handleSongChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedHymn = hymns.find(
      (hymn) => hymn.id === parseInt(e.target.value)
    );

    if (selectedHymn) {
      setVerse((prevVerse) => ({ ...prevVerse, hymnId: selectedHymn.id }));
    }
  };

  return (
    <>
      <div className="w-full h-full bg-base-200">
        <select
          className="select select-bordered w-full max-w-fit text-xl font-semibold font-inter mt-3 mb-2"
          onChange={handleSongChange}
        >
          {hymns.map((hymn) => (
            <option key={hymn.id} value={hymn.id}>
              {hymn.title}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};

export default SongTitle;
