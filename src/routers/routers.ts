import { lazy } from 'react'

interface RouteProps {
    path: string
    components: React.LazyExoticComponent<React.ComponentType<any>>
}

const publicRouters: RouteProps[] = [
    {
        path: "/",
        components: lazy(() => import("@/pages/user/home-page"))
    },
]

const privateRouters: RouteProps[] = [
    {
         path: "/dashboard",
         components: lazy(() => import("@/pages/admin/DashBoard"))
    },
     {
         path: "/admin-blogs",
         components: lazy(() => import("@/pages/admin/Blog"))
    }
]

export {publicRouters, privateRouters}