import { ThemeProvider } from "@/components/theme-provider"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { publicRouters } from "./routers/routers"

function App() {
  return (
     <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <BrowserRouter>
          <Routes>
            {publicRouters.map((item, index) => {
              return <Route path={item.path} element={<item.components />} key={index} />
            })}
          </Routes>
        </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
