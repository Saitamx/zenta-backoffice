import React from "react";
import { AppLayout } from "../components/templates/AppLayout";
import { SearchInput } from "../components/molecules/SearchInput";
import { FiltersBar } from "../components/organisms/FiltersBar";
import { BooksTable } from "../components/organisms/BooksTable";
import { Pagination } from "../components/organisms/Pagination";
import { BooksProvider, useBooks } from "../context/BooksContext";
import { useTranslation } from "react-i18next";
import { Alert } from "../components/atoms/Alert";
import { Button } from "../components/atoms/Button";
import { useNavigate } from "react-router-dom";
import { Plus, Download } from "lucide-react";
import { booksService } from "../services/booksService";

const BooksView: React.FC = () => {
  const { query, setSearch, result, loading, setPage, setPageSize, error } = useBooks();
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">{t("books.title")}</h2>
          <div className="flex items-center gap-2">
            <Button onClick={() => booksService.exportCsv({ ...query })} variant="secondary" className="gap-2">
              <Download size={16} />
              CSV
            </Button>
            <Button onClick={() => navigate("/books/new")} className="gap-2">
              <Plus size={16} />
              {t("books.new")}
            </Button>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
          <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
            <div className="w-full max-w-xl">
              <SearchInput value={query.search} onChange={setSearch} placeholder={t("books.searchPlaceholder")} />
            </div>
          </div>
          <div className="mt-3">
            <FiltersBar />
          </div>
        </div>
      </div>

      {error && <Alert tone="error">{t(error)}</Alert>}

      <BooksTable rows={result.data} loading={loading} />

      <Pagination
        page={query.page}
        pageSize={query.pageSize}
        total={result.total}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
};

export const BooksPage: React.FC = () => {
  return (
    <AppLayout>
      <BooksProvider>
        <BooksView />
      </BooksProvider>
    </AppLayout>
  );
};


