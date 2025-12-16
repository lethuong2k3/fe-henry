"use client"

import * as React from "react"
import {
 type ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, Check, ChevronDown, ChevronsUpDown, CircleCheck, CircleX, Eye, MoreHorizontal, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { cn } from "@/lib/utils"
import type { Blog, PageResponse } from "@/interfaces/blog"
import moment from 'moment';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { useTasks } from "@/contexts/task-provider"
import { Badge } from "@/components/ui/badge"


const statuses = [
  {
    value: '1',
    label: "In Progress",
  },
  {
    value: "0",
    label: "Canceled",
  },
]

const actives = [
    {
    value: 'true',
    label: "Active",
  },
  {
    value: "false",
    label: "No active",
  },
]

export const columns: ColumnDef<Blog>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("title")}</div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created At
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase">{moment(row.getValue("createdAt")).format('YYYY-MM-DD, h:mm:ss a')}</div>,
  },
   {
    accessorKey: "createdBy",
    header: "Created By",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("createdBy")}</div>
    ),
    
  },
  {
    accessorKey: "active",
    header: "Active",
    cell: ({ row }) => (
      <div className="capitalize">
  
        {row.getValue("active") == 1 ? (
          <Badge
          variant="secondary"
          className="bg-green-500 text-white dark:bg-green-600"
        >
         <CircleCheck /> 
          Active
        </Badge>
        ) : (
          <Badge variant="destructive"><CircleX />No active</Badge>
        )}
        </div>
    ),
    
  },
    {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("status") === 1 ? (
         <Badge
          variant="secondary"
          className="bg-green-500 text-white dark:bg-green-600"
        >
         <CircleCheck /> 
          	In Progress
        </Badge>
      ) : (<Badge variant="destructive"><CircleX />Canceled</Badge>)}</div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const block = row.original
      const { setOpen, setCurrentRow } = useTasks()
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                 const viewData = {
                ...block,
                active: block.active ? "1" : "0",
                status: block.status == "1" ? "1" : "0",
              }
                setCurrentRow(viewData)
                setOpen('update')
              }}
            >
              <Eye /> View
            </DropdownMenuItem>
            <DropdownMenuItem><Trash /> Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

type TaskTableProps = {
    data: Blog[]
    pageMeta: Omit<PageResponse<Blog>, "content"> | null,
    pagination: {
      pageIndex: number
      pageSize: number
    }
    setPagination: (v: any) => void,
    search: string,
    setSearch: (v: string) => void,
    isLoadingData: boolean
    statusValue: string
    setStatusValue: (v: string) => void
    activeValue: string
    setActiveValue: (v: string) => void
}

export function TaskTable(
  {
    data, 
    pageMeta, 
    pagination, 
    setPagination, 
    search, 
    setSearch, 
    isLoadingData, 
    statusValue, 
    setStatusValue, 
    activeValue, 
    setActiveValue,
  }: TaskTableProps
) {

  const [openStatus, setOpenStatus] = React.useState(false);    
  const [openActive, setOpenActive] = React.useState(false);
  const PAGE_SIZES = [10, 20, 50]
 
  const table = useReactTable({
    data,
    columns,
    manualPagination: true,
    pageCount: pageMeta?.totalPages ?? -1,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })
  
  return (
    <div className="w-full">
      <div className="flex xl:flex-row flex-col py-4 gap-3">
        <Input
          placeholder="Searchs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="xl:max-w-sm mr-3"
        />
        <div className="flex gap-2">
          <Popover open={openStatus} onOpenChange={setOpenStatus}>
            <PopoverTrigger asChild>
                <Button
                variant="outline"
                role="combobox"
                aria-expanded={openStatus}
                className="xl:w-[170px] w-[49%] justify-between"
                >
                {statusValue
                    ? statuses.find((s) => s.value === statusValue)?.label
                    : "Select status..."}
                <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="xl:w-[170px] w-full p-0">
                <Command>
                <CommandInput placeholder="Search status..." className="h-9" />
                <CommandList>
                    <CommandEmpty>No status found.</CommandEmpty>
                    <CommandGroup>
                    {statuses.map((status) => (
                        <CommandItem
                        key={status.value}
                        value={status.value}
                        onSelect={(currentValue) => {
                            setStatusValue(currentValue === statusValue ? "" : currentValue)
                            setOpenStatus(false)
                        }}
                        >
                        {status.label}
                        <Check
                            className={cn(
                            "ml-auto",
                            statusValue === status.value ? "opacity-100" : "opacity-0"
                            )}
                        />
                        </CommandItem>
                    ))}
                    </CommandGroup>
                </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
          <Popover open={openActive} onOpenChange={setOpenActive}>
            <PopoverTrigger asChild>
                <Button
                variant="outline"
                role="combobox"
                aria-expanded={openActive}
                className="xl:w-[170px] w-[49%] justify-between"
                >
                {activeValue
                    ? actives.find((a) => a.value === activeValue)?.label
                    : "Select active..."}
                <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="xl:w-[170px] w-full p-0">
                <Command>
                <CommandInput placeholder="Search active..." className="h-9" />
                <CommandList>
                    <CommandEmpty>No active found.</CommandEmpty>
                    <CommandGroup>
                    {actives.map((active) => (
                        <CommandItem
                        key={active.value}
                        value={active.value}
                        onSelect={(currentValue) => {
                            setActiveValue(currentValue === activeValue ? "" : currentValue)
                            setOpenActive(false)
                        }}
                        >
                        {active.label}
                        <Check
                            className={cn(
                            "ml-auto",
                            activeValue === active.value ? "opacity-100" : "opacity-0"
                            )}
                        />
                        </CommandItem>
                    ))}
                    </CommandGroup>
                </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {isLoadingData ? <div className="flex justify-center items-center"><Spinner /></div> : "No results"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-muted-foreground flex gap-2 justify-center items-center text-sm">
          <div className="flex justify-center items-center gap-2">
             <span className="text-sm text-muted-foreground">Rows per page</span>
             <Select
                value={String(pagination.pageSize)}
                onValueChange={(value) =>
                  setPagination((p: any) => ({
                    ...p,
                    pageSize: Number(value),
                    pageIndex: 0, 
                  }))
                }
              >
                <SelectTrigger className="w-[90px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAGE_SIZES.map((size) => (
                    <SelectItem key={size} value={String(size)}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
             </Select>
          </div>
           
        </div>
        <div className="space-x-2">
          <Pagination>
            <PaginationContent>
              {/* Previous */}
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    setPagination((p: any) => ({
                      ...p,
                      pageIndex: Math.max(p.pageIndex - 1, 0),
                    }))
                  }
                  className={
                    pagination.pageIndex === 0
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>

              {/* Page numbers */}
              {Array.from({ length: pageMeta?.totalPages ?? 0 })
                .slice(
                  Math.max(pagination.pageIndex - 1, 0),
                  pagination.pageIndex + 2
                )
                .map((_, idx) => {
                  const pageNumber =
                    Math.max(pagination.pageIndex - 1, 0) + idx

                  return (
                    <PaginationItem key={pageNumber} className="cursor-pointer">
                      <PaginationLink
                        isActive={pageNumber === pagination.pageIndex}
                        onClick={() =>
                          setPagination((p: any) => ({
                            ...p,
                            pageIndex: pageNumber,
                          }))
                        }
                      >
                        {pageNumber + 1}
                      </PaginationLink>
                    </PaginationItem>
                  )
                })}

              {/* Ellipsis */}
              {pageMeta && pagination.pageIndex < pageMeta.totalPages - 3 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              {/* Next */}
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setPagination((p: any) => ({
                      ...p,
                      pageIndex: p.pageIndex + 1,
                    }))
                  }
                  className={
                    pageMeta?.last ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  )
}
