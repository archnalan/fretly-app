import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  SongWithCategory,
  SongWithCategorySchema,
} from "../../DataModels/SongModel";
import { idSchema } from "../../DataModels/ValidatedID";
import SongRequest from "../../API/SongRequest";
import { detailsPage } from "../SharedClassNames/detailsPage";
import { useThemeContext } from "../../Contexts/ThemeContext";
import { IoMdArrowRoundBack } from "react-icons/io";

const SongDetails = () => {
  const [song, setSong] = useState<SongWithCategory>({
    id: 0,
    number: 0,
    title: "",
    categoryId: 0,
    categoryName: "",
    writtenBy: "",
    writtenDateRange: "",
    history: "",
  });

  const { id } = useParams();
  const { theme } = useThemeContext();
  const navigate = useNavigate();

  useEffect(() => {
    const getSong = async () => {
      const validatedId = idSchema.parse(id);

      const response = await SongRequest.fetchSpecificSong(validatedId);

      const songResult = SongWithCategorySchema.safeParse(response.data);
      if (!songResult.success) {
        console.error("🚀 ~ getSong ~ songResult.error:", songResult.error);
        return;
      }
      setSong(songResult.data);
    };
    getSong();
  }, []);

  return (
    <div className={detailsPage.container}>
      <div className={detailsPage.innerContainer(theme)}>
        <div className={detailsPage.revertContainer}>
          <button
            onClick={() => navigate(-1)}
            className={detailsPage.revertButton}
          >
            <IoMdArrowRoundBack />
          </button>
          <h2 className={detailsPage.header}>
            <span>Song Details</span>
          </h2>
        </div>

        <div className={detailsPage.detailRow}>
          <strong>Number</strong>
          <span>{song.number}</span>
        </div>
        <hr className={detailsPage.line(theme)} />

        <div className={detailsPage.detailRow}>
          <strong>Title</strong>
          <span>{song.title}</span>
        </div>
        <hr className={detailsPage.line(theme)} />

        <div className={detailsPage.detailRow}>
          <strong>Category</strong>
          <span>{song.categoryName}</span>
        </div>
        <hr className={detailsPage.line(theme)} />

        <div className={detailsPage.detailRow}>
          <strong>Author</strong>
          <span>{song.writtenBy}</span>
        </div>
        <hr className={detailsPage.line(theme)} />

        <div className={detailsPage.detailRow}>
          <strong>History</strong>
          <span>{song.history}</span>
        </div>
        <hr className={detailsPage.line(theme)} />

        <div className={detailsPage.buttonContainer}>
          <button
            onClick={() => navigate(-1)}
            className={detailsPage.backButton}
          >
            Back
          </button>
          <Link
            to={`/admin/songs/edit/${id}`}
            className={detailsPage.editButton}
          >
            Edit
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SongDetails;
