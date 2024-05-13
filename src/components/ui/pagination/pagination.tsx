import React from 'react';
import { Select, MenuItem } from "@mui/material";
import { Button } from "@/components/ui/button";
import T from "@/components/translations/translation";

interface PaginationProps {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  items: any[];
  itemsPerPage: number;
  handleItemsPerPageChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  itemsPerPageOptions: number[];
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  setCurrentPage,
  items,
  itemsPerPage,
  handleItemsPerPageChange,
  itemsPerPageOptions,
}) => {
  return (
    <>
      <div className="flex flex-col flex-wrap justify-center">
        <div className="w-1/3 m-auto pt-4 flex flex-row gap-x-6 items-center justify-center">
          <Button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            variant="delete"
            className="w-full inline-block"
          >
            <T tkey="pagination.first" />
          </Button>
          <Button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-full inline-block"
          >
            <T tkey="pagination.prev" />
          </Button>
          <Button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === Math.ceil(items.length / itemsPerPage)}
            className="w-full inline-block"
          >
            <T tkey="pagination.next" />
          </Button>
          <Button
            onClick={() => setCurrentPage(Math.ceil(items.length / itemsPerPage))}
            disabled={currentPage === Math.ceil(items.length / itemsPerPage)}
            variant="delete"
            className="w-full inline-block"
          >
            <T tkey="pagination.last" />
          </Button>
        </div>
      </div>
      {items.length > 5 && (
        <div className="flex flex-row justify-center items-baseline gap-x-2 mt-4">
          <p><T tkey="pagination.per-page" /> </p>
          <div>
            <Select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              sx={{
                margin: "auto",
                fontFamily: "inherit",
                fontWeight: "bold",
                backgroundColor: "white",
              }}
            >
              {itemsPerPageOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </div>
        </div>
      )}
    </>
  );
};

export default Pagination;