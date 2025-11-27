import React, { useMemo } from "react";
import { Select } from "../atoms/Select";
import { Button } from "../atoms/Button";
import { useTranslation } from "react-i18next";

interface Props {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export const Pagination: React.FC<Props> = ({ page, pageSize, total, onPageChange, onPageSizeChange }) => {
  const { t } = useTranslation();
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const canPrev = page > 1;
  const canNext = page < totalPages;

  const info = useMemo(() => {
    const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
    const end = Math.min(total, page * pageSize);
    return `${start}-${end} ${t("pagination.of")} ${total}`;
  }, [page, pageSize, total, t]);

  return (
    <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
      <div className="text-sm text-gray-600">{info}</div>
      <div className="flex items-center gap-2">
        <Select
          value={String(pageSize)}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          aria-label={t("pagination.pageSizeAria")}
        >
          {[10, 20, 50].map((s) => (
            <option key={s} value={s}>
              {t("pagination.perPage", { count: s })}
            </option>
          ))}
        </Select>
        <Button onClick={() => onPageChange(page - 1)} disabled={!canPrev} variant="secondary">
          {t("pagination.prev")}
        </Button>
        <span className="text-sm text-gray-700">
          {t("pagination.page", { page, totalPages })}
        </span>
        <Button onClick={() => onPageChange(page + 1)} disabled={!canNext} variant="secondary">
          {t("pagination.next")}
        </Button>
      </div>
    </div>
  );
};


