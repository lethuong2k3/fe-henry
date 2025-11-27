import { useAuth } from "@/contexts/auth-context";
import type { ReactNode } from "react";
import { Navigate, Outlet } from "react-router-dom";

interface PrivateRouteProps {
    children?: ReactNode
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({children}) => {
    const {isAuthenticated} = useAuth();
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }
    return children ? <>{children}</> : <Outlet />
}

export default PrivateRoute