import { useState } from "react"
import { type Table } from "@tanstack/react-table"
import { Trash2, CircleArrowUp, ArrowUpDown } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { DataTableBulkActions as BulkActionsToolbar } from "@/components/data-table/bulk-actions"
import { TasksMultiDeleteDialog } from "./tasks-multi-delete-dialog"

import { actives, statuses } from "../data/data"
import type { Blog } from "@/interfaces/blog"
import { updateBlogsStatus, updateBlogsActive } from "@/service/blog-service"

type DataTableBulkActionsProps<TData> = {
  table: Table<TData>
  onSuccess?: () => void
}

export function DataTableBulkActions<TData>({
  table,
  onSuccess
}: DataTableBulkActionsProps<TData>) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const selectedRows = table.getFilteredSelectedRowModel().rows
  const selectedIds = selectedRows.map((r) => String((r.original as Blog).id))
  const selectedCount = selectedIds.length


  const handleBulkStatusChange = async (status: string) => {
    if (selectedCount === 0) {
      toast.warning("Please select at least 1 blog.")
      return
    }
    toast.promise(
      updateBlogsStatus(selectedIds, status as "0" | "1"),
      {
        loading: "Updating status...",
        success: () => {
          table.resetRowSelection()
          onSuccess?.()
          return `Status updated to "${status == "1" ? "In Progress" : "Canceled"}" for ${selectedCount} blog${selectedCount > 1 ? "s" : ""}.`
        },
        error: (err: any) => {
          return err?.response?.data?.message ?? "Update status failed"
        },
      }
    )
  }

  const handleBulkActiveChange = async (active: string) => {
    if (selectedCount === 0) {
      toast.warning("Please select at least 1 blog.")
      return
    }

    toast.promise(
      updateBlogsActive(selectedIds, active as "0" | "1"),
      {
        loading: "Updating active...",
        success: () => {
          table.resetRowSelection()
          onSuccess?.()
          return `Active updated to "${active == "1" ? "Active" : "Inactive"}" for ${selectedCount} blog${selectedCount > 1 ? "s" : ""}.`
        },
        error: (err: any) => {
          return err?.response?.data?.message ?? "Update active failed"
        },
      }
    )
  }

  return (
    <>
      <BulkActionsToolbar table={table} entityName="blog">
        {/* STATUS */}
        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="size-8"
                  aria-label="Update status"
                  title="Update status"
                >
                  <CircleArrowUp />
                  <span className="sr-only">Update status</span>
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Update status</p>
            </TooltipContent>
          </Tooltip>

          <DropdownMenuContent sideOffset={14}>
            {statuses.map((s) => (
              <DropdownMenuItem
                key={s.value}
                onClick={() => handleBulkStatusChange(s.value)}
              >
                {s.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* ACTIVE */}
        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="size-8"
                  aria-label="Update active"
                  title="Update active"
                >
                  <ArrowUpDown />
                  <span className="sr-only">Update active</span>
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Update active</p>
            </TooltipContent>
          </Tooltip>

          <DropdownMenuContent sideOffset={14}>
            {actives.map((a) => (
              <DropdownMenuItem
                key={a.value}
                onClick={() => handleBulkActiveChange(a.value)}
              >
                {a.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* DELETE */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => setShowDeleteConfirm(true)}
              className="size-8"
              aria-label="Delete selected blogs"
              title="Delete selected blogs"
              disabled={selectedCount === 0}
            >
              <Trash2 />
              <span className="sr-only">Delete selected blogs</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete selected blogs</p>
          </TooltipContent>
        </Tooltip>
      </BulkActionsToolbar>

      <TasksMultiDeleteDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        table={table}
        onSuccess={onSuccess}
      />
    </>
  )
}
