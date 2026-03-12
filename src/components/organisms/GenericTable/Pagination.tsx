import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, FormEvent, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface PaginationProps {
  columns: readonly unknown[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  hasNextPage,
  hasPrevPage,
}: PaginationProps) => {
  const [pageInput, setPageInput] = useState(currentPage.toString());
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setPageInput(currentPage.toString());
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      const searchParams = new URLSearchParams(location.search);
      searchParams.set('page', page.toString());

      navigate(`${location.pathname}?${searchParams.toString()}`, {
        replace: true,
      });

      onPageChange(page);
    }
  };

  const handlePageSubmit = (e: FormEvent) => {
    e.preventDefault();
    const page = parseInt(pageInput, 10);
    if (page >= 1 && page <= totalPages) {
      handlePageChange(page);
    } else {
      setPageInput(currentPage.toString());
    }
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const pageParam = searchParams.get('page');
    if (pageParam) {
      const page = parseInt(pageParam, 10);
      if (!isNaN(page) && page >= 1 && page <= totalPages && page !== currentPage) {
        onPageChange(page);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex items-center justify-between border-t border-border-secondary px-2 pt-4">
      <Button
        variant="tertiaryGray"
        size="lg"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={!hasPrevPage}
        type="button"
        className="px-0"
      >
        <ArrowLeft className="size-4" />
        Previous
      </Button>

      <form onSubmit={handlePageSubmit} className="flex items-center gap-2 whitespace-nowrap">
        <span className="text-sm text-text-tertiary">Page</span>
        <Input
          type="number"
          min={1}
          max={totalPages}
          value={pageInput}
          onChange={e => setPageInput(e.target.value)}
          className="h-8 w-12"
          onBlur={() => {
            if (pageInput === '') setPageInput(currentPage.toString());
          }}
        />
        <span className="whitespace-nowrap text-sm text-text-tertiary">of {totalPages}</span>
      </form>

      <Button
        variant="tertiaryGray"
        size="lg"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={!hasNextPage}
        type="button"
        className="px-0"
      >
        Next
        <ArrowRight className="size-4" />
      </Button>
    </div>
  );
};
