import { useState, useEffect } from 'react';

const usePagination = (items: any[], initialItemsPerPage: number) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);
  const [totalItems, setTotalItems] = useState(0);
  const [currentItems, setCurrentItems] = useState([]);
  const [itemsPerPageOptions, setItemsPerPageOptions] = useState<number[]>([]);

  const handleItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [itemsPerPage]);

  useEffect(() => {
    setTotalItems(items.length);
  }, [items]);

  useEffect(() => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (currentPage > totalPages) {
      setCurrentPage(totalPages > 0 ? totalPages : 1);
    }
  }, [totalItems, itemsPerPage, currentPage]);

  useEffect(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    setCurrentItems(items.slice(indexOfFirstItem, indexOfLastItem));
  }, [items, currentPage, itemsPerPage]);

  useEffect(() => {
    let options = [];
    if (totalItems >= 5) {
      options = Array.from(
        { length: Math.floor(totalItems / 5) },
        (_, i) => (i + 1) * 5
      );

      if (totalItems % 5 !== 0) {
        options.push(totalItems);
      }
    }
    setItemsPerPageOptions(options);
  }, [totalItems]);

  return {
    currentPage,
    setCurrentPage,
    itemsPerPage,
    handleItemsPerPageChange,
    currentItems,
    itemsPerPageOptions,
  };
};

export default usePagination;