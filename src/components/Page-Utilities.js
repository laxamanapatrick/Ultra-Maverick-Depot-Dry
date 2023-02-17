import { useState } from "react";
import {
  Pagination,
  PaginationContainer,
  PaginationNext,
  PaginationPage,
  PaginationPageGroup,
  PaginationPrevious,
  usePagination,
} from "@ajna/pagination";
import { Select } from "@chakra-ui/react";

export const usePageUtilities = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(true);
  const [pageTotal, setPageTotal] = useState(undefined);

  const outerLimit = 2;
  const innerLimit = 2;
  const {
    currentPage,
    setCurrentPage,
    pagesCount,
    pages,
    setPageSize,
    pageSize,
  } = usePagination({
    total: pageTotal,
    limits: {
      outer: outerLimit,
      inner: innerLimit,
    },
    initialState: { currentPage: 1, pageSize: 5 },
  });

  return {
    currentPage,
    setCurrentPage,
    pagesCount,
    pages,
    setPageSize,
    pageSize,
    pageTotal,
    setPageTotal,
    search,
    setSearch,
    status,
    setStatus,
  };
};

export const MyPagination = ({
  currentPage,
  setCurrentPage,
  setPageSize,
  pagesCount,
  pages,

}) => {
  return (
    <Pagination
      pagesCount={pagesCount}
      currentPage={currentPage}
      onPageChange={(data) => setCurrentPage(data)}
    >
      <PaginationContainer gap={1}>
        <PaginationPrevious
          bgColor="primary"
          color="myWhite"
          size="sm"
          _hover={{ color: "accent" }}
          _active={{ color: "accent" }}
        >{`<<`}</PaginationPrevious>
        <PaginationPageGroup>
          {pages.map((page) => (
            <PaginationPage
              size="sm"
              bgColor="primary"
              color="myWhite"
              px={2}
              key={`pagination_page_${page}`}
              page={page}
              _hover={{ color: "accent" }}
              _active={{ color: "accent" }}
            />
          ))}
        </PaginationPageGroup>
        <PaginationNext
          bgColor="primary"
          color="myWhite"
          size="sm"
          _hover={{ color: "accent" }}
          _active={{ color: "accent" }}
        >{`>>`}</PaginationNext>
        <Select
          onChange={(e) => setPageSize(Number(e.target.value))}
          w="auto"
          size="sm"
          _hover={{ color: "accent" }}
          _active={{ color: "accent" }}
          _focus={{ color: "accent" }}
        >
          <option value={Number(5)}>5</option>
          <option value={Number(10)}>10</option>
          <option value={Number(25)}>25</option>
          <option value={Number(50)}>50</option>
        </Select>
      </PaginationContainer>
    </Pagination>
  );
};
