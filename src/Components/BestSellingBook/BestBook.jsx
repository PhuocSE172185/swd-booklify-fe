import "./BestBook.css";
import TitleTypeTwo from "../../UI/TitleTypeTwo/TitleTypeTwo";
import TreeShape from "../../assets/treeShape.png";
import { Link } from "react-router-dom";
import { BsArrowRight } from "react-icons/bs";

export default function BestBook({ book }) {
  if (!book) return null;

  const { id, title, author, description, cover_image_url } = book;

  return (
    <section className="BestBook">
      <div className="treeShape">
        <img src={TreeShape} alt="" />
      </div>

      <div className="container bestbook-container">
        <div className="best-book-left">
          <img src={cover_image_url} alt={title} />
        </div>
        <div className="best-book-right">
          <TitleTypeTwo Title={"Best Book in Day"} Classname="bestBookTitle" />
          <div><small>{author}</small></div>
          <h3>{title}</h3>
          <p>{description}</p>
          <Link to={`/books/${id}`} className="btn">
            <small>Read it now</small>
            <BsArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
}
