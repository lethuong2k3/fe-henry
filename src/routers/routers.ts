import { lazy } from 'react'

interface PublicRoute {
    path: string
    components: React.LazyExoticComponent<React.ComponentType<any>>
}

const publicRouters: PublicRoute[] = [
    {
        path: "/",
        components: lazy(() => import("@/pages/HomePage/HomePage"))
    }
]

export {publicRouters}