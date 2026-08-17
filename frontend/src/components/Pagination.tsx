interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const getPages = () => {
    if (totalPages <= 7) {
      return Array.from(
        { length: totalPages },
        (_, index) => index + 1,
      );
    }

    if (page <= 4) {
      return [1, 2, 3, 4, 5, "...", totalPages];
    }

    if (page >= totalPages - 3) {
      return [
        1,
        "...",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      1,
      "...",
      page - 1,
      page,
      page + 1,
      "...",
      totalPages,
    ];
  };

  const pages = getPages();

  return (
    <nav
      className="pagination"
      aria-label="Paginación de Pokémon"
    >
      <button
        type="button"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        ←
      </button>

    {pages.map((pageNumber, index) =>
    pageNumber === "..." ? (
        <span
        key={`ellipsis-${index}`}
        className="pagination-ellipsis"
        >
        ...
        </span>
    ) : (
        <button
        key={pageNumber}
        type="button"
        className={
            pageNumber === page
            ? "active"
            : ""
        }
        onClick={() =>
            onPageChange(Number(pageNumber))
        }
        >
        {pageNumber}
        </button>
    ),
    )}

      <button
        type="button"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        →
      </button>
    </nav>
  );
}