import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PageModel, PageSchema } from "../../DataModels/PageModel";
import { idSchema } from "../../DataModels/ValidatedID";
import PageRequest from "../../API/PageRequest";
import { useThemeContext } from "../../Contexts/ThemeContext";
import classNames from "classnames";

const PageDetails: React.FC = () => {
  const [page, setPage] = useState<PageModel>({
    id: 0,
    title: "",
    slug: null,
    content: "",
    sorting: 0,
  });

  const { id } = useParams();
  const { theme } = useThemeContext();

  useEffect(() => {
    const getPage = async () => {
      try {
        const validatedId = idSchema.parse(id);

        const response = await PageRequest.fetchPageById(validatedId);

        const songResult = PageSchema.safeParse(response.data);
        if (songResult.success) {
          setPage(songResult.data);
        } else {
          console.error("🚀 ~ ValidationError:", songResult.error);
        }
      } catch (error) {
        console.error("🚀 ~ getPage ~ error:", error);
      }
    };
    getPage();
  }, []);

  const headerClass = classNames({
    "text-neutral-400": theme === "dark",
    "text-dartk": theme !== "dark",
  });

  const lineClass = classNames({
    "border-t-2 border-neutral-700": theme === "dark",
  });

  return (
    <div className="w-full h-full flex flex-col justify-start items-center bg-base-200 ">
      <div
        className={`${
          theme === "dark" ? "text-neutral-200" : "text-dark"
        } w-1/2 border bg-base-100 px-5 pt-3 pb-3 rounded-xl mt-[5rem] shadow-xl`}
      >
        <h1 className="text-3xl mb-5 mt-4">Page Details</h1>

        <div className="flex justify-between text-end mt-4">
          <strong className={headerClass}>Title</strong>
          <span>{page.title}</span>
        </div>
        <hr className={lineClass} />

        <div className="flex justify-between text-end mt-4">
          <strong className={headerClass}>Slug</strong>
          <span>{page.slug}</span>
        </div>
        <hr className={lineClass} />

        <div className="flex justify-between text-end mt-4">
          <strong className={headerClass}>Sorting</strong>
          <span>{page.sorting}</span>
        </div>
        <hr className={lineClass} />

        <div className="flex justify-between text-end mt-4">
          <strong className={headerClass}>Content</strong>
          <span>{page.content}</span>
        </div>
        <hr className={lineClass} />

        <div className="flex justify-end ext-end mb-3 mt-4">
          <Link to={"/admin/pages"} className="btn btn-error me-2 ">
            Back
          </Link>
          <Link to={`/admin/pages/edit/${id}`} className="btn btn-primary px-5">
            Edit
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PageDetails;
