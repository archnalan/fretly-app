import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { ChordCreateModel } from "../../DataModels/ChordModel";

type ChordCreateType = {
  setCreatedName: React.Dispatch<React.SetStateAction<string>>;
  setOpenChordCreate: React.Dispatch<React.SetStateAction<boolean>>;
};
const ChordCreate: React.FC<ChordCreateType> = ({
  setCreatedName,
  setOpenChordCreate,
}) => {
  const {
    register,
    trigger,
    /* watch, */
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

  const onSubmit = async (data: ChordCreateModel) => {
    console.log("🚀 ~ onSubmit ~ data:", data);

    try {
      const response = await ChordRequest.createChord(data);
      console.log("🚀 ~ onSubmit ~ response:", response);

      if (response && response.status === 201) {
        reset();
        setIsSuccess(`Chord ${data.chordName} created successfully!`);
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
    <div className="w-100 vh-100 d-flex justify-content-center align-items-center position-fixed bg-dark bg-opacity-50 z-100 chord-create">
      <div className="w-50 position-relative border bg-white shadow px-5 pt-3 pd-5 rounded">
        <div
          className="position-absolute btn border-0 top-0 end-0"
          onClick={() => setOpenChordCreate(false)}
        >
          <span className="fs-1 text-danger">&times;</span>
        </div>
        <h1 className="mt-4 mb-4">Create a chord</h1>

        {isSuccess && (
          <div
            className="w-75 d-flex justify-content-center alert align-items-center alert-success text-wrap"
            role="alert"
          >
            <span className="fs-5 me-4">{isSuccess}</span>

            <button
              className="d-flex align-items-center btn fs-5 text-sm text-primary"
              onClick={() => setOpenChordCreate(false)}
            >
              <IoCheckmarkCircleOutline />K
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="w-100 mb-3 d-flex flex-column">
            <div className="w-100 form-floating mb-4">
              <label htmlFor="floatingInput">
                <span className="fs-6">Enter chord...</span>
              </label>
              <input
                type="text"
                id="floatingInput"
                className="w-100 form-control fs-2"
                style={{ width: "75%", height: "100px" }}
                {...register("chordName")}
                onChange={handleChordChange}
              />
              {errors.chordName && (
                <p className="text-danger text-sm">
                  {errors.chordName.message}
                </p>
              )}
            </div>

            {/* <pre>{JSON.stringify(watch(), null, 2)}</pre> */}
            <div className="d-flex justify-content-end ms-2 mb-3">
              <button
                className="btn btn-danger me-4"
                onClick={() => setOpenChordCreate(false)}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn btn-primary "
                disabled={isSubmitting}
              >
                Create
              </button>
            </div>
            {errors.root && (
              <p className="text-danger text-sm">{errors.root.message}</p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChordCreate;
