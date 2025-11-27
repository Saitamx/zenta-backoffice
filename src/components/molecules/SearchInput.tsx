import React, { useCallback } from "react";
import { Input } from "../atoms/Input";
import { Search } from "lucide-react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchInput: React.FC<Props> = ({ value, onChange, placeholder }) => {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value),
    [onChange]
  );
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
      <Input
        value={value}
        onChange={handleChange}
        placeholder={placeholder ?? "Buscar libros..."}
        className="pl-9"
      />
    </div>
  );
};


