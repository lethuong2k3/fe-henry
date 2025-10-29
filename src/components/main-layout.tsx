import type { HTMLAttributes, ReactNode } from "react"

type MainLayoutProps = {
    children: ReactNode
} & HTMLAttributes<HTMLElement>

export default function MainLayout({children, ...params}: MainLayoutProps) {
    return (
        <main className="flex justify-center" {...params}>
            <div className="w-[1260px] md:w-full">
                {children}
            </div>
        </main>
    )
}