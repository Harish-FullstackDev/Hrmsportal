"use client";

import { useState } from "react";

export const ALL = "all";

// Status filter + pagination shared by the HR lists. Changing the filter goes
// back to page 1.
export default function useHrList(rows, { pageSize, statusOf = (row) => row.status }) {
    const [filter, setFilterState] = useState(ALL);
    const [page, setPage] = useState(1);

    const filtered = filter === ALL ? rows : rows.filter((row) => statusOf(row) === filter);
    const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
    const current = Math.min(page, pageCount);

    return {
        filter,
        setFilter: (value) => {
            setFilterState(value);
            setPage(1);
        },
        filteredCount: filtered.length,
        countFor: (value) => (value === ALL ? rows.length : rows.filter((row) => statusOf(row) === value).length),
        page: current,
        pageCount,
        setPage,
        pageRows: filtered.slice((current - 1) * pageSize, current * pageSize),
    };
}
