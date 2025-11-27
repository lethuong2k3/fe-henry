import { Main } from "@/components/admin/layout/main";
import { TasksPrimaryButtons } from "./components/tasks-primary-buttons";
import { TasksProvider } from "@/contexts/task-provider";
import { TasksDialogs } from "./components/tasks-dialogs";

export default function Blogs() {
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
            </Main>
            <TasksDialogs />
        </TasksProvider>
    )
}