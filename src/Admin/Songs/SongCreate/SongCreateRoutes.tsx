import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Routes, Route } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
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

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(() => {})}
        className={createPage.multiformContainer}
      >
        <Routes>
          <Route path="step1" element={<Song01BasicInfo />} />
          <Route path="step1/:id" element={<Song01BasicInfo />} />
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
