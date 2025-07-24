
import "./BestBook.css";
import TitleTypeTwo from "../../UI/TitleTypeTwo/TitleTypeTwo";
import TreeShape from "../../assets/treeShape.png";
import { sellingBooksData } from "../../Data/Data";
import { Link } from "react-router-dom";
import { BsArrowRight } from "react-icons/bs";

export default function BestBook() {
  return (
    <section className="BestBook">
      <div className="treeShape">
        <img src={TreeShape} alt="" />  
      </div>

      <div className="container bestbook-container">
        {sellingBooksData.map(
          ({ id, img, infoTitle, infoTitleTop, desc, shopbtnLink }) => (
            <div key={id} style={{ display: 'contents' }}>
              <div className="best-book-left">
                <img src={img} alt={infoTitle} />
              </div>
              <div className="best-book-right">
                <TitleTypeTwo Title={"Best Book in Day"} Classname="bestBookTitle" />
                <div><small>{infoTitleTop}</small></div>
                <h3>{infoTitle}</h3>
                <p>{desc}</p>
                {/* <h5><span>{price}</span></h5> */}
                <Link to={shopbtnLink} className="btn">
                  <small>Read it now</small>
                  <BsArrowRight/>
                </Link>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
}

