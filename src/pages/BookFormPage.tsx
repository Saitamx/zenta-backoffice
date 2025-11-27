import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AppLayout } from "../components/templates/AppLayout";
import { Input } from "../components/atoms/Input";
import { TextArea } from "../components/atoms/TextArea";
import { Button } from "../components/atoms/Button";
import { Alert } from "../components/atoms/Alert";
import { useParams, useNavigate } from "react-router-dom";
import { booksService } from "../services/booksService";
import { useTranslation } from "react-i18next";

export const BookFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [publishedYear, setPublishedYear] = useState<number | "">("");
  const [isbn, setIsbn] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState<string | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    if (isEdit && id) {
      booksService
        .getBook(id)
        .then((b) => {
          if (cancelled) return;
          setTitle(b.title);
          setAuthor(b.author);
          setPublishedYear(b.publishedYear || "");
          setIsbn(b.isbn ?? "");
          setDescription(b.description ?? "");
        })
        .catch(() => {
          if (!cancelled) setError(t("books.form.loadError"));
        });
    }
    return () => {
      cancelled = true;
    };
  }, [id, isEdit, t]);

  // reactive validation (simple)
  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (!title.trim()) e.title = t("books.form.errors.title");
    if (!author.trim()) e.author = t("books.form.errors.author");
    if (publishedYear !== "" && (Number.isNaN(Number(publishedYear)) || String(publishedYear).length !== 4)) {
      e.publishedYear = t("books.form.errors.publishedYear");
    }
    if (isbn && isbn.length < 10) e.isbn = t("books.form.errors.isbn");
    return e;
  }, [title, author, publishedYear, isbn, t]);

  const onFile = useCallback((file: File | null) => {
    setImageFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    } else {
      setImagePreview(null);
    }
  }, []);

  const onSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(undefined);
      setSuccess(undefined);
      if (Object.keys(errors).length > 0) return;
      setLoading(true);
      try {
        const payload = {
          title: title.trim(),
          author: author.trim(),
          publishedYear: publishedYear === "" ? undefined : Number(publishedYear),
          isbn: isbn.trim() || undefined,
          description: description.trim() || undefined,
        };
        if (isEdit && id) {
          await booksService.updateBook(id, payload);
          setSuccess(t("books.form.updated"));
        } else {
          await booksService.createBook(payload);
          setSuccess(t("books.form.created"));
        }
        // image upload is UI-only for ahora; backend no soporta imagen
        setTimeout(() => navigate("/books"), 600);
      } catch (err) {
        setError((err as Error).message || t("books.form.submitError"));
      } finally {
        setLoading(false);
      }
    },
    [errors, isEdit, id, title, author, publishedYear, isbn, description, t, navigate]
  );

  return (
    <AppLayout>
      <form onSubmit={onSubmit} className="mx-auto max-w-2xl space-y-5" autoComplete="off">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {isEdit ? t("books.form.editTitle") : t("books.form.newTitle")}
          </h2>
          <p className="text-sm text-gray-600">{t("books.form.subtitle")}</p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm ring-1 ring-white/60">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-800">{t("books.form.title")}</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
            {errors.title && <p className="mt-1 text-xs text-rose-600">{errors.title}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-800">{t("books.form.author")}</label>
            <Input value={author} onChange={(e) => setAuthor(e.target.value)} required />
            {errors.author && <p className="mt-1 text-xs text-rose-600">{errors.author}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-800">{t("books.form.publishedYear")}</label>
            <Input
              value={publishedYear}
              onChange={(e) => setPublishedYear(e.target.value ? Number(e.target.value) : "")}
              placeholder="YYYY"
              inputMode="numeric"
            />
            {errors.publishedYear && <p className="mt-1 text-xs text-rose-600">{errors.publishedYear}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-800">ISBN</label>
            <Input value={isbn} onChange={(e) => setIsbn(e.target.value)} />
            {errors.isbn && <p className="mt-1 text-xs text-rose-600">{errors.isbn}</p>}
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-800">{t("books.form.description")}</label>
            <TextArea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          </div>
        </div>

        <div className="space-y-2 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm ring-1 ring-white/60">
          <label className="mb-1 block text-sm font-medium text-gray-800">{t("books.form.cover")}</label>
          <div className="flex items-center gap-4">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => onFile(e.target.files?.[0] ?? null)}
              className="text-sm"
            />
            {imagePreview && (
              <img src={imagePreview} alt="preview" className="h-20 w-20 rounded-md object-cover ring-1 ring-gray-200" />
            )}
          </div>
          <p className="text-xs text-gray-500">{t("books.form.coverHint")}</p>
          <div className="pt-2">
            <label className="mb-1 block text-sm font-medium text-gray-800">URL</label>
            <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." />
            <p className="mt-1 text-xs text-gray-500">Opcional. Puedes pegar la URL de la portada si ya existe en la web.</p>
          </div>
        </div>

        {error && <Alert tone="error">{error}</Alert>}
        {success && <Alert tone="success">{success}</Alert>}

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={loading}>
            {isEdit ? t("books.form.saveChanges") : t("books.form.create")}
          </Button>
          <Button type="button" variant="secondary" onClick={() => navigate("/books")}>
            {t("books.form.cancel")}
          </Button>
        </div>
      </form>
    </AppLayout>
  );
};


