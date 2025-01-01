import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  ChartCreateModel,
  ChartCreateSchema,
} from "../../../../DataModels/ChartModel";
import { ChordModel, ChordSchema } from "../../../../DataModels/ChordModel";
import { RiAddCircleFill } from "react-icons/ri";
import ChordRequest from "../../../../API/ChordRequest";
import { FaCaretUp } from "react-icons/fa";

const AddChord = () => {
  const [chord, setChord] = useState<ChordModel>();
  const [createdChord, setCreatedChord] = useState<ChordModel>();
  const [chords, setChords] = useState<ChordModel[]>([]);
  const [openCreateChord, setOpenCreateChord] = useState(false);
  const [createdName, setCreatedName] = useState("");
  const {
    register,
    trigger,
    watch,
    setValue,
    setError,
    formState: { errors, isSubmitting, isValid },
    handleSubmit,
    reset,
  } = useForm<ChartCreateModel>({
    mode: "all",
    defaultValues: {
      fretPosition: 1,
    },
    resolver: zodResolver(ChartCreateSchema),
  });

  useEffect(() => {
    const chordFetch = async () => {
      try {
        const response = await ChordRequest.fetchAllChords();

        const chordResult = ChordSchema.array().safeParse(
          response.data.$values
        );

        if (!chordResult.success) {
          console.error(
            "🚀 ~ chordFetch ~ chordResult.errors:",
            chordResult.error.issues
          );
          return;
        }
        const chordData = chordResult.data;

        if (chordData.length > 0) {
          setChords(chordResult.data);
        }

        if (createdName !== "") {
          const newChord = chordData.find((c) => c.chordName === createdName);
          if (newChord) {
            setTimeout(() => {
              setCreatedChord(newChord);
            }, 0);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };
    chordFetch();
  }, [createdName]);

  const clearSelection = () => {
    setChord(undefined);
    setCreatedChord(undefined);
  };

  return (
    <div className="w-full border bg-black">
      <div className="flex justify-between mb-2">
        <select
          className="w-full select select-bordered p-0 outline-none border-none text-lg "
          {...register("chordId", {
            setValueAs: (v) => parseInt(v),
          })}
        >
          {chord ? (
            <option value={chord.id}>{chord.chordName}</option>
          ) : (
            <option value="">...</option>
          )}

          {createdChord && (
            <option value={createdChord.id}>{createdChord.chordName}</option>
          )}

          {chords &&
            chords.map((chord, index) => (
              <option key={index} value={chord.id}>
                {chord.chordName}
              </option>
            ))}
        </select>

        <div className="flex align-center gap-1">
          <div className="h-[100%] w-[1rem] flex justify-center self-center bg-base">
            <span
              className="text-base flex items-center cursor-pointer"
              onClick={clearSelection}
            >
              &times;
            </span>
          </div>
          <div className="h-[100%] w-[0.01em] bg-base border "></div>
          <div
            className="w-[1rem] flex items-center cursor-pointer bg-info"
            onClick={() => setOpenCreateChord(true)}
          >
            <RiAddCircleFill className="rounded-5" />
          </div>
        </div>
      </div>
      {errors.chordId && (
        <p className="text-error text-sm mb-2">{errors.chordId.message}</p>
      )}
    </div>
  );
};

export default AddChord;
