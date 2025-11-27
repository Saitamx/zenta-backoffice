import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { Book, BooksQuery, PagedResult, SortDirection, SortField } from "../types/book";
import { booksService } from "../services/booksService";
import { useDebounce } from "../hooks/useDebounce";

interface BooksContextValue {
  loading: boolean;
  error?: string;
  result: PagedResult<Book>;
  query: BooksQuery;
  setSearch: (q: string) => void;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setFilter: <K extends keyof BooksQuery["filters"]>(key: K, value: BooksQuery["filters"][K]) => void;
  addSort: (field: SortField) => void;
  removeSort: (field: keyof Book) => void;
  toggleSortDirection: (field: keyof Book) => void;
  metadata: { authors: string[]; publishers: string[]; genres: string[] };
  refresh: () => void;
}

const DEFAULT_QUERY: BooksQuery = {
  page: 1,
  pageSize: 10,
  search: "",
  filters: {
    genre: "Todos",
    publisher: "Todos",
    author: "Todos",
    available: "Todos",
  },
  sort: [{ field: "createdAt", direction: "desc" }],
};

const BooksContext = createContext<BooksContextValue | undefined>(undefined);

export const BooksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [result, setResult] = useState<PagedResult<Book>>({ data: [], page: 1, pageSize: 10, total: 0 });
  const [query, setQuery] = useState<BooksQuery>(DEFAULT_QUERY);
  const [metadata, setMetadata] = useState<{ authors: string[]; publishers: string[]; genres: string[] }>({
    authors: [],
    publishers: [],
    genres: [],
  });

  const debouncedSearch = useDebounce(query.search, 350);
  const abortRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async (q: BooksQuery) => {
    if (abortRef.current) {
      abortRef.current.abort();
    }
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    setError(undefined);
    try {
      const res = await booksService.fetchBooks(q, controller.signal);
      setResult(res);
    } catch (err) {
      if ((err as DOMException).name !== "AbortError") {
        setError((err as Error).message || "books.errorLoading");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Load metadata once
  useEffect(() => {
    let cancelled = false;
    booksService.loadMetadata().then((m) => {
      if (!cancelled) setMetadata(m);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Fetch whenever query changes (debounced by search)
  useEffect(() => {
    const effectiveQuery = { ...query, search: debouncedSearch };
    fetchData(effectiveQuery);
    // Cleanup abort when unmount
    return () => {
      if (abortRef.current) {
        abortRef.current.abort();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, query.page, query.pageSize, query.filters, query.sort, fetchData]);

  const setSearch = useCallback((q: string) => {
    setQuery((prev) => ({ ...prev, search: q, page: 1 }));
  }, []);

  const setPage = useCallback((page: number) => {
    setQuery((prev) => ({ ...prev, page }));
  }, []);

  const setPageSize = useCallback((size: number) => {
    setQuery((prev) => ({ ...prev, pageSize: size, page: 1 }));
  }, []);

  const setFilter = useCallback(
    <K extends keyof BooksQuery["filters"]>(key: K, value: BooksQuery["filters"][K]) => {
      setQuery((prev) => ({ ...prev, page: 1, filters: { ...prev.filters, [key]: value } }));
    },
    []
  );

  const addSort = useCallback((field: SortField) => {
    setQuery((prev) => ({ ...prev, sort: [...prev.sort, field], page: 1 }));
  }, []);

  const removeSort = useCallback((field: keyof Book) => {
    setQuery((prev) => ({ ...prev, sort: prev.sort.filter((s) => s.field !== field), page: 1 }));
  }, []);

  const toggleSortDirection = useCallback((field: keyof Book) => {
    setQuery((prev) => ({
      ...prev,
      sort: prev.sort.map((s) =>
        s.field === field ? { ...s, direction: (s.direction === "asc" ? "desc" : "asc") as SortDirection } : s
      ),
      page: 1,
    }));
  }, []);

  const refresh = useCallback(() => {
    fetchData({ ...query, search: debouncedSearch });
  }, [fetchData, query, debouncedSearch]);

  const value = useMemo<BooksContextValue>(
    () => ({
      loading,
      error,
      result,
      query,
      setSearch,
      setPage,
      setPageSize,
      setFilter,
      addSort,
      removeSort,
      toggleSortDirection,
      metadata,
      refresh,
    }),
    [
      loading,
      error,
      result,
      query,
      setSearch,
      setPage,
      setPageSize,
      setFilter,
      addSort,
      removeSort,
      toggleSortDirection,
      metadata,
      refresh,
    ]
  );

  return <BooksContext.Provider value={value}>{children}</BooksContext.Provider>;
};

export const useBooks = (): BooksContextValue => {
  const ctx = useContext(BooksContext);
  if (!ctx) throw new Error("useBooks must be used within BooksProvider");
  return ctx;
};


