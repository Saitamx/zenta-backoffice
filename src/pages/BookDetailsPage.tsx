import React, { useEffect, useState } from "react";
import { AppLayout } from "../components/templates/AppLayout";
import { useParams, useNavigate } from "react-router-dom";
import { booksService } from "../services/booksService";
import type { Book } from "../types/book";
import { Button } from "../components/atoms/Button";
import { useTranslation } from "react-i18next";

export const BookDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    if (id) {
      booksService
        .getBook(id)
        .then((b) => {
          if (!cancelled) setBook(b);
        })
        .finally(() => !cancelled && setLoading(false));
    }
    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <AppLayout>
      <div className="mx-auto max-w-3xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">{t("books.details.title")}</h2>
          <div className="flex gap-2">
            {id && (
              <Button onClick={() => navigate(`/books/${id}/edit`)}>{t("books.details.edit")}</Button>
            )}
            <Button variant="secondary" onClick={() => navigate("/books")}>
              {t("books.details.back")}
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="text-sm text-gray-600">{t("table.loading")}</div>
        ) : !book ? (
          <div className="text-sm text-gray-600">{t("table.empty")}</div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm ring-1 ring-white/60">
            <div className="mb-4 flex items-start gap-4">
              {book.imageUrl ? (
                <img src={book.imageUrl} alt="" className="h-28 w-20 rounded object-cover ring-1 ring-gray-200" />
              ) : (
                <div className="h-28 w-20 rounded bg-gray-200 ring-1 ring-gray-200" />
              )}
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="truncate text-lg font-semibold text-gray-900">{book.title}</h3>
                </div>
                <p className="text-sm text-gray-700">{book.author}</p>
              </div>
            </div>
            <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-semibold uppercase text-gray-500">{t("table.title")}</dt>
                <dd className="text-sm text-gray-900">{book.title}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase text-gray-500">{t("table.author")}</dt>
                <dd className="text-sm text-gray-900">{book.author}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase text-gray-500">{t("table.year")}</dt>
                <dd className="text-sm text-gray-900">{book.publishedYear}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase text-gray-500">{t("table.genre")}</dt>
                <dd className="text-sm text-gray-900">{book.genre}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase text-gray-500">{t("table.publisher")}</dt>
                <dd className="text-sm text-gray-900">{book.publisher}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase text-gray-500">{t("table.status")}</dt>
                <dd className="text-sm text-gray-900">
                  {book.available ? t("status.available") : t("status.unavailable")}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs font-semibold uppercase text-gray-500">{t("table.description") ?? "Descripción"}</dt>
                <dd className="text-sm text-gray-900">{book.description || "—"}</dd>
              </div>
            </dl>
          </div>
        )}
      </div>
    </AppLayout>
  );
};


