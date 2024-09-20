import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import BookRequest from "../../API/BookRequest";
import { format } from "date-fns";
import { idSchema } from "../../DataModels/ValidatedID";
import { SongBookModel, SongBookSchema } from "../../DataModels/SongBookModel";
import { detailsPage } from "../SharedClassNames/detailsPage";
import { useThemeContext } from "../../Contexts/ThemeContext";
import { IoMdArrowRoundBack } from "react-icons/io";

const BookDetails: React.FC = () => {
  const [book, setBook] = useState<SongBookModel>({
    id: 0,
    isbn: "",
    title: "",
    publisher: "",
    publicationDate: "",
    description: "",
    language: "",
    addedTime: "",
  });

  const { id } = useParams();
  const { theme } = useThemeContext();
  const navigate = useNavigate();

  useEffect(() => {
    const getSong = async () => {
      const validatedId = idSchema.parse(id);

      const response = await BookRequest.fetchSpecificSongBook(validatedId);

      const songResult = SongBookSchema.safeParse(response.data);
      if (!songResult.success) {
        console.error(
          "🚀 ~ getSong ~ songResult.error:",
          songResult.error.issues
        );
        return;
      }

      setBook(songResult.data);
    };
    getSong();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Invalid Date"; // Handle invalid date
    }
    return format(date, "dd MMMM yyyy");
  };

  return (
    <div className={detailsPage.container}>
      <div className={detailsPage.innerContainer(theme)}>
        <div className="flex items-center">
          <button
            onClick={() => navigate(-1)}
            className={detailsPage.backHeaderButton}
          >
            <IoMdArrowRoundBack />
          </button>
          <h3 className={detailsPage.header}>
            <strong>Collection Details</strong>
          </h3>
        </div>
        <div className={detailsPage.detailRow}>
          <strong>Title</strong>
          <span>{book.title}</span>
        </div>
        <hr className={detailsPage.line(theme)} />

        <div className={detailsPage.detailRow}>
          <strong>Edition</strong>
          <span>{book.edition}</span>
        </div>
        <hr className={detailsPage.line(theme)} />

        <div className={detailsPage.detailRow}>
          <strong>ISBN</strong>
          <span>{book.isbn}</span>
        </div>
        <hr className={detailsPage.line(theme)} />

        <div className={detailsPage.detailRow}>
          <strong>Language</strong>
          <span>{book.language}</span>
        </div>
        <hr className={detailsPage.line(theme)} />

        <div className={detailsPage.detailRow}>
          <strong>Publisher</strong>
          <span>{book.publisher}</span>
        </div>
        <hr className={detailsPage.line(theme)} />

        <div className={detailsPage.detailRow}>
          <strong>Publishing Date</strong>
          <span>{formatDate(book.publicationDate)}</span>
        </div>
        <hr className={detailsPage.line(theme)} />

        <div className={detailsPage.detailRow}>
          <strong>Author</strong>
          <span>{book.author}</span>
        </div>
        <hr className={detailsPage.line(theme)} />

        <div className={detailsPage.detailRow}>
          <strong>Description</strong>
          <span>{book.description}</span>
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
            to={`/admin/songbooks/edit/${id}`}
            className={detailsPage.editButton}
          >
            Edit
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
