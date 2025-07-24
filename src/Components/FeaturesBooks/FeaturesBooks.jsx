// import "./FeaturesBooks.css";
// import TitileTypeOne from "../../UI/TitileTypeOne/TitileTypeOne";
// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/pagination";
// import {  Pagination } from "swiper/modules";
// import { featuredBooksData } from "../../Data/Data";
// import { Swiper, SwiperSlide } from "swiper/react"; 
// import { Link } from "react-router-dom";
// import { BsArrowReturnRight } from "react-icons/bs";


//  const breakpoints = {
//   1024: {
//     slidesPerView: 4,
//     spaceBetween: 30,
//   },
//   768: {
//     slidesPerView: 3,
//     spaceBetween: 20,
//   },
//   480: {
//     slidesPerView: 2,
//     spaceBetween: 10,
//   },
//   0: {
//     slidesPerView: 1,
//     spaceBetween: 0,
//   },
// };



// export default function FeaturesBooks() {
//   return (
//     <section className='Featured'>
//       <div className="container feature-book-container"></div>
//       <TitileTypeOne TitleTop={"Some quality items"} Title={"Featured Books"} />
//       <Swiper
//         spaceBetween={50}
//         slidesPerView={4}
//         loop={true}
//         modules={[Pagination]}
//         pagination={{ el: ".swiper-pagination", clickable: true }}
//         breakpoints={breakpoints}

         
      
// >
//         {featuredBooksData.map(
//           ({ img, imgLlink, name, nameLink, writer }, index) => {
//             return (
//               <SwiperSlide key={index}>
//                 <div className="featurebook-box">
//                   <Link to={imgLlink} className="featuredbook">
//                     <img src={img} alt="" />
//                   </Link>

//                   <div className="featurebook-info">
//                     <Link to={nameLink}>
//                     <h4> {name}</h4>
//                     </Link>
//                     <div> <small>{writer}</small></div>
//                     {/* <h5><span>{price}</span></h5> */}
//                   </div>
//                 </div>
//               </SwiperSlide>
//             );
//           }
//         )}

//         <div className="feature-border container"></div>
//         <div className="swiper-pagination"></div>
//         <Link to='*' className="btn feature-btn">View all products<BsArrowReturnRight /></Link>

   

//       </Swiper>
//     </section>
//   );
// }


import "./FeaturesBooks.css";
import TitileTypeOne from "../../UI/TitileTypeOne/TitileTypeOne";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react"; 
import { Link } from "react-router-dom";
import { BsArrowReturnRight } from "react-icons/bs";
import { useEffect, useState } from "react";

const breakpoints = {
  1024: { slidesPerView: 5, spaceBetween: 15 },
  768: { slidesPerView: 3, spaceBetween: 20 },
  480: { slidesPerView: 2, spaceBetween: 10 },
  0: { slidesPerView: 1, spaceBetween: 0 },
};

export default function FeaturesBooks() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchFeaturedBooks = async () => {
      try {
        const res = await fetch(
          "https://booklify-h3e6cvgrdjd4gjaw.malaysiawest-01.azurewebsites.net/api/books/list?sortBy=%20totalviews&isAscending=false&pageNumber=1&pageSize=10"
        );
        const json = await res.json();
        const booksData = json?.data?.data || [];
        setBooks(booksData);
      } catch (error) {
        console.error("Error fetching featured books:", error);
      }
    };

    fetchFeaturedBooks();
  }, []);

  return (
    <section className='Featured'>
      <div className="container feature-book-container"></div>
      <TitileTypeOne TitleTop={"Some quality items"} Title={"Featured Books"} />

      <Swiper
        spaceBetween={50}
        slidesPerView={4}
        loop={true}
        modules={[Pagination]}
        pagination={{ el: ".swiper-pagination", clickable: true }}
        breakpoints={breakpoints}
      >
        {books.map((book, index) => {
          const {
            id,
            title,
            author,
            cover_image_url
          } = book;

          return (
            <SwiperSlide key={id || index}>
              <div className="featurebook-box">
                <Link to={`/books/${id}`} className="featuredbook">
                  <img src={cover_image_url} alt={title} />
                </Link>

                <div className="featurebook-info">
                  <Link to={`/book/${id}`}>
                    <h4>{title}</h4>
                  </Link>
                  <div><small>{author}</small></div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}

        <div className="feature-border container"></div>
        <div className="swiper-pagination"></div>
        <Link to="/books" className="btn feature-btn">
          Explore more books <BsArrowReturnRight />
        </Link>
      </Swiper>
    </section>
  );
}
