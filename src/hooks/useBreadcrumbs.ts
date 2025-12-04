import { useLocation } from "react-router-dom"

export function useBreadcrumbs() {
  const location = useLocation()
  const pathnames = location.pathname.split("/").filter(Boolean)

  const crumbs = pathnames.map((value, index) => {
    const to = "/" + pathnames.slice(0, index + 1).join("/")

    return {
      label: value.charAt(0).toUpperCase() + value.slice(1),
      to,
      isLast: index === pathnames.length - 1,
    }
  })

  return crumbs
}
