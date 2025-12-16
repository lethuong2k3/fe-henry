import { Main } from "@/components/admin/layout/main";
import { TasksPrimaryButtons } from "./components/tasks-primary-buttons";
import { TasksProvider } from "@/contexts/task-provider";
import { TasksDialogs } from "./components/tasks-dialogs";
import { TaskTable } from "./components/task-table";
import { useEffect, useState } from "react";
import type { Blog, PageResponse } from "@/interfaces/blog";
import { useDebounce } from "@/hooks/useDebounce";
import { getBlogs } from "@/service/blog-service";

export default function Blogs() {
    const [data, setData] = useState<Blog[]>([])
    const [isLoadingData, setIsLoadingData] = useState(false)
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);
    const [statusValue, setStatusValue] = useState("");
    const [activeValue, setActiveValue] = useState("");
    const [pagination, setPagination] = useState({ pageIndex: 0,pageSize: 10,})
    const [pageMeta, setPageMeta] = useState<Omit<PageResponse<Blog>, "content"> | null>(null)
     const fetchData =  () => {
         getBlogs({
            search: debouncedSearch,
            status: statusValue || null,
            active: activeValue || null,
            page: pagination.pageIndex,
            size: pagination.pageSize,
            sortBy: "createdAt",
            direction: "desc",
        }).then((res) => {
            setData(res.content)
            const { content, ...meta } = res 
            setPageMeta(meta)
            setIsLoadingData(false);
        }).catch((err) => {
            setIsLoadingData(false);
            console.error(err);
        })
    }
    useEffect(() => {
        if (isLoadingData) return;
        setIsLoadingData(true);
        fetchData();
    }, [statusValue, activeValue, debouncedSearch, pagination.pageIndex, pagination.pageSize])
    
   
    return (
        <TasksProvider>
            <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
                <div className='flex flex-wrap items-end justify-between gap-2'>
                <div>
                    <h2 className='text-2xl font-bold tracking-tight'>Blogs</h2>
                    <p className='text-muted-foreground'>
                    Here&apos;s a list of your tasks for this month!
                    </p>
                </div>
                <TasksPrimaryButtons />
                </div>
                <TaskTable 
                    data={data} 
                    pageMeta={pageMeta} 
                    pagination={pagination}
                    setPagination={setPagination} 
                    search={search} 
                    setSearch={setSearch}
                    isLoadingData={isLoadingData}
                    statusValue={statusValue}
                    setStatusValue={setStatusValue}
                    activeValue={activeValue}
                    setActiveValue={setActiveValue}
                />
            </Main>
            <TasksDialogs onSuccess={fetchData} />
        </TasksProvider>
    )
}