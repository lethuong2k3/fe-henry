  import { ConfirmDialog } from '@/components/confirm-dialog'
import { TasksMutateDrawer } from './tasks-mutate-drawer'
import { useTasks } from '@/contexts/task-provider'
import { deleteBlog } from '@/service/blog-service'
import { toast } from 'sonner'
import { useState } from 'react'

export function TasksDialogs({onSuccess }: {onSuccess?: () => void}) {
  const { open, setOpen, currentRow, setCurrentRow } = useTasks()
  const [isDeleting, setIsDeleting] = useState(false)
  return (
    <>
      <TasksMutateDrawer
        key='task-create'
        open={open === 'create'}
        onOpenChange={() => setOpen('create')}
        onSuccess={onSuccess}
      />

      {currentRow && (
        <>
          <TasksMutateDrawer
            key={`task-update-${currentRow.id}`}
            open={open === 'update'}
            onOpenChange={() => {
              setOpen('update')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
            onSuccess={onSuccess}
          />

          <ConfirmDialog
            key='task-delete'
            destructive
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            isLoading={isDeleting}
             handleConfirm={async () => {
              if (!currentRow?.id) return
              setIsDeleting(true)
              try {
                await deleteBlog(currentRow.id)
                toast.success("Blog deleted successfully")
                onSuccess?.()                     
              } catch (err: any) {
                toast.error(err?.response?.data?.message ?? "Delete failed")
              } finally {
                setIsDeleting(false)
                setOpen(null)
                setTimeout(() => {
                  setCurrentRow(null)
                }, 300)
              }
            }}
            className='max-w-md'
            title={`Delete this blog: ${currentRow.title} ?`}
            desc={
              <>
                You are about to delete a blog with the ID{' '}
                <strong>{currentRow.id}</strong>. <br />
                This action cannot be undone.
              </>
            }
            confirmText='Delete'
          />
        </>
      )}
    </>
  )
}