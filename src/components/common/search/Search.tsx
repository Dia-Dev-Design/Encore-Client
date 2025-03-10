import React, { useRef } from "react";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import type { InputRef } from "antd";

interface InputSearchProps {
  onSearch?: (value: string) => void;
  label?: string;
  placeholder?: string;
  width?: number | string;
  defaultValue?: string;
}

const InputSearch: React.FC<InputSearchProps> = ({
  onSearch,
  label = "",
  defaultValue,
  placeholder = "Search",
  width = 304,
}) => {
  const inputRef = useRef<InputRef>(null);

  const handleSearch = () => {
    const value = inputRef.current?.input?.value || "";
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <span className="text-greys-700 text-xs font-medium font-figtree">
          {label}
        </span>
      )}

      <Input
        ref={inputRef}
        className="custom-search"
        placeholder={placeholder}
        allowClear
        defaultValue={defaultValue}
        prefix={
          <SearchOutlined
            className="text-[#8D99A4] pr-3"
            onClick={handleSearch}
          />
        }
        onPressEnter={handleSearch}
        style={{ width }}
      />
    </div>
  );
};

export default InputSearch;
