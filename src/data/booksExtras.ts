import type { Book } from "../types/book";

// Mapeo de datos extra no presentes en el backend (género, editorial, disponibilidad, rating)
// Clave por ISBN o por título si no hay ISBN
export const BOOKS_EXTRA_BY_ISBN: Record<
  string,
  Pick<Book, "genre" | "publisher" | "available" | "rating">
> = {
  "9780132350884": { genre: "Tecnología", publisher: "Prentice Hall", available: true, rating: 5 },
  "9780201616224": { genre: "Tecnología", publisher: "Addison-Wesley", available: true, rating: 5 },
  "9780201485677": { genre: "Tecnología", publisher: "Addison-Wesley", available: true, rating: 5 }, // Refactoring 1st
  "9780134757599": { genre: "Tecnología", publisher: "Addison-Wesley", available: true, rating: 5 }, // Refactoring 2nd
  "9780201633610": { genre: "Tecnología", publisher: "Addison-Wesley", available: true, rating: 5 }, // Design Patterns
  "9780321125217": { genre: "Tecnología", publisher: "Addison-Wesley", available: true, rating: 5 }, // DDD
  "9780134494166": { genre: "Tecnología", publisher: "Pearson", available: true, rating: 4 }, // Clean Architecture
  "9780262033848": { genre: "Tecnología", publisher: "MIT Press", available: false, rating: 5 }, // CLRS
  "9781491904244": { genre: "Tecnología", publisher: "O'Reilly Media", available: true, rating: 4 }, // YDKJS Up & Going
  "9781491904152": { genre: "Tecnología", publisher: "O'Reilly Media", available: true, rating: 4 }, // YDKJS Scope & Closures
};

export const BOOKS_EXTRA_BY_TITLE: Record<
  string,
  Pick<Book, "genre" | "publisher" | "available" | "rating">
> = {
  "Clean Code": { genre: "Tecnología", publisher: "Prentice Hall", available: true, rating: 5 },
};


