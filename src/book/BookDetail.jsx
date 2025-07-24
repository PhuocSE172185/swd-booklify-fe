import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './BookDetail.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('vi-VN');
};
const formatRating = (rating) => {
  return rating > 0 ? rating.toFixed(1) : 'N/A';
};

const renderChapterItem = (chapter, level = 0, onClickChapter) => (
  <div key={chapter.id || chapter.title} style={{ paddingLeft: level * 16 }}>
    <div
      style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0', cursor: 'pointer', color: '#b23b1a' }}
      onClick={() => onClickChapter && onClickChapter(chapter)}
      className="bd-chapter-item"
    >
      <span role="img" aria-label="chapter">📄</span>
      <span style={{ fontSize: 14 }}>{chapter.title}</span>
    </div>
    {chapter.child_chapters && chapter.child_chapters.length > 0 && (
      <div style={{ marginLeft: 12 }}>
        {chapter.child_chapters.map(child => renderChapterItem(child, level + 1, onClickChapter))}
      </div>
    )}
  </div>
);

const BookDetail = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [showChapters, setShowChapters] = useState(true);
  const [loadingChapters, setLoadingChapters] = useState(false);
  const [categories, setCategories] = useState([]); // Thêm state lưu categories
  const navigate = useNavigate();

  // Fetch categories để đối chiếu tên thể loại
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/common/reference/book-categories`, { method: 'GET' });
        const res = await response.json();
        if (response.ok && Array.isArray(res.data)) {
          setCategories(res.data);
        }
      } catch {
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/books/${id}`, { method: 'GET' });
        const res = await response.json();
        if (response.ok) {
          setBook(res.data || res);
        }
      } catch {
        setBook(null);
      }
    };
    fetchBook();
  }, [id]);

  // Luôn fetch chapters khi mở detail nếu có chapters
  useEffect(() => {
    if (book && book.has_chapters) {
      fetchChapters();
      setShowChapters(true);
    }
    // eslint-disable-next-line
  }, [book]);

  const fetchChapters = async () => {
    setLoadingChapters(true);
    try {
      const response = await fetch(`${API_BASE_URL}/books/${id}/chapters`, { method: 'GET' });
      const res = await response.json();
      if (response.ok && Array.isArray(res.data)) {
        setChapters(res.data);
      } else if (response.ok && res.data && Array.isArray(res.data.data)) {
        setChapters(res.data.data);
      } else {
        setChapters([]);
      }
    } catch {
      setChapters([]);
    }
    setLoadingChapters(false);
  };

  const toggleChapters = () => {
    if (showChapters) {
      setShowChapters(false);
    } else {
      fetchChapters();
      setShowChapters(true);
    }
  };

  const handleRead = async () => {
    await fetch(`${API_BASE_URL}/books/${id}/increment-views`, { method: 'POST' });
    navigate(`/books/${id}/read`);
  };

  // Khi click vào chapter chuyển sang reader
  const handleClickChapter = (chapter) => {
    navigate(`/books/${id}/read?chapterId=${chapter.id}`);
  };

  if (!book) return <div>Loading...</div>;

  return (
    <div className="book-detail-modern">
      <div className="bd-header">
        <div className="bd-info-col">
          <h2 className="bd-title">{book.title}</h2>
          <div className="bd-badges">
            {book.is_premium && <span className="badge badge-premium">Trả phí</span>}
          </div>
          <div className="bd-meta">
            <div><span role="img" aria-label="author"></span> Tác giả: {book.author}</div>
            {book.publisher && <div><span role="img" aria-label="publisher"></span> Nhà xuất bản: {book.publisher}</div>}
            {book.isbn && <div><span role="img" aria-label="isbn"></span> ISBN: {book.isbn}</div>}
            <div><span role="img" aria-label="date"></span> Ngày xuất bản: {formatDate(book.published_date)}</div>
          </div>
        </div>
        <div className="bd-cover-col">
          {book.cover_image_url && (
            <img src={book.cover_image_url} alt={book.title} className="bd-cover" />
          )}
        </div>
      </div>
      {book.description && (
        <div className="bd-section">
          <h4 className="bd-section-title">Mô tả</h4>
          <p className="bd-desc">{book.description}</p>
        </div>
      )}
      <div className="bd-stats-grid">
        <div className="bd-stat">
          <span role="img" aria-label="star">⭐</span> <span className="bd-stat-value">{formatRating(book.average_rating)}</span>
          <div className="bd-stat-label">Đánh giá</div>
        </div>
        <div className="bd-stat">
          <span role="img" aria-label="users">👥</span> <span className="bd-stat-value">{book.total_ratings || 0}</span>
          <div className="bd-stat-label">Lượt đánh giá</div>
        </div>
        <div className="bd-stat">
          <span role="img" aria-label="views">👁</span> <span className="bd-stat-value">{book.total_views || 0}</span>
          <div className="bd-stat-label">Lượt xem</div>
        </div>
      </div>
      {book.tags && (
        <div className="bd-section">
          <h4 className="bd-section-title">Tags</h4>
          <div className="bd-tags">
            {book.tags.split(',').map((tag, idx) => (
              <span className="badge badge-outline" key={idx}>{tag.trim()}</span>
            ))}
          </div>
        </div>
      )}
      {/* Hiển thị thể loại */}
      {book && categories.length > 0 && (
        <div className="bd-meta-category">
          <span className="bd-tech-label">Thể loại:</span> {
            // Nếu book có categoryId hoặc categoryIds
            book.category_id ?
              (categories.find(c => c.id === book.category_id)?.name || book.category_id)
            : book.categoryIds && Array.isArray(book.categoryIds) ?
              book.categoryIds.map(cid => categories.find(c => c.id === cid)?.name || cid).join(', ')
            : book.category && book.category.name ?
              book.category.name
            : book.categories && Array.isArray(book.categories) ?
              book.categories.map(c => c.name || c).join(', ')
            : 'Không xác định'
          }
        </div>
      )}
      <div className="bd-section">
        <div className="bd-chapter-header">
          <h4 className="bd-section-title">Chapters</h4>
          {book.has_chapters && chapters.length > 0 && (
            <button className="bd-btn" onClick={toggleChapters} disabled={loadingChapters}>
              {loadingChapters ? 'Đang tải...' : showChapters ? 'Ẩn chapters' : 'Hiển thị chapters'}
            </button>
          )}
        </div>
        {!book.has_chapters ? (
          <p className="bd-desc">Sách này chưa có chapters.</p>
        ) : showChapters && chapters.length > 0 ? (
          <div className="bd-chapter-list-scroll">
            {chapters.map(chap => renderChapterItem(chap, 0, handleClickChapter))}
          </div>
        ) : showChapters && !loadingChapters && chapters.length === 0 ? (
          <p className="bd-desc">Không có chapters nào.</p>
        ) : null}
      </div>
      <div style={{ margin: '32px 0 0 0', textAlign: 'center' }}>
        <button className="bd-btn-read" onClick={handleRead}>Đọc sách</button>
      </div>
    </div>
  );
};

export default BookDetail;