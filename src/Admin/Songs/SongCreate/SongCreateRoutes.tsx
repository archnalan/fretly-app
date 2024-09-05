import React, { useState } from "react";
import axios from "axios";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Routes, Route } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import SongRequest from "../../../API/SongRequest";
import SongCreated from "./SongCreated";
import {
  SongCreateModel,
  SongCreateSchema,
} from "../../../DataModels/SongModel";
import Song01BasicInfo from "./SongCreateSteps/Song01BasicInfo";
import Song03InfoReview from "./SongCreateSteps/Song03InfoReview";
import Song02AdditInfo from "./SongCreateSteps/Song02AdditInfo";
import { createPage } from "../../SharedClassNames/createPage";

const SongCreateRoutes: React.FC = () => {
  const methods = useForm<SongCreateModel>({
    mode: "onChange",
    resolver: zodResolver(SongCreateSchema),
  });

  const [isSongCreated, setIsSongCreated] = useState(false);

  const onSubmit: SubmitHandler<SongCreateModel> = async (data) => {
    console.log("🚀 ~ onSubmit ~ data:", data);

    try {
      const response = await SongRequest.createSong(data);
      console.log(
        "🚀 ~ constonSubmit:SubmitHandler<HymnCreateModel>= ~ response:",
        response.status
      );
      if (response && response.status === 201) {
        setIsSongCreated(true);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        methods.setError("root", {
          message: error.response.data || "An Error occured at the server",
        });
      } else {
        methods.setError("root", {
          message: "An Unexpected Error occured. Please Try Again!",
        });
      }
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className={createPage.multiformContainer}
      >
        <Routes>
          <Route path="step1" element={<Song01BasicInfo />} />
          <Route path="step2" element={<Song02AdditInfo />} />
          <Route
            path="step3"
            element={
              <Song03InfoReview
                isSongCreated={isSongCreated}
                setIsSongCreated={setIsSongCreated}
              />
            }
          />
        </Routes>
      </form>
    </FormProvider>
  );
};

export default SongCreateRoutes;
