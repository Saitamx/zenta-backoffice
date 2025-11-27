import React, { useState } from "react";
import type { Book } from "../../types/book";
import { clsx } from "clsx";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Copy, Edit2 } from "lucide-react";
import { booksService } from "../../services/booksService";
import { useBooks } from "../../context/BooksContext";

interface Props {
  rows: Book[];
  loading?: boolean;
}

export const BooksTable: React.FC<Props> = ({ rows, loading }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { refresh } = useBooks();
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set());
  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };
  const onCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {}
  };
  const onToggleAvailable = async (b: Book, value: boolean) => {
    await booksService.updateBook(b.id, { available: value } as any);
    refresh();
  };
  const truncated = (text?: string, id?: string) => {
    if (!text) return "—";
    const isOpen = id && expanded.has(id);
    if (isOpen || text.length <= 80) return text;
    return text.slice(0, 80) + "…";
  };
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Cover</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">{t("table.title")}</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">{t("table.author")}</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">{t("table.genre")}</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">{t("table.publisher")}</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">{t("table.year")}</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">{t("table.rating")}</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">{t("table.status")}</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">ISBN</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">{t("table.description") ?? "Descripción"}</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {loading ? (
            <tr>
              <td colSpan={10} className="px-4 py-6 text-center text-sm text-gray-500">
                {t("table.loading")}
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={10} className="px-4 py-6 text-center text-sm text-gray-500">
                {t("table.empty")}
              </td>
            </tr>
          ) : (
            rows.map((b, idx) => (
              <tr key={b.id} className={clsx("transition-colors", idx % 2 === 0 ? "bg-white" : "bg-gray-50/60", "hover:bg-indigo-50/40")}>
                <td className="px-4 py-2">
                  {b.imageUrl ? (
                    <img src={b.imageUrl} alt="" className="h-10 w-8 rounded object-cover ring-1 ring-gray-200" />
                  ) : (
                    <div className="h-10 w-8 rounded bg-gray-200 ring-1 ring-gray-200" />
                  )}
                </td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  <div className="flex items-center gap-2">
                    <button className="text-indigo-600 hover:underline" onClick={() => navigate(`/books/${b.id}`)}>
                      {b.title}
                    </button>
                    <button className="text-gray-400 hover:text-gray-600" title="Copiar título" onClick={() => onCopy(b.title)}>
                      <Copy size={16} />
                    </button>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {b.author}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">{b.genre}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{b.publisher}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{b.publishedYear}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{b.rating.toFixed(1)}</td>
                <td className="px-4 py-3 text-sm">
                  <span
                    className={clsx(
                      "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold",
                      b.available ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                    )}
                  >
                    {b.available ? t("status.available") : t("status.unavailable")}
                  </span>
                  <div className="mt-2">
                    <label className="inline-flex items-center gap-2 text-xs text-gray-600">
                      <input
                        type="checkbox"
                        checked={b.available}
                        onChange={(e) => onToggleAvailable(b, e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      {t("table.status")}
                    </label>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <span className="font-mono">{b.isbn || "—"}</span>
                    {b.isbn && (
                      <button className="text-gray-400 hover:text-gray-600" title="Copiar ISBN" onClick={() => onCopy(b.isbn!)}>
                        <Copy size={16} />
                      </button>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  <span>{truncated(b.description, b.id)}</span>
                  {b.description && b.description.length > 80 && (
                    <button className="ml-2 text-xs text-indigo-600 hover:underline" onClick={() => toggleExpand(b.id)}>
                      {expanded.has(b.id) ? "Ver menos" : "Ver más"}
                    </button>
                  )}
                </td>
                <td className="px-4 py-3 text-right text-sm">
                  <button className="text-gray-500 hover:text-gray-700" title="Editar" onClick={() => navigate(`/books/${b.id}/edit`)}>
                    <Edit2 size={16} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};


