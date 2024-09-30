import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageSchema, PageModel } from "../../../DataModels/PageModel";
import PageRequest from "../../../API/PageRequest";
import PageEditSuccess from "./PageEditSuccess";
import { idSchema } from "../../../DataModels/ValidatedID";
import classNames from "classnames";
import { useThemeContext } from "../../../Contexts/ThemeContext";
import { IoMdArrowRoundBack } from "react-icons/io";

const PageEdit: React.FC = () => {
  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PageModel>({
    mode: "all",
    resolver: zodResolver(PageSchema),
  });

  const [pageData, setPageData] = useState<PageModel | undefined>(undefined);
  const [openEditSuccess, setOpenEditSuccess] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useThemeContext();

  useEffect(() => {
    const getCategory = async () => {
      try {
        const validatedId = idSchema.parse(id);
        const response = await PageRequest.fetchPageById(validatedId);

        const pageResult = PageSchema.safeParse(response.data);
        if (!pageResult.success) {
          console.error("🚀 ~ getSong ~ songResult.error:", pageResult.error);
          return;
        }
        setPageData(pageResult.data);
      } catch (error) {
        console.error("Error fetching song", error);
      }
    };
    getCategory();
  }, [id]);

  useEffect(() => {
    if (pageData) {
      /* Setting the default form values*/
      setValue("id", pageData.id);
      setValue("title", pageData.title);
      setValue("sorting", pageData.sorting);
      setValue("content", pageData.content);
      setValue("slug", pageData.slug);
    }
  }, [pageData]);

  const onSubmit = async (data: PageModel) => {
    try {
      const validatedId = idSchema.parse(id);
      const validatedCategory = PageSchema.safeParse(data);
      console.log("🚀 ~ onSubmit ~ validatedCategory:", validatedCategory);

      if (validatedCategory.success) {
        const response = await PageRequest.updatePage(
          validatedId,
          validatedCategory.data
        );
        console.log("🚀 ~ editSong ~  response:", response);
        if (response.status === 200) {
          setOpenEditSuccess(true);
        }
      }
    } catch (error) {
      console.error("Error Saving Song", error);
    }
  };

  const headerClass = classNames({
    "text-neutral-300": theme === "dark",
    "text-neutral-600": theme !== "dark",
  });

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div className="flex w-full h-full justify-center items-start bg-base-200 ">
      <div
        className={`${
          theme === "dark" ? "text-neutral-300" : "text-dark"
        } w-1/2 border bg-base-100 shadow-xl px-5 pt-3 pb-5 mt-[5rem] rounded-xl`}
      >
        <div className="flex items-center text-primary">
          <button onClick={() => navigate(-1)} className="text-xl me-2">
            <IoMdArrowRoundBack />
          </button>
          <h1 className="text-2xl font-semibold mt-5 mb-5">Edit a Page</h1>
        </div>
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4 flex justify-between">
              <label htmlFor="title" className="text-lg font-semibold">
                <strong className={headerClass}>Title</strong>
              </label>
              <div className="w-3/4">
                <input
                  type="text"
                  className="input input-bordered w-full"
                  {...register("title")}
                />
                {errors.title && (
                  <p className="text-error text-sm">{errors.title.message}</p>
                )}
              </div>
            </div>

            <div className="mb-3 flex justify-between">
              <label htmlFor="content" className="text-lg font-semibold">
                <strong className={headerClass}>Content</strong>
              </label>
              <div className="w-3/4">
                <input
                  type="text"
                  className="input input-bordered w-full"
                  placeholder="about page..."
                  {...register("content")}
                />
                {errors.content && (
                  <p className="text-error text-sm">{errors.content.message}</p>
                )}
              </div>
            </div>

            {/* <pre>{JSON.stringify(watch(), null, 2)}</pre> */}
            <div className="flex justify-end mb-5">
              <button className="btn btn-error me-2" onClick={handleBackClick}>
                Back
              </button>

              <button
                type="submit"
                className="btn btn-primary px-4"
                disabled={isSubmitting}
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
      {openEditSuccess && (
        <PageEditSuccess
          setOpenEditSuccess={setOpenEditSuccess}
          pageTitle={watch().title}
        />
      )}
    </div>
  );
};

export default PageEdit;
