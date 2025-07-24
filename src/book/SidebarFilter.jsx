import React, { useEffect, useState } from 'react';
import './SidebarFilter.css';

const ratingOptions = [
  { value: 4.5, label: '4.5 & up' },
  { value: 4.0, label: '4.0 & up' },
  { value: 3.5, label: '3.5 & up' },
  { value: 3.0, label: '3.0 & up' },
];

const sortByOptions = [
  { value: '', label: 'Default' },
  { value: 'title', label: 'Title' },
  { value: 'author', label: 'Author' },
  { value: 'createdat', label: 'Created Date' },
  { value: 'rating', label: 'Rating' },
  { value: 'totalratings', label: 'Total Ratings' },
  { value: 'totalviews', label: 'Views' },
];

const SidebarFilter = ({ categories, onFilterChange, initialFilters = {} }) => {
  const [search, setSearch] = useState(initialFilters.search || '');
  const [selectedCategories, setSelectedCategories] = useState(initialFilters.categoryId || []);
  const [rating, setRating] = useState(initialFilters.minRating || '');
  const [isPremium, setIsPremium] = useState(
    initialFilters.isPremium === undefined ? '' : String(initialFilters.isPremium)
  );
  const [sortBy, setSortBy] = useState(initialFilters.sortBy || '');
  const [isAscending, setIsAscending] = useState(
    initialFilters.isAscending === undefined
      ? 'false'
      : (initialFilters.isAscending ? 'true' : 'false')
  );
  // Nếu initialFilters thay đổi (ví dụ khi user logout), đồng bộ lại state
  useEffect(() => {
    setSearch(initialFilters.search || '');
    setSelectedCategories(initialFilters.categoryId || []);
    setRating(initialFilters.minRating || '');
    setIsPremium(initialFilters.isPremium === undefined ? '' : String(initialFilters.isPremium));
    setSortBy(initialFilters.sortBy || '');
    setIsAscending(initialFilters.isAscending === undefined ? 'false' : (initialFilters.isAscending ? 'true' : 'false'));
    // chỉ chạy 1 lần khi mount
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    onFilterChange({
      search: search.trim() || undefined,
      categoryId: selectedCategories,
      minRating: rating,
      isPremium: isPremium === '' ? undefined : isPremium === 'true',
      sortBy: sortBy || undefined,
      // Đảo ngược logic để khớp với API backend
      isAscending: !(isAscending === 'true'),
    });
    // eslint-disable-next-line
  }, [search, selectedCategories, rating, isPremium, sortBy, isAscending]);

  return (
    <div className="sidebar-filter-modern">
      <div className="sidebar-filter-section">
        <input
          className="dropdown-filter-search"
          type="text"
          placeholder="Search books, author, publisher..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <div className="sidebar-filter-section">
        <div className="dropdown-filter-label">Category</div>
        <div className="dropdown-filter-list">
          {categories.length === 0 ? (
            <div style={{ color: '#b23b1a', fontStyle: 'italic', padding: '4px 0' }}>
              No categories found.
            </div>
          ) : (
            categories.map(cat => (
              <label key={cat.id} className="dropdown-filter-checkbox">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat.id)}
                  onChange={() => {
                    setSelectedCategories(selectedCategories.includes(cat.id)
                      ? selectedCategories.filter(c => c !== cat.id)
                      : [...selectedCategories, cat.id]);
                  }}
                />
                {cat.name}
              </label>
            ))
          )}
        </div>
      </div>
      <div className="sidebar-filter-section">
        <div className="dropdown-filter-label">Rating</div>
        <div className="dropdown-filter-list">
          {ratingOptions.map(opt => (
            <label key={opt.value} className="dropdown-filter-radio">
              <input
                type="radio"
                name="rating"
                value={opt.value}
                checked={String(rating) === String(opt.value)}
                onChange={() => setRating(opt.value)}
              />
              <span style={{ color: '#f5c518', marginRight: 4 }}>★</span>{opt.label}
            </label>
          ))}
          <label className="dropdown-filter-radio">
            <input type="radio" name="rating" value="" checked={rating === ''} onChange={() => setRating('')} />
            Any
          </label>
        </div>
      </div>
      <div className="sidebar-filter-section">
        <div className="dropdown-filter-label">Type</div>
        <div className="dropdown-filter-list">
          <label className="dropdown-filter-radio">
            <input type="radio" name="isPremium" value="" checked={isPremium === ''} onChange={() => setIsPremium('')} />
            Any
          </label>
          <label className="dropdown-filter-radio">
            <input type="radio" name="isPremium" value="true" checked={isPremium === 'true'} onChange={() => setIsPremium('true')} />
            Premium
          </label>
          <label className="dropdown-filter-radio">
            <input type="radio" name="isPremium" value="false" checked={isPremium === 'false'} onChange={() => setIsPremium('false')} />
            Free
          </label>
        </div>
      </div>
      <div className="sidebar-filter-section">
        <div className="dropdown-filter-label">Sort by</div>
        <div className="dropdown-filter-list">
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="dropdown-filter-select">
            {sortByOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <label className="dropdown-filter-radio">
            <input type="radio" name="isAscending" value="true" checked={isAscending === 'true'} onChange={() => setIsAscending('true')} />
            Ascending
          </label>
          <label className="dropdown-filter-radio">
            <input type="radio" name="isAscending" value="false" checked={isAscending === 'false'} onChange={() => setIsAscending('false')} />
            Descending
          </label>
        </div>
      </div>
    </div>
  );
};

export default SidebarFilter;