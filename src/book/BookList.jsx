import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/apiService';
import './BookList.css';
import SidebarFilter from './SidebarFilter';
import SubscriptionStatus from '../Components/Subscription/SubscriptionStatus';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10); // Có thể cho phép thay đổi nếu muốn
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState(() => {
    try {
      const saved = localStorage.getItem('bookListFilters');
      return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
  });
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  // Lấy danh sách categories từ API
  useEffect(() => {
    const fetchCategories = async () => {
      const res = await apiService.makeRequest('/common/reference/book-categories', { method: 'GET' });
      console.log('Book categories API response:', res); // Thêm log để kiểm tra dữ liệu trả về
      if (res.result === 'success' && Array.isArray(res.data.data)) {
        setCategories(res.data.data);
      }
    };
    fetchCategories();
  }, []);

  // Xây dựng query string từ filters
  const buildQuery = useCallback(() => {
    const params = [];
    if (filters.search) params.push(`search=${encodeURIComponent(filters.search)}`);
    if (filters.categoryId && filters.categoryId.length > 0) {
      params.push(...filters.categoryId.map(cid => `categoryId=${encodeURIComponent(cid)}`));
    }
    if (filters.minRating) params.push(`minRating=${filters.minRating}`);
    if (filters.isPremium !== undefined) params.push(`isPremium=${filters.isPremium}`);
    if (filters.sortBy) params.push(`sortBy=${filters.sortBy}`);
    if (filters.isAscending !== undefined) params.push(`isAscending=${filters.isAscending}`);
    params.push(`pageNumber=${pageNumber}`);
    params.push(`pageSize=${pageSize}`);
    return params.length ? '?' + params.join('&') : '';
  }, [filters, pageNumber, pageSize]);

  useEffect(() => {
    const fetchBooks = async () => {
      const query = buildQuery();
      const res = await apiService.makeRequest(`/books/list${query}`, { method: 'GET' });
      console.log('Book list API response:', res, 'Query:', query);
      if (res.result === 'success') {
        if (res.data && res.data.data && Array.isArray(res.data.data.data)) {
          setBooks(res.data.data.data);
          setTotalCount(res.data.data.totalCount || 0);
          // Log toàn bộ ID sách
          console.log('Book IDs:', res.data.data.data.map(book => book.id));
        } else {
          setBooks([]);
          setTotalCount(0);
        }
      } else {
        setBooks([]);
        setTotalCount(0);
      }
    };
    fetchBooks();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pageNumber, pageSize, filters, buildQuery]);

  const handleDetail = (id) => {
    console.log('Clicked book ID:', id);
    navigate(`/books/${id}`);
  };

  // Khi thay đổi filter, reset pageNumber về 1
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPageNumber(1);
    try {
      localStorage.setItem('bookListFilters', JSON.stringify(newFilters));
    } catch { /* ignore */ }
  };

  // Tính tổng số trang
  const totalPages = Math.ceil(totalCount / pageSize);

  // Tạo mảng các trang để hiển thị (tối đa 5 chấm, có ... nếu nhiều trang)
  let pageIndicators = [];
  if (totalPages <= 5) {
    pageIndicators = Array.from({ length: totalPages }, (_, i) => i + 1);
  } else {
    if (pageNumber <= 3) {
      pageIndicators = [1, 2, 3, 4, '...', totalPages];
    } else if (pageNumber >= totalPages - 2) {
      pageIndicators = [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    } else {
      pageIndicators = [1, '...', pageNumber - 1, pageNumber, pageNumber + 1, '...', totalPages];
    }
  }

  const handlePageClick = (num) => {
    if (typeof num === 'number' && num !== pageNumber) setPageNumber(num);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 24 }}>
      <SidebarFilter
        categories={Array.isArray(categories) ? categories : []}
        onFilterChange={handleFilterChange}
        initialFilters={filters}
      />
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2>Books List</h2>
          <SubscriptionStatus />
        </div>
        <div className="book-list">
          {Array.isArray(books) && books.length > 0 ? books.map(book => {
            console.log('Book ID:', book.id); // Thêm dòng này
            return (
              <div className="book-card" key={book.id}>
                <img src={book.cover_image_url} alt={book.title} />
                <h3>{book.title}</h3>
                <div className="author">{book.author}</div>
                <div className="rating">⭐ {book.average_rating} ({book.total_ratings})</div>
                <div className="views">👁 {book.total_views}</div>
                <button className="btn" onClick={() => handleDetail(book.id)}>More Details</button>
              </div>
            );
          }) : <div>Không có sách nào.</div>}
        </div>
        <div className="pagination-indicator" style={{ marginTop: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18 }}>
          {pageIndicators.map((num, idx) =>
            num === '...'
              ? <span key={idx} style={{ width: 16, textAlign: 'center', color: '#bbb', fontSize: 22 }}>...</span>
              : <span
                  key={num}
                  onClick={() => handlePageClick(num)}
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    border: num === pageNumber ? '2px solid #b23b1a' : 'none',
                    background: num === pageNumber ? 'rgba(178,59,26,0.08)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: num === pageNumber ? 'default' : 'pointer',
                    margin: '0 2px',
                    transition: 'border 0.2s',
                  }}
                >
                  <span style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: num === pageNumber ? '#b23b1a' : '#ccc',
                    display: 'inline-block',
                  }} />
                </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookList;