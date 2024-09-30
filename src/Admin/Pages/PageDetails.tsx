import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PageModel, PageSchema } from "../../DataModels/PageModel";
import { idSchema } from "../../DataModels/ValidatedID";
import PageRequest from "../../API/PageRequest";
import { useThemeContext } from "../../Contexts/ThemeContext";
import classNames from "classnames";
import { IoMdArrowRoundBack } from "react-icons/io";

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
  const navigate = useNavigate();

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
        <div className="flex items-center text-primary">
          <button onClick={() => navigate(-1)} className="text-xl me-2">
            <IoMdArrowRoundBack />
          </button>
          <h3 className="text-2xl">
            <strong>Page Details</strong>
          </h3>
        </div>

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
          <button onClick={() => navigate(-1)} className="btn btn-error me-2 ">
            Back
          </button>
          <Link to={`/admin/pages/edit/${id}`} className="btn btn-primary px-5">
            Edit
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PageDetails;
