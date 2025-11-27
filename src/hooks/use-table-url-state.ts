import { useMemo, useState } from "react"
import type {
  ColumnFiltersState,
  OnChangeFn,
  PaginationState,
} from "@tanstack/react-table"

type UseTableUrlStateParams = {
  searchParams: URLSearchParams
  setSearchParams: (next: URLSearchParams | ((prev: URLSearchParams) => URLSearchParams)) => void

  pagination?: {
    pageKey?: string
    pageSizeKey?: string
    defaultPage?: number
    defaultPageSize?: number
  }
  globalFilter?: {
    enabled?: boolean
    key?: string
    trim?: boolean
  }
  columnFilters?: Array<
    | {
        columnId: string
        searchKey: string
        type?: "string"
        serialize?: (value: unknown) => unknown
        deserialize?: (value: unknown) => unknown
      }
    | {
        columnId: string
        searchKey: string
        type: "array"
        serialize?: (value: unknown) => unknown
        deserialize?: (value: unknown) => unknown
      }
  >
}

type UseTableUrlStateReturn = {
  globalFilter?: string
  onGlobalFilterChange?: OnChangeFn<string>

  columnFilters: ColumnFiltersState
  onColumnFiltersChange: OnChangeFn<ColumnFiltersState>

  pagination: PaginationState
  onPaginationChange: OnChangeFn<PaginationState>

  ensurePageInRange: (pageCount: number, opts?: { resetTo?: "first" | "last" }) => void
}

export function useTableUrlState(params: UseTableUrlStateParams): UseTableUrlStateReturn {
  const {
    searchParams,
    setSearchParams,
    pagination: paginationCfg,
    globalFilter: globalFilterCfg,
    columnFilters: columnFiltersCfg = [],
  } = params

  const pageKey = paginationCfg?.pageKey ?? "page"
  const pageSizeKey = paginationCfg?.pageSizeKey ?? "pageSize"
  const defaultPage = paginationCfg?.defaultPage ?? 1
  const defaultPageSize = paginationCfg?.defaultPageSize ?? 10

  const globalFilterKey = globalFilterCfg?.key ?? "filter"
  const globalFilterEnabled = globalFilterCfg?.enabled ?? true
  const trimGlobal = globalFilterCfg?.trim ?? true

  // --------------------------
  // COLUMN FILTERS (initial)
  // --------------------------
  const initialColumnFilters: ColumnFiltersState = useMemo(() => {
    const collected: ColumnFiltersState = []

    for (const cfg of columnFiltersCfg) {
      const raw = searchParams.get(cfg.searchKey)
      const deserialize = cfg.deserialize ?? ((v: unknown) => v)

      if (cfg.type === "string") {
        const value = raw ?? ""
        if (value.trim() !== "") {
          collected.push({ id: cfg.columnId, value: deserialize(value) })
        }
      } else {
        // array type → CSV
        const list = raw ? raw.split(",") : []
        if (list.length > 0) {
          collected.push({ id: cfg.columnId, value: deserialize(list) })
        }
      }
    }

    return collected
  }, [columnFiltersCfg, searchParams])

  const [columnFilters, setColumnFilters] = useState(initialColumnFilters)

  // --------------------------
  // PAGINATION
  // --------------------------
  const pagination: PaginationState = useMemo(() => {
    const rawPage = Number(searchParams.get(pageKey))
    const rawPageSize = Number(searchParams.get(pageSizeKey))

    return {
      pageIndex: isNaN(rawPage) ? defaultPage - 1 : rawPage - 1,
      pageSize: isNaN(rawPageSize) ? defaultPageSize : rawPageSize,
    }
  }, [searchParams, pageKey, pageSizeKey, defaultPage, defaultPageSize])

  const onPaginationChange: OnChangeFn<PaginationState> = (updater) => {
    const next = typeof updater === "function" ? updater(pagination) : updater

    setSearchParams((prev) => {
      const nextParams = new URLSearchParams(prev)

      const nextPage = next.pageIndex + 1
      const nextSize = next.pageSize

      nextPage === defaultPage
        ? nextParams.delete(pageKey)
        : nextParams.set(pageKey, String(nextPage))

      nextSize === defaultPageSize
        ? nextParams.delete(pageSizeKey)
        : nextParams.set(pageSizeKey, String(nextSize))

      return nextParams
    })
  }

  // --------------------------
  // GLOBAL FILTER
  // --------------------------
  const [globalFilter, setGlobalFilter] = useState<string>(() => {
    const raw = searchParams.get(globalFilterKey)
    return raw ?? ""
  })

  const onGlobalFilterChange: OnChangeFn<string> | undefined = globalFilterEnabled
    ? (updater) => {
        const next = typeof updater === "function" ? updater(globalFilter) : updater
        const value = trimGlobal ? next.trim() : next

        setGlobalFilter(value)

        setSearchParams((prev) => {
          const nextParams = new URLSearchParams(prev)

          nextParams.delete(pageKey) // reset page

          if (value) nextParams.set(globalFilterKey, value)
          else nextParams.delete(globalFilterKey)

          return nextParams
        })
      }
    : undefined

  // --------------------------
  // COLUMN FILTERS (CHANGE)
  // --------------------------
  const onColumnFiltersChange: OnChangeFn<ColumnFiltersState> = (updater) => {
    const next = typeof updater === "function" ? updater(columnFilters) : updater
    setColumnFilters(next)

    setSearchParams((prev) => {
      const nextParams = new URLSearchParams(prev)

      nextParams.delete(pageKey) // reset page

      for (const cfg of columnFiltersCfg) {
        const found = next.find((f) => f.id === cfg.columnId)
        const serialize = cfg.serialize ?? ((v: unknown) => v)

        if (cfg.type === "string") {
          const val = (found?.value as string) ?? ""
          val.trim()
            ? nextParams.set(cfg.searchKey, String(serialize(val)))
            : nextParams.delete(cfg.searchKey)
        } else {
          const list = (found?.value as unknown[]) ?? []
          list.length
            ? nextParams.set(cfg.searchKey, String(serialize(list.join(","))))
            : nextParams.delete(cfg.searchKey)
        }
      }

      return nextParams
    })
  }

  // --------------------------
  // ENSURE PAGE IN RANGE
  // --------------------------
  const ensurePageInRange = (
    pageCount: number,
    opts: { resetTo?: "first" | "last" } = { resetTo: "first" }
  ) => {
    const rawPage = Number(searchParams.get(pageKey))
    const current = isNaN(rawPage) ? defaultPage : rawPage

    if (current > pageCount && pageCount > 0) {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev)
        if (opts.resetTo === "last") next.set(pageKey, String(pageCount))
        else next.delete(pageKey)
        return next
      })
    }
  }

  return {
    globalFilter,
    onGlobalFilterChange,
    columnFilters,
    onColumnFiltersChange,
    pagination,
    onPaginationChange,
    ensurePageInRange,
  }
}
