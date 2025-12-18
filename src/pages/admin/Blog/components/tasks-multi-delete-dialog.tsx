"use client"

import { useState } from "react"
import { type Table } from "@tanstack/react-table"
import { AlertTriangle } from "lucide-react"
import { toast } from "sonner"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { deleteBlogs } from "@/service/blog-service"
import type { Blog } from "@/interfaces/blog"

type TaskMultiDeleteDialogProps<TData> = {
  open: boolean
  onOpenChange: (open: boolean) => void
  table: Table<TData>
  onSuccess?: () => void
}

const CONFIRM_WORD = "DELETE"

export function TasksMultiDeleteDialog<TData>({
  open,
  onOpenChange,
  table,
  onSuccess,
}: TaskMultiDeleteDialogProps<TData>) {
  const [value, setValue] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  const selectedRows = table.getFilteredSelectedRowModel().rows
  const ids = selectedRows.map((r) => String((r.original as Blog).id))

  const handleDelete = async () => {
    if (value.trim() !== CONFIRM_WORD) {
      toast.error(`Please type "${CONFIRM_WORD}" to confirm.`)
      return
    }
    if (ids.length === 0) {
      toast.warning("No blogs selected.")
      return
    }

    setIsDeleting(true)
    try {
      await deleteBlogs(ids)
      toast.success(`Deleted ${ids.length} blog${ids.length > 1 ? "s" : ""}.`)

      table.resetRowSelection()
      onSuccess?.() 
      onOpenChange(false)
      setValue("")
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Delete failed")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={(v) => {
        // reset khi đóng
        if (!v) {
          setValue("")
          setIsDeleting(false)
        }
        onOpenChange(v)
      }}
      handleConfirm={handleDelete}
      disabled={value.trim() !== CONFIRM_WORD || isDeleting}
      isLoading={isDeleting} // ✅ nếu ConfirmDialog hỗ trợ
      title={
        <span className="text-destructive">
          <AlertTriangle className="me-1 inline-block stroke-destructive" size={18} />{" "}
          Delete {ids.length} {ids.length > 1 ? "blogs" : "blog"}
        </span>
      }
      desc={
        <div className="space-y-4">
          <p className="mb-2">
            Are you sure you want to delete the selected blogs? <br />
            This action cannot be undone.
          </p>

          <Label className="my-4 flex flex-col items-start gap-1.5">
            <span>Confirm by typing "{CONFIRM_WORD}":</span>
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={`Type "${CONFIRM_WORD}" to confirm.`}
              disabled={isDeleting}
            />
          </Label>

          <Alert variant="destructive">
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>
              Please be careful, this operation can not be rolled back.
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText={isDeleting ? "Deleting..." : "Delete"}
      destructive
    />
  )
}
