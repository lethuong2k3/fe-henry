'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useEffect, useRef } from 'react'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { SelectDropdown } from '@/components/select-dropdown'
import { Textarea } from '@/components/ui/textarea'
import { showSubmittedData } from '@/lib/show-submitted-data'

import { Upload, ImageIcon, XIcon } from 'lucide-react'
import Tiptap from '@/components/admin/tiptap'

type TaskMutateDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: any
}

const formSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  description: z.string(),
  imageUrl: z.string().optional(),
  status: z.string().min(1, 'Please select a status.'),
  active: z.string().min(1, 'Please select a status.')
})
type TaskForm = z.infer<typeof formSchema>

export function TasksMutateDrawer({
  open,
  onOpenChange,
  currentRow,
}: TaskMutateDrawerProps) {

  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const form = useForm<TaskForm>({
    resolver: zodResolver(formSchema),
    defaultValues: currentRow ?? {
      title: '',
      description: '',
      imageUrl: '',
      status: '1',
      active: '',
    },
  })

  // 🔥 Khi user nhập/dán URL → auto preview
  useEffect(() => {
    const url = form.watch("imageUrl")
    if (url) setPreview(url)
  }, [form.watch("imageUrl")])

  // 🔥 Hàm upload file (thay API bằng backend của bạn)
  const uploadImage = async (file: File) => {
    setIsUploading(true)

    const formData = new FormData()
    formData.append("file", file)

    // Ví dụ API upload
    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData
    })

    const data = await res.json()
    setIsUploading(false)

    return data.url // backend trả về {url: "..."}
  }

  const onSubmit = async (data: TaskForm) => {
    let finalImageUrl = data.imageUrl

    // Nếu có upload file → upload trước khi submit form
    if (file) {
      const url = await uploadImage(file)
      finalImageUrl = url
    }

    const finalData = {
      ...data,
      imageUrl: finalImageUrl
    }

    showSubmittedData(finalData)
    onOpenChange(false)
    form.reset()
    setFile(null)
    setPreview(null)
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v)
        form.reset()
        setPreview(null)
        setFile(null)
      }}
    >
      <SheetContent className="flex flex-col lg:w-[600px] lg:max-w-[600px]">
        <SheetHeader className="text-start">
          <SheetTitle>{currentRow ? "Update" : "Create"} Blog</SheetTitle>
          <SheetDescription>
            Provide necessary info then click save.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            id="tasks-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex-1 space-y-6 overflow-y-auto px-4"
          >
            {/* ----- Title ----- */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter title" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* ----- IMAGE URL ----- */}
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Paste image URL"
                      onChange={(e) => {
                        field.onChange(e)
                        setPreview(e.target.value)
                        setFile(null)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ----- UPLOAD IMAGE ----- */}
            <div className="space-y-2">
              <FormLabel>Upload Image</FormLabel>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                id="upload-input"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) {
                    setFile(f)
                    const url = URL.createObjectURL(f)
                    setPreview(url)

                    // Clear URL field if uploading a file
                    form.setValue("imageUrl", "")
                  }
                }}
              />

              <Button
                type="button"
                variant="secondary"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose Image
              </Button>
            </div>

            {/* ----- PREVIEW + CLEAR BUTTON ----- */}
           {preview ? (
          <div className="relative mt-2">
            <img
              src={preview}
              alt="preview"
              className="w-full max-h-72 object-contain rounded border"
              onError={(e) => {
                e.currentTarget.src = "/src/assets/no-image.png"
              }}
          />

          {/* CLEAR IMAGE BUTTON */}
          <button
            type="button"
            onClick={() => {
              setPreview(null)
              setFile(null)
              form.setValue("imageUrl", "")

              if (fileInputRef.current) {
                fileInputRef.current.value = ""
              }
            }}
            className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1"
          >
            <XIcon className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-center h-32 border rounded">
          <ImageIcon className="w-10 h-10 text-gray-400" />
        </div>
      )}
            {/* ----- Description ----- */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Tiptap value={field.value || ''} onChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            {/* ----- Status ----- */}
            <FormField
              control={form.control}
              name='status'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <SelectDropdown
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    items={[
                      { label: 'In Progress', value: '1' },
                      { label: 'Canceled', value: '0' },
                    ]}
                  />
                </FormItem>
              )}
            />

            {/* ----- Active ----- */}
            <FormField
              control={form.control}
              name='active'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Active</FormLabel>
                  <RadioGroup
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1" />
                      <label>Active</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="0" />
                      <label>No active</label>
                    </div>
                  </RadioGroup>
                </FormItem>
              )}
            />

          </form>
        </Form>

        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
          <Button type="submit" form="tasks-form" disabled={isUploading}>
            {isUploading ? "Uploading..." : "Save changes"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
