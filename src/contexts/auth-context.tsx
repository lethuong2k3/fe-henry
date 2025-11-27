import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import  Cookie from "js-cookie";
import { infoAPI } from "@/service/auth-service";
import type { InfoResponse } from "@/interfaces/auth";

interface AuthContextType {
    isAuthenticated: boolean
    login: () => void
    logout: () => void
    user: InfoResponse | null
    setUser:  React.Dispatch<React.SetStateAction<InfoResponse | null>>
    setIsAuThenticated:  React.Dispatch<React.SetStateAction<boolean>>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: ReactNode}> = ({children}) => {
    const [isAuthenticated, setIsAuThenticated] = useState<boolean>(!!Cookie.get('token'));
    const [user, setUser] = useState<InfoResponse | null>(null);
    const login = () => setIsAuThenticated(true);
    const logout = () => setIsAuThenticated(false);
    const value = {
        isAuthenticated,
        login,
        logout,
        user,
        setUser,
        setIsAuThenticated
    }
    const fetchUserInfo = async () => {
      try {
        const info = await infoAPI(); 
        setUser(info);      
      } catch (error) {
        console.log("User not logged in");
        setUser(null);
      }
    };
    useEffect(() => {
         if (isAuthenticated) fetchUserInfo();
    }, [isAuthenticated])
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}