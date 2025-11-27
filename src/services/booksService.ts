import type { Book, BooksQuery, PagedResult, SortField } from "../types/book";
import { API_BASE_URL } from "../config";
import { BOOKS_EXTRA_BY_ISBN, BOOKS_EXTRA_BY_TITLE } from "../data/booksExtras";

type BackendBook = {
  id: string;
  title: string;
  author: string;
  publishedYear?: number;
  isbn?: string;
  description?: string;
  imageUrl?: string;
  available?: boolean;
  createdAt: string;
};

function getToken(): string | undefined {
  try {
    const raw = localStorage.getItem("zenta_auth_state");
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as { token?: string };
    return parsed.token;
  } catch {
    return undefined;
  }
}

function augmentBook(b: BackendBook): Book {
  const extra =
    (b.isbn && BOOKS_EXTRA_BY_ISBN[b.isbn]) ||
    BOOKS_EXTRA_BY_TITLE[b.title] || {
      genre: "Tecnología",
      publisher: "Editorial",
      available: true,
      rating: 4,
    };
  return {
    id: b.id,
    title: b.title,
    author: b.author,
    isbn: b.isbn,
    description: b.description,
    imageUrl: b.imageUrl,
    genre: extra.genre,
    publisher: extra.publisher,
    available: typeof b.available === "boolean" ? b.available : extra.available,
    publishedYear: b.publishedYear ?? 0,
    rating: extra.rating,
    createdAt: b.createdAt,
  };
}

// server-side search now

function applyFilters(data: Book[], query: BooksQuery): Book[] {
  const { filters } = query;
  return data.filter((b) => {
    const byGenre = !filters.genre || filters.genre === "Todos" || b.genre === filters.genre;
    const byPublisher =
      !filters.publisher || filters.publisher === "Todos" || b.publisher === filters.publisher;
    const byAuthor = !filters.author || filters.author === "Todos" || b.author === filters.author;
    const byAvailable =
      !filters.available || filters.available === "Todos" || b.available === filters.available;
    return byGenre && byPublisher && byAuthor && byAvailable;
  });
}

function compareBy(a: Book, b: Book, field: SortField): number {
  const { direction } = field;
  const fa = a[field.field] as unknown as string | number | boolean;
  const fb = b[field.field] as unknown as string | number | boolean;
  if (fa === fb) return 0;
  const order = fa > fb ? 1 : -1;
  return direction === "asc" ? order : -order;
}

function applySort(data: Book[], sort: SortField[]): Book[] {
  if (!sort.length) return data;
  const copy = [...data];
  copy.sort((a, b) => {
    for (const s of sort) {
      const c = compareBy(a, b, s);
      if (c !== 0) return c;
    }
    return 0;
  });
  return copy;
}

// server-side pagination now

export const booksService = {
  async getBook(id: string, signal?: AbortSignal): Promise<Book> {
    const token = getToken();
    const res = await fetch(`${API_BASE_URL}/books/${id}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      signal,
    });
    if (!res.ok) {
      const msg = await res.text();
      throw new Error(msg || "Error obteniendo libro");
    }
    const raw = await res.json();
    const backend: BackendBook = raw.data ? (raw.data as BackendBook) : (raw as BackendBook);
    return augmentBook(backend);
  },

  async createBook(input: { title: string; author: string; publishedYear?: number; isbn?: string; description?: string; imageUrl?: string; available?: boolean }): Promise<void> {
    const token = getToken();
    const res = await fetch(`${API_BASE_URL}/books`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(input),
    });
    if (!res.ok) {
      const msg = await res.text();
      throw new Error(msg || "Error creando libro");
    }
  },

  async updateBook(id: string, input: { title?: string; author?: string; publishedYear?: number; isbn?: string; description?: string; available?: boolean; imageUrl?: string }): Promise<void> {
    const token = getToken();
    const res = await fetch(`${API_BASE_URL}/books/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(input),
    });
    if (!res.ok) {
      const msg = await res.text();
      throw new Error(msg || "Error actualizando libro");
    }
  },
  async fetchBooks(query: BooksQuery, signal?: AbortSignal): Promise<PagedResult<Book>> {
    const token = getToken();
    // Build query params for server-side pagination, search and sort
    const params = new URLSearchParams();
    params.set("page", String(query.page));
    params.set("pageSize", String(query.pageSize));
    if (query.search?.trim()) params.set("search", query.search.trim());
    // server filters
    if (query.filters.author && query.filters.author !== "Todos") params.set("author", String(query.filters.author));
    if (query.filters.publisher && query.filters.publisher !== "Todos") params.set("publisher", String(query.filters.publisher));
    if (typeof query.filters.available === "boolean") params.set("available", String(query.filters.available));
    // map multi-sort to CSV field:dir, only allow fields that backend supports
    const allowedServerFields = new Set<keyof Book>(["title", "author", "publishedYear", "createdAt"]);
    const serverSort = query.sort
      .filter((s) => allowedServerFields.has(s.field))
      .map((s) => `${String(s.field)}:${s.direction}`)
      .join(",");
    if (serverSort) params.set("sort", serverSort);

    const res = await fetch(`${API_BASE_URL}/books?${params.toString()}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      signal,
    });
    if (!res.ok) {
      // Friendly error key for UI
      throw new Error("books.errorLoading");
    }
    const raw = await res.json();
    const payload: { data: BackendBook[]; total: number; page: number; pageSize: number } = Array.isArray(raw)
      ? { data: raw as BackendBook[], total: (raw as BackendBook[]).length, page: query.page, pageSize: query.pageSize }
      : (raw as { data: BackendBook[]; total: number; page: number; pageSize: number });
    const augmented = (payload.data || []).map(augmentBook);

    // apply client-side filters that the backend doesn't know (genre/publisher/available)
    const filtered = applyFilters(augmented, query);
    // for unsupported sort fields (e.g., rating), apply client-side AFTER server sort
    const unsupportedSorts = query.sort.filter((s) => !allowedServerFields.has(s.field));
    const finalSorted = unsupportedSorts.length ? applySort(filtered, unsupportedSorts) : filtered;

    // We keep server-provided total to preserve correct pagination
    return { data: finalSorted, total: payload.total, page: payload.page, pageSize: payload.pageSize };
  },

  async loadMetadata(): Promise<{
    authors: string[];
    publishers: string[];
    genres: string[];
  }> {
    const token = getToken();
    // Load a sample page to derive metadata; backend pagination is fine here
    const res = await fetch(`${API_BASE_URL}/books?page=1&pageSize=200`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (!res.ok) {
      // Friendly error key for UI
      throw new Error("books.errorLoading");
    }
    const raw = await res.json();
    const payload: { data: BackendBook[]; total: number; page: number; pageSize: number } = Array.isArray(raw)
      ? { data: raw as BackendBook[], total: (raw as BackendBook[]).length, page: 1, pageSize: (raw as BackendBook[]).length }
      : (raw as { data: BackendBook[]; total: number; page: number; pageSize: number });
    const augmented = (payload.data || []).map(augmentBook);
    const authors = Array.from(new Set(augmented.map((b) => b.author))).sort();
    const publishers = Array.from(new Set(augmented.map((b) => b.publisher))).sort();
    const genres = Array.from(new Set(augmented.map((b) => b.genre))).sort();
    return { authors, publishers, genres };
  },

  async exportCsv(query: BooksQuery, signal?: AbortSignal): Promise<void> {
    const token = getToken();
    const params = new URLSearchParams();
    if (query.search?.trim()) params.set("search", query.search.trim());
    const allowedServerFields = new Set<keyof Book>(["title", "author", "publishedYear", "createdAt"]);
    const serverSort = query.sort
      .filter((s) => allowedServerFields.has(s.field))
      .map((s) => `${String(s.field)}:${s.direction}`)
      .join(",");
    if (serverSort) params.set("sort", serverSort);

    const res = await fetch(`${API_BASE_URL}/books/export?${params.toString()}`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      signal,
    });
    if (!res.ok) throw new Error("books.errorLoading");
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "books.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  },
};


