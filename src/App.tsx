import { ThemeProvider } from "@/contexts/theme-provider"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { privateRouters, publicRouters } from "./routers/routers"
import { AuthProvider } from "./contexts/auth-context"
import PrivateRoute from "./routers/private-route"
import { PublicRoute } from "./routers/public-route"
import LoginPage from "./pages/login"
import AdminLayout from "./pages/admin"
import { Toaster } from "sonner"
import { LayoutProvider } from "./contexts/layout-provider"

function App() {
  return (
     <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <BrowserRouter>
          
          <Toaster position="top-right" />
          <AuthProvider>
              <LayoutProvider>

              <Routes>
                <Route path="/login" element={
                  <PublicRoute>
                    <LoginPage />
                  </PublicRoute>
                } />
                {publicRouters.map((item, index) => {
                  return <Route path={item.path} element={<item.components />} key={index} />
                })}
                <Route
                element={
                  <PrivateRoute>
                      <AdminLayout />
                  </PrivateRoute>
                }
              >
                {privateRouters.map((item, index) => (
                  <Route
                    path={item.path}
                    element={<item.components />}
                    key={index}
                  />
                ))}
              </Route>
            </Routes>
              </LayoutProvider>
          </AuthProvider>
        </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
