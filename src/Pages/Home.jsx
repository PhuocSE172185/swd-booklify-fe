import React, { useEffect, useState } from 'react';
import Header from '../Components/Header/Header';
import Brand from '../Components/Brand/Brands';
import FeaturesBooks from '../Components/FeaturesBooks/FeaturesBooks';
import BestBook from '../Components/BestSellingBook/BestBook';
// import PopularBook from '../Components/PopularBooks/PopularBook';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Home() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/books/list?sortBy=%20totalviews&isAscending=false&pageNumber=1&pageSize=10`, 
        );
        const json = await res.json();
        const booksData = json?.data?.data || [];
        setBooks(booksData);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, []);

  const bestBook = books.length > 0 ? books[0] : null;

  return (
    <>
      <Header />
      <Brand />
      <FeaturesBooks books={books} />
      <BestBook book={bestBook} />
      {/* <PopularBook /> */}
    </>
  );
}
