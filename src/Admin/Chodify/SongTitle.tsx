import React, { useEffect, useRef, useState } from "react";
import { SongModel, SongWithCategorySchema } from "../../DataModels/SongModel";
import { VerseModel } from "../../DataModels/VerseModel";
import SongRequest from "../../API/SongRequest";
import { IoSearchOutline } from "react-icons/io5";
import Select, { SingleValue } from "react-select";

type SongTitleType = {
  setVerse: React.Dispatch<React.SetStateAction<VerseModel>>;
};

const SongTitle: React.FC<SongTitleType> = ({ setVerse }) => {
  const [songs, setSongs] = useState<SongModel[]>([]);
  const [selectedSong, setSelectedSong] = useState<SongModel | null>(null);

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

        setSongs(validatedSong.data);
        setVerse((prevVerse) => ({
          ...prevVerse,
          hymnId: validatedSong.data[0].id,
        }));
      } catch (error) {
        console.error("Error fetching Songs", error);
      }
    };

    getSongs();
  }, [setVerse]);

  const handleSongChange = (
    newValue: SingleValue<{ value: number; label: string }>
  ) => {
    if (newValue) {
      const selectedSong = songs.find((song) => song.id === newValue.value);
      setSelectedSong(selectedSong || null);
      if (selectedSong) {
        setVerse((prevVerse) => ({ ...prevVerse, hymnId: selectedSong.id }));
      }
    } else {
      setSelectedSong(null);
    }
  };

  const songOptions = songs.map((song) => ({
    value: song.id,
    label: song.title,
  }));

  const selectStyles = {
    control: (provided: any) => ({
      ...provided,
      height: "50px",
      width: "25rem",
      paddingLeft: "10px",
      fontSize: "1.25rem",
      fontWeight: "600",
      borderRadius: "0.375rem",
      borderColor: "var(--color-border)",
      "&:hover": {
        borderColor: "var(--color-border-hover)",
      },
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: "var(--color-placeholder)",
      opacity: "0.5",
    }),
  };

  return (
    <div className="w-full h-full bg-base-200">
      <div className="flex w-full justify-start items-center relative me-5 my-3">
        <Select
          options={songOptions}
          onChange={handleSongChange}
          value={
            selectedSong
              ? { value: selectedSong.id, label: selectedSong.title }
              : null
          }
          placeholder="Search a song..."
          className="text-xl font-semibold font-inter"
          styles={selectStyles}
          isClearable
        />
      </div>
    </div>
  );
};

export default SongTitle;
