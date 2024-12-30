import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RiAddCircleFill } from "react-icons/ri";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChordModel, ChordSchema } from "../../DataModels/ChordModel";
import {
  ChartCreateModel,
  ChartCreateSchema,
  ChartEditModel,
  ChartEditSchema,
} from "../../DataModels/ChartModel";
import ChordRequest from "../../API/ChordRequest";
import ChartRequest, { apiEndpoints } from "../../API/ChartRequest";
import API from "../../API/API";
import ChartPreview from "./ChartCreate/ChartPreview";
import AudioPreview from "./ChartCreate/AudioPreview";
import { createPage } from "../SharedClassNames/createPage";
import { useThemeContext } from "../../Contexts/ThemeContext";
import { idSchema } from "../../DataModels/ValidatedID";
import { tr } from "date-fns/locale";

const ChartCreate: React.FC = () => {
  const [chords, setChords] = useState<ChordModel[]>([]);
  const [chordChange, setChordChange] = useState<ChordModel[]>([]);
  const [chord, setChord] = useState<ChordModel>();
  const [openCreateChord, setOpenCreateChord] = useState(false);
  const [createdName, setCreatedName] = useState("");
  const [createdChord, setCreatedChord] = useState<ChordModel>();
  const [chartPreview, setChartPreview] = useState("");
  const [audioPreview, setAudioPreview] = useState("");
  const [headerText, setHeaderText] = useState("Create");
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
  const { theme } = useThemeContext();
  const [chartData, setChartData] = useState<ChartEditModel>({
    id: 0,
    filePath: "",
    chordId: 1,
    fretPosition: 1,
    chartUpload: null,
    chartAudioUpload: null,
    chartAudioFilePath: "",
    positionDescription: "",
  });
  const { id } = useParams();
  const exit = useNavigate();

  useEffect(() => {
    if (id) {
      const getChart = async () => {
        try {
          const validatedId = idSchema.parse(id);

          const response = await ChartRequest.fetchSpecificChordChart(
            validatedId
          );

          const chartResult = ChartEditSchema.safeParse(response.data);

          if (!chartResult.success) {
            console.error(
              "🚀 ~ getChart ~ chartResult.error:",
              chartResult.error
            );
            return;
          }
          setChartData(chartResult.data);

          if (chartResult.data) {
            chartResult.data.filePath &&
              setChartPreview(chartResult.data.filePath);
            chartResult.data.chartAudioFilePath &&
              setAudioPreview(chartResult.data.chartAudioFilePath);
            chartResult.data.chordId &&
              setChord(
                chordChange.find((ch) => ch.id === chartResult.data.chordId)
              );
            setHeaderText("Edit");
          }
        } catch (error) {
          console.error("Error:", error);
        }
      };
      getChart();
    }
  }, [id, chordChange]);

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
            setCreatedChord(newChord);
            setValue("chordId", newChord.id);
            trigger("chordId");
          }
        }
      } catch (error) {
        console.error(error);
      }
    };
    chordFetch();
  }, [createdName]);

  useEffect(() => {
    const chordsSelect = async () => {
      try {
        const response = await ChordRequest.fetchAllChords();
        const chordResults = ChordSchema.array().safeParse(
          response.data.$values
        );
        if (!chordResults.success) {
          console.error(
            "🚀 ~ chordsSelect ~ chordResults.error:",
            chordResults.error
          );
          return;
        }
        setChordChange(chordResults.data);
      } catch (error) {
        console.error(error);
      }
    };
    chordsSelect();
  }, []);

  const handleChartUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    //clear previous states
    setValue("chartUpload", null);
    setValue("filePath", "");
    setChartPreview("");
    setError("chartUpload", {});

    const chartFile = e.target.files?.[0];
    if (chartFile && chartFile.type.substr(0, 5) === "image") {
      const chartReader = new FileReader();
      chartReader.onload = () => {
        setValue("chartUpload", chartFile);
        setValue("filePath", chartFile.name);

        setChartPreview(chartReader.result as string);
      };

      chartReader.onerror = (error) => {
        console.log("filereadingError: ", error);
      };

      chartReader.readAsDataURL(chartFile);
    } else {
      //clear the previousUpload
      setValue("chartUpload", null);
      setValue("filePath", "");
      //Hides Preview
      setChartPreview("");
    }
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // clear previous state
    setValue("chartAudioUpload", null);
    setValue("chartAudioFilePath", "");
    setAudioPreview("");
    setError("chartUpload", {});

    const audioFile = e.target.files?.[0];
    if (audioFile) {
      const audioReader = new FileReader();
      audioReader.onload = () => {
        setValue("chartAudioUpload", audioFile);
        setValue("chartAudioFilePath", audioFile.name);

        setAudioPreview(audioReader.result as string);
      };

      audioReader.readAsDataURL(audioFile);
    } else {
      setValue("chartAudioUpload", null);
      setValue("chartAudioFilePath", "");
      setAudioPreview("");
    }
  };

  const handleRemoveFile = () => {
    // Clear file input value and form state
    setValue("chartUpload", null);
    setValue("filePath", "");
    setChartPreview("");

    // Reset file input field (if needed)
    const inputElement = document.getElementById(
      "inputGroupFile01"
    ) as HTMLInputElement;
    if (inputElement) {
      inputElement.value = "";
    }
  };

  const handleRemoveAudioFile = () => {
    // Clear file input value and form state
    setValue("chartAudioUpload", null);
    setValue("chartAudioFilePath", "");
    setAudioPreview("");

    // Reset file input field (if needed)
    const inputElement = document.getElementById(
      "inputGroupFile02"
    ) as HTMLInputElement;
    if (inputElement) {
      inputElement.value = "";
    }
  };

  const onSubmit = async (data: ChartCreateModel) => {
    if (!isValid) {
      console.log("Cant proceed");
      return;
    }
    const formData = new FormData();

    formData.append(
      "chordId",
      data.chordId !== null ? data.chordId.toString() : ""
    );
    formData.append("fretPosition", data.fretPosition.toString());

    formData.append("positionDescription", data.positionDescription || "");
    if (data.chartUpload) {
      formData.append("filePath", data.chartUpload.name);
      formData.append("chartUpload", data.chartUpload);
    } else {
      formData.append("filePath", data.filePath as string);
      formData.append("chartUpload", "");
    }
    if (data.chartAudioUpload) {
      formData.append("chartAudioFilePath", data.chartAudioUpload.name);
      formData.append("chartAudioUpload", data.chartAudioUpload);
    } else {
      formData.append(
        "chartAudioFilePath",
        (data.chartAudioFilePath ?? "") as string
      );
      formData.append("chartAudioUpload", "");
    }
    console.log("Data is ready:", data);
    console.log("Form Data Entries:");
    for (let pair of formData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }
    const validateChart = ChartCreateSchema.safeParse(data);
    if (!validateChart.success) {
      console.error(
        "🚀 ~ onSubmit ~ validateChart.error:",
        validateChart.error
      );
    }

    try {
      let response;
      if (id) {
        const validatedId = idSchema.parse(id);
        console.log(validatedId);

        if (validatedId) {
          formData.append("id", validatedId.toString());
          response = await API.put(
            apiEndpoints.editChordChart(validatedId),
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          console.log("🚀 ~ onSubmit ~ response:", response);
        }
      } else {
        response = await API.post(apiEndpoints.createChordChart, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("🚀 ~ onSubmit ~ response:", response);
      }

      if (response?.status === 201) {
        exit("/admin/chordcharts", {
          state: {
            successMessage: `chord chart ${data.filePath} created successfully`,
          },
        });
      }

      if (response?.status === 200) {
        const fileName = data.filePath && data.filePath.split("_").pop();
        exit("/admin/chordcharts", {
          state: {
            successMessage: `chord chart ${fileName} edited successfully`,
          },
        });
      }
    } catch (error: any) {
      console.error("Error posting data:", error);

      if (error.response) {
        console.log(
          "🚀 ~ onSubmit ~ error response data:",
          error.response.data
        );
        setError("root", {
          message: `${error.response.data.message || error.message}`,
        });
      } else {
        setError("root", { message: error.message });
      }
    }
  };

  return (
    <div className={createPage.container}>
      <div className={createPage.innerContainer(theme)}>
        <h1 className={createPage.header}>{headerText} chart</h1>
        <div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="d-flex flex-column"
          >
            <div className={createPage.form}>
              <label htmlFor="chord" className={createPage.label}>
                <strong className="fs-5">Chord</strong>
              </label>
              <div className={createPage.inputContainer}>
                <div className="flex justify-between mb-2">
                  <select
                    className="w-full select select-bordered me-3"
                    {...register("chordId", {
                      setValueAs: (v) => parseInt(v),
                    })}
                  >
                    {chord ? (
                      <option value={chord.id}>{chord.chordName}</option>
                    ) : (
                      <option value="">Pick a Chord</option>
                    )}

                    {createdChord && (
                      <option value={createdChord.id}>
                        {createdChord.chordName}
                      </option>
                    )}

                    {chords &&
                      chords.map((chord, index) => (
                        <option key={index} value={chord.id}>
                          {chord.chordName}
                        </option>
                      ))}
                  </select>

                  <div className="relative">
                    <button
                      className="btn btn-info flex-fill "
                      onClick={() => setOpenCreateChord(true)}
                    >
                      Chord
                    </button>

                    <RiAddCircleFill className="absolute top-1/2 start-[-0.5rem] -translate-y-1/2 transform rounded-5" />
                  </div>
                </div>
                {errors.chordId && (
                  <p className={createPage.errorText}>
                    {errors.chordId.message}
                  </p>
                )}
              </div>
            </div>
            <div className={createPage.form}>
              <label htmlFor="fret" className={createPage.label}>
                <strong className="fs-5"> Fret</strong>
              </label>
              <div className={createPage.inputContainer}>
                <input
                  type="number"
                  className="input input-bordered w-full "
                  {...register("fretPosition", {
                    setValueAs: (v) => parseInt(v),
                  })}
                  min={1}
                  step={1}
                  max={24}
                />
                {errors.fretPosition && (
                  <p className={createPage.errorText}>
                    {errors.fretPosition.message}
                  </p>
                )}
              </div>
            </div>
            <div className={createPage.form}>
              <label htmlFor="file" className={createPage.label}>
                <strong className="fs-5">File</strong>{" "}
              </label>
              <div className={createPage.inputContainer}>
                <div className="w-full flex flex-col gap-4">
                  <input
                    type="file"
                    id="inputGroupFile01"
                    className="file-input file-input-bordered w-full "
                    accept="image/*"
                    onChange={handleChartUpload}
                  />
                  <ChartPreview
                    chartPreview={chartPreview}
                    handleRemoveFile={handleRemoveFile}
                  />
                  {errors.chartUpload && (
                    <p className={createPage.errorText}>
                      {errors.chartUpload.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className={createPage.form}>
              <label htmlFor="audio" className={createPage.label}>
                <strong className="fs-5">Audio</strong>
              </label>
              <div className={createPage.inputContainer}>
                <div className="flex flex-col gap-4">
                  <input
                    type="file"
                    id="inputGroupFile02"
                    className="file-input file-input-bordered w-full "
                    accept="audio/*"
                    onChange={handleAudioUpload}
                  />

                  <AudioPreview
                    handleRemoveAudioFile={handleRemoveAudioFile}
                    audioPreview={audioPreview}
                  />
                  {errors.chartAudioUpload && (
                    <p className={createPage.errorText}>
                      {errors.chartAudioUpload.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-2 mb-5 relative">
              <textarea
                id="floatingTextarea2"
                className={createPage.textareaFloat}
                style={{ height: "7rem" }}
                placeholder=" "
                {...register("positionDescription")}
              ></textarea>
              <label
                htmlFor="floatingTextarea2"
                className={createPage.labelFloat}
              >
                Notes
              </label>
            </div>

            <div className={createPage.buttonContainer}>
              <Link to="/admin/chordcharts" className={createPage.backButton}>
                Cancel
              </Link>
              <button
                type="submit"
                className={createPage.saveButton}
                disabled={isSubmitting}
              >
                {headerText}
              </button>
            </div>
            {errors.root && (
              <p className={createPage.errorText}>{errors.root.message}</p>
            )}
            {/* <pre>
              {JSON.stringify(
                watch(),
                (key, value) => {
                  if (value instanceof File) {
                    return value.type;
                  }
                  return value;
                },
                2
              )}
            </pre> */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChartCreate;
