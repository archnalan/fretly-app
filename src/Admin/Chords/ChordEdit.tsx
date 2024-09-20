import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";

type ChordEditType = {
  chordToEdit: ChordEditModel;
  setEditedName: React.Dispatch<React.SetStateAction<string>>;
  setOpenChordEdit: React.Dispatch<React.SetStateAction<boolean>>;
};
const ChordEdit: React.FC<ChordEditType> = ({
  setEditedName,
  chordToEdit,
  setOpenChordEdit,
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
  } = useForm<ChordEditModel>({
    mode: "all",
    resolver: zodResolver(ChordEditSchema),
  });

  const [isSuccess, setIsSuccess] = useState("");

  useEffect(() => {
    reset({
      id: chordToEdit.id,
      chordName: chordToEdit.chordName,
      difficulty: chordToEdit.difficulty,
      chartAudioUpload: chordToEdit.chartAudioUpload,
      chartAudioFilePath: chordToEdit.chartAudioFilePath,
    });
    setIsSuccess("");
  }, [chordToEdit]);

  const onSubmit = async (data: ChordEditModel) => {
    console.log("🚀 ~ onSubmit ~ data:", data);

    try {
      const response = await ChordRequest.editChord(chordToEdit.id, data);
      console.log("🚀 ~ onSubmit ~ response:", response);

      if (response && response.status === 200) {
        reset({
          id: chordToEdit.id,
          chordName: "",
          difficulty: chordToEdit.difficulty,
          chartAudioUpload: chordToEdit.chartAudioUpload,
          chartAudioFilePath: chordToEdit.chartAudioFilePath,
        });
        setIsSuccess(
          `Chord ${chordToEdit.chordName} updated to ${data.chordName} successfully!`
        );
        setEditedName(data.chordName);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ChordEditModel>;
      console.error("🚀 ~ onSubmit ~ error:", axiosError.response?.data);

      if (axiosError.response && axiosError.response.data) {
        setError("root", {
          message: `Error! ${axiosError.response.data}`,
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
    <div className="w-100 vh-100 d-flex justify-content-center align-items-center position-fixed bg-dark bg-opacity-50 z-100 chord-edit">
      <div className="w-50 position-relative border bg-white shadow px-5 pt-3 pd-5 rounded">
        <div
          className="position-absolute btn border-0 top-0 end-0"
          onClick={() => {
            setOpenChordEdit(false);
            setValue("chordName", "");
          }}
        >
          <span className="fs-1 text-danger">&times;</span>
        </div>
        <h1 className="mt-4 mb-4">Edit a chord</h1>

        {isSuccess && (
          <div
            className="w-75 alert alert-success text-wrap text-sm"
            role="alert"
          >
            {isSuccess}
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
                disabled={isSubmitting}
                onClick={() => {
                  setOpenChordEdit(false);
                  setValue("chordName", "");
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn btn-primary "
                disabled={isSubmitting}
              >
                Edit
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

export default ChordEdit;
