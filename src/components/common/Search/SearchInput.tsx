"use client";

import React, { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks/hooks";
import { setSearchTerm } from "@/redux/app/appSlice";
import { useDebounce } from "@/hooks/useDebounce";

const SearchInput = () => {
  const dispatch = useAppDispatch();
  const searchTerm = useAppSelector((state) => state.app.searchTerm);

  const [inputValue, setInputValue] = useState(searchTerm || "");
  const debouncedInputValue = useDebounce(inputValue, 500);

  useEffect(() => {
    if (debouncedInputValue !== searchTerm) {
      dispatch(setSearchTerm(debouncedInputValue));
    }
  }, [debouncedInputValue, dispatch, searchTerm]);

  return (
    <div style={{ marginBottom: "1rem" }}>
      <input
        type="text"
        placeholder="Search foods..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            setInputValue("");
            dispatch(setSearchTerm(""));
          }
        }}
        style={{
          width: "100%",
          padding: "0.5rem",
          fontSize: "1rem",
          borderRadius: "4px",
          border: "1px solid #ccc",
        }}
      />
    </div>
  );
};

export default SearchInput;
