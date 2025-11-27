export type BookGenre =
  | "Ficción"
  | "No Ficción"
  | "Ciencia"
  | "Historia"
  | "Tecnología"
  | "Arte";

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn?: string;
  description?: string;
  imageUrl?: string;
  genre: BookGenre;
  publisher: string;
  available: boolean;
  publishedYear: number;
  rating: number; // 0-5
  createdAt: string; // ISO
}

export interface BooksFilters {
  genre?: BookGenre | "Todos";
  publisher?: string | "Todos";
  author?: string | "Todos";
  available?: boolean | "Todos";
}

export type SortDirection = "asc" | "desc";

export interface SortField {
  field: keyof Book;
  direction: SortDirection;
}

export interface BooksQuery {
  page: number;
  pageSize: number;
  search: string;
  filters: BooksFilters;
  sort: SortField[];
}

export interface PagedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}


