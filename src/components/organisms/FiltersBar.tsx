import React, { useMemo } from "react";
import { Select } from "../atoms/Select";
import { useBooks } from "../../context/BooksContext";
import type { Book } from "../../types/book";
import { ArrowDownUp, Plus, X } from "lucide-react";
import { Button } from "../atoms/Button";
import { useTranslation } from "react-i18next";

const sortableFields: Array<keyof Book> = [
  "title",
  "author",
  "genre",
  "publisher",
  "available",
  "publishedYear",
  "rating",
  "createdAt",
];

export const FiltersBar: React.FC = () => {
  const { t } = useTranslation();
  const { metadata, query, setFilter, addSort, removeSort, toggleSortDirection } = useBooks();

  const authorOptions = useMemo(() => ["Todos", ...metadata.authors], [metadata.authors]);
  const publisherOptions = useMemo(() => ["Todos", ...metadata.publishers], [metadata.publishers]);
  const genreOptions = useMemo(() => ["Todos", ...metadata.genres], [metadata.genres]);

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
      <Select
        label={t("filters.genre")}
        value={query.filters.genre ?? "Todos"}
        onChange={(e) => setFilter("genre", e.target.value as any)}
      >
        {genreOptions.map((g) => {
          const label = g === "Todos" ? t("filters.all") : g;
          return (
            <option key={g} value={g}>
              {label}
            </option>
          );
        })}
      </Select>

      <Select
        label={t("filters.publisher")}
        value={query.filters.publisher ?? "Todos"}
        onChange={(e) => setFilter("publisher", e.target.value)}
      >
        {publisherOptions.map((p) => {
          const label = p === "Todos" ? t("filters.all") : p;
          return (
            <option key={p} value={p}>
              {label}
            </option>
          );
        })}
      </Select>

      <Select
        label={t("filters.author")}
        value={query.filters.author ?? "Todos"}
        onChange={(e) => setFilter("author", e.target.value)}
      >
        {authorOptions.map((a) => {
          const label = a === "Todos" ? t("filters.all") : a;
          return (
            <option key={a} value={a}>
              {label}
            </option>
          );
        })}
      </Select>

      <Select
        label={t("filters.availability")}
        value={String(query.filters.available ?? "Todos")}
        onChange={(e) => {
          const v = e.target.value;
          setFilter("available", v === "Todos" ? "Todos" : v === "true");
        }}
      >
        <option value="Todos">{t("filters.all")}</option>
        <option value="true">{t("filters.available")}</option>
        <option value="false">{t("filters.unavailable")}</option>
      </Select>

      <div className="col-span-1 md:col-span-2 lg:col-span-4">
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {query.sort.map((s) => (
            <span
              key={`${s.field}`}
              className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-sm text-indigo-700"
            >
              <ArrowDownUp size={16} className="text-indigo-600" />
              <span className="font-medium">{s.field}</span>
              <button
                onClick={() => toggleSortDirection(s.field)}
                className="rounded bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-200"
              >
                {s.direction === "asc" ? t("sort.asc") : t("sort.desc")}
              </button>
              <button onClick={() => removeSort(s.field)} className="text-indigo-600 hover:text-indigo-800">
                <X size={16} />
              </button>
            </span>
          ))}

          <div className="ml-auto">
            <Select onChange={(e) => addSort({ field: e.target.value as keyof Book, direction: "asc" })}>
              <option value="">+ {t("filters.addSort")}</option>
              {sortableFields
                .filter((f) => !query.sort.find((s) => s.field === f))
                .map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};


