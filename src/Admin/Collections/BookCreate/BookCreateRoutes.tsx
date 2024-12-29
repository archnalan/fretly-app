import { FormProvider, useForm } from "react-hook-form";
import { Route, Routes } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BookCreateSchema,
  SongBookCreateModel,
} from "../../../DataModels/SongBookModel";
import Book05Review from "./BookCreateSteps/Book05Review";
import Book01BasicInfo from "./BookCreateSteps/Book01BasicInfo";
import Book02DetailsInfo from "./BookCreateSteps/Book02DetailsInfo";
import Book03PubInfo from "./BookCreateSteps/Book03PubInfo";
import Book04AdditInfo from "./BookCreateSteps/Book04AdditInfo";
import { createPage } from "../../SharedClassNames/createPage";

const BookCreateRoutes: React.FC = () => {
  const methods = useForm<SongBookCreateModel>({
    mode: "onChange",
    resolver: zodResolver(BookCreateSchema),
  });

  return (
    <>
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(() => {})}
          className={createPage.multiformContainer}
        >
          <Routes>
            <Route path="step1" element={<Book01BasicInfo />} />
            <Route path="step1/:id" element={<Book01BasicInfo />} />
            <Route path="step2" element={<Book02DetailsInfo />} />
            <Route path="step3" element={<Book03PubInfo />} />
            <Route path="step4" element={<Book04AdditInfo />} />
            <Route path="step5" element={<Book05Review methods={methods} />} />
          </Routes>
        </form>
      </FormProvider>
    </>
  );
};

export default BookCreateRoutes;
