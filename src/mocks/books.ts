import type { Book, BookGenre } from "../types/book";

const genres: BookGenre[] = ["Ficción", "No Ficción", "Ciencia", "Historia", "Tecnología", "Arte"];
const publishers = ["Andes Press", "Pacífico Editorial", "Sur Editores", "Norte Books", "Zenta Publishing"];
const authors = [
  "Isabel M.",
  "Roberto C.",
  "Daniela P.",
  "Matías A.",
  "Carla V.",
  "Felipe S.",
  "Antonia R.",
  "Vicente T.",
];

function random<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const BOOKS_DATA: Book[] = Array.from({ length: 180 }).map((_, i) => {
  const title = `Libro ${i + 1}`;
  const author = random(authors);
  const genre = random(genres);
  const publisher = random(publishers);
  const available = Math.random() > 0.35;
  const publishedYear = randomInt(1995, 2025);
  const rating = randomInt(1, 5);

  const created = new Date();
  created.setDate(created.getDate() - randomInt(0, 720));

  return {
    id: `b-${i + 1}`,
    title,
    author,
    genre,
    publisher,
    available,
    publishedYear,
    rating,
    createdAt: created.toISOString(),
  };
});


