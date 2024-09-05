"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import PageSuccess from "./PageSuccess";
import {
  PageCreateModel,
  PageCreateSchema,
} from "../../../DataModels/PageModel";
import PageRequest from "../../../API/PageRequest";
import { Link, useNavigate } from "react-router-dom";
import { useThemeContext } from "../../../Contexts/ThemeContext";
import axios from "axios";

const PageCreate: React.FC = () => {
  const {
    register,
    watch,
    trigger,
    setError,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PageCreateModel>({
    resolver: zodResolver(PageCreateSchema),
    mode: "all",
  });

  const [openSuccess, setOpenSuccess] = useState(false);
  const { theme } = useThemeContext();
  const navigate = useNavigate();

  const handlePageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (errors.root) {
      setError("root", {});
    }
    setValue("title", e.target.value);
    trigger("title"); // allow realtime feedback
  };

  const onSubmit = async (data: PageCreateModel) => {
    try {
      const response = await PageRequest.createPage(data);

      console.log("🚀 ~ sendCategoryData ~ response:", response);

      if (response.status === 201) {
        setOpenSuccess(true);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const serverMessage = error.response.data;
        setError("root", { message: serverMessage });
      } else {
        setError("root", {
          message: `Category ${data.title} not created. Try Again!`,
        });
      }
    }
  };

  return (
    <div className="w-full h-full flex justify-center items-center relative bg-base-200 z-0">
      <div
        className={`${
          theme === "dark" ? "text-neutral-300" : "text-dark"
        } w-1/2 border bg-base-100 shadow-lg px-5 pt-3 pb-5 rounded-xl `}
      >
        <h1 className="text-2xl font-bold mt-4 mb-4">Create a Page</h1>
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4 flex justify-between">
              <label htmlFor="title" className="text-lg font-semibold required">
                Title
              </label>
              <div className="w-3/4">
                <input
                  type="text"
                  name="title"
                  className="input input-bordered w-full mb-1"
                  onChange={handlePageChange}
                />
                {errors.title && (
                  <p className="text-error text-sm">{errors.title.message}</p>
                )}
              </div>
            </div>

            <div className="mb-4 flex justify-between">
              <label
                htmlFor="content"
                className="text-lg font-semibold required"
              >
                Content
              </label>
              <div className="w-3/4">
                <input
                  type="text"
                  className="input input-bordered w-full mb-1"
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
              <Link to="/admin/pages">
                <button type="button" className="btn btn-error me-2">
                  Back
                </button>
              </Link>
              <button
                type="submit"
                className="btn btn-primary px-4"
                disabled={isSubmitting}
              >
                Save
              </button>
            </div>
            {errors.root && (
              <p className="text-error text-sm mb-2">{errors.root.message}</p>
            )}
          </form>
        </div>
      </div>
      {openSuccess && (
        <PageSuccess
          pageTitle={watch().title}
          setOpenSuccess={setOpenSuccess}
        />
      )}
    </div>
  );
};

export default PageCreate;
