import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import {
  ChordCreateModel,
  ChordCreateSchema,
  ChordEditModel,
} from "../../DataModels/ChordModel";
import ChordRequest from "../../API/ChordRequest";
import { useThemeContext } from "../../Contexts/ThemeContext";
import { confirmDelete } from "../SharedClassNames/ConfirmDelete";
import { createPage } from "../SharedClassNames/createPage";

type ChordCreateType = {
  chord: ChordEditModel | undefined;
  headerText: string;
  setCreatedName: React.Dispatch<React.SetStateAction<string>>;
  setOpenChordCreate: React.Dispatch<React.SetStateAction<boolean>>;
};
const ChordCreate: React.FC<ChordCreateType> = ({
  setCreatedName,
  setOpenChordCreate,
  headerText,
  chord,
}) => {
  const {
    register,
    trigger,
    watch,
    setError,
    reset,
    setValue,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm<ChordCreateModel>({
    mode: "all",
    defaultValues: {
      difficulty: 1,
      chartAudioFilePath: "",
      chartAudioUpload: null,
      chordDifficulty: 1,
    },
    resolver: zodResolver(ChordCreateSchema),
  });

  const [isSuccess, setIsSuccess] = useState("");
  const { theme } = useThemeContext();
  const inputRef = useRef<HTMLTextAreaElement | undefined>();
  useEffect(() => {
    /* if (inputRef.current) {
      inputRef.current.focus();
    } */
    if (chord) {
      setValue("chordName", chord.chordName);
      setValue("id", chord.id);
    }
  }, [chord]);

  const onSubmit = async (data: ChordCreateModel) => {
    console.log("🚀 ~ onSubmit ~ data:", data);

    try {
      let response: any;
      if (data.id) {
        response = await ChordRequest.editChord(data.id, data);
      } else {
        response = await ChordRequest.createChord(data);
      }
      console.log("🚀 ~ onSubmit ~ response:", response);

      if (response && response.status === 201) {
        reset();
        setIsSuccess(`Chord ${data.chordName} created successfully!`);
        setCreatedName(data.chordName);
      }
      if (response && response.status === 200) {
        reset();
        setIsSuccess(`Chord ${data.chordName} edited successfully!`);
        setCreatedName(data.chordName);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.log("🚀 ~ onSubmit ~ error:", error.response.data);
        setError("root", {
          message: `Error! ${error.response.data}`,
        });
      } else {
        setError("root", { message: "Chord could not be created, Try Again!" });
      }
    }
  };

  const handleChordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (errors.root) {
      setError("root", {}); //clear any db errors
    }
    setIsSuccess("");
    setValue("chordName", e.target.value);
    trigger("chordName"); //allow realtime feedback again
  };

  return (
    <div className={confirmDelete.overlay}>
      <div className={confirmDelete.container(theme)}>
        <div className={confirmDelete.header}>
          <div></div>
          <button
            className={confirmDelete.closeButton}
            onClick={() => setOpenChordCreate(false)}
          >
            <span className="font-semibold text-2xl">&times;</span>
          </button>
        </div>

        <h1 className="mt-6 text-primary text-2xl font-semibold">
          {headerText} Chord
        </h1>

        {isSuccess && (
          <div
            className="w-3/4 flex justify-center alert align-center alert-success text-wrap"
            role="alert"
          >
            <span className="text-sm me-4">{isSuccess}</span>

            <button
              className="d-flex align-center btn text-sm text-primary"
              onClick={() => setOpenChordCreate(false)}
            >
              <IoCheckmarkCircleOutline />K
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="ml-2 mr-3">
          <div className="w-full mb-3 flex flex-col">
            <div className="mt-5 mb-4 relative">
              {/* ref={inputRef} */}
              <textarea
                id="floatingTextarea2"
                className={createPage.textareaFloat}
                {...register("chordName")}
              ></textarea>
              <label
                htmlFor="floatingTextarea2"
                className={createPage.labelFloat}
              >
                <span className="font-thin text-neutral ">Enter chord...</span>
              </label>
              {errors.chordName && (
                <p className="text-error text-sm">{errors.chordName.message}</p>
              )}
            </div>

            {/* <pre>{JSON.stringify(watch(), null, 2)}</pre> */}
            <div className="flex justify-end ms-2 mb-3">
              <button
                className="btn btn-error me-4"
                onClick={() => setOpenChordCreate(false)}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn btn-primary "
                disabled={isSubmitting}
              >
                {headerText}
              </button>
            </div>
            {errors.root && (
              <p className="text-error text-sm">{errors.root.message}</p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChordCreate;
