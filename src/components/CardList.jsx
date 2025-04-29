import React, { useState, useEffect } from 'react';
import Card    from './Card';
import Button  from './Button';
import Search  from './Search';

const ITEMS_PER_PAGE = 10;

const CardList = ({ data }) => {
  // full filtered list
  const [filtered, setFiltered] = useState(data);

  // pagination state
  const [offset, setOffset]     = useState(0);
  const [products, setProducts] = useState([]);

  // whenever `filtered` or `offset` changes, recalc current page
  useEffect(() => {
    setProducts(
      filtered.slice(offset, offset + ITEMS_PER_PAGE)
    );
  }, [filtered, offset]);

  // unified paging: direction is -1 (prev) or +1 (next)
  const changePage = (direction) => {
    const maxOffset = Math.max(
      Math.ceil(filtered.length / ITEMS_PER_PAGE) * ITEMS_PER_PAGE - ITEMS_PER_PAGE,
      0
    );
    let next = offset + direction * ITEMS_PER_PAGE;
    next = Math.max(0, Math.min(next, maxOffset));
    setOffset(next);
  };

  // filter by tags and reset to first page
  const filterTags = (term) => {
    const lower = term.trim().toLowerCase();
    const newList = data.filter(product =>
      product.tags.some(tag => tag.toLowerCase().includes(lower))
    );

    setFiltered(newList);
    setOffset(0);
  };

  return (
    <div className="cf pa3">
      {/* 1. Search bar */}
      <Search handleSearch={filterTags} />

      {/* 2. Cards */}
      <div className="flex flex-wrap justify-center">
        {products.map(p => (
          <Card key={p.id} {...p} />
        ))}
      </div>

      {/* 3. Pagination */}
      <div className="flex items-center justify-center pa4">
        <Button
          text="Previous"
          handleClick={() => changePage(-1)}
          disabled={offset === 0}
        />
        <Button
          text="Next"
          handleClick={() => changePage(1)}
          disabled={offset + ITEMS_PER_PAGE >= filtered.length}
        />
      </div>
    </div>
  );
};

export default CardList;