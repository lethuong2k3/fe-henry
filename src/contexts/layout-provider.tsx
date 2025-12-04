import { createContext, useContext, useState } from "react"
import Cookies from "js-cookie"

export type Collapsible = "offcanvas" | "icon" | "none"
export type Variant = "inset" | "sidebar" | "floating"

// Cookie names
const LAYOUT_COLLAPSIBLE_COOKIE_NAME = "layout_collapsible"
const LAYOUT_VARIANT_COOKIE_NAME = "layout_variant"

// 7 days (js-cookie uses days)
const COOKIE_EXPIRES_DAYS = 7

// Defaults
const DEFAULT_VARIANT: Variant = "inset"
const DEFAULT_COLLAPSIBLE: Collapsible = "icon"

type LayoutContextType = {
  resetLayout: () => void

  defaultCollapsible: Collapsible
  collapsible: Collapsible
  setCollapsible: (collapsible: Collapsible) => void

  defaultVariant: Variant
  variant: Variant
  setVariant: (variant: Variant) => void
}

const LayoutContext = createContext<LayoutContextType | null>(null)

type LayoutProviderProps = {
  children: React.ReactNode
}

export function LayoutProvider({ children }: LayoutProviderProps) {
  const [collapsible, _setCollapsible] = useState<Collapsible>(() => {
    const saved = Cookies.get(LAYOUT_COLLAPSIBLE_COOKIE_NAME)
    return (saved as Collapsible) || DEFAULT_COLLAPSIBLE
  })

  const [variant, _setVariant] = useState<Variant>(() => {
    const saved = Cookies.get(LAYOUT_VARIANT_COOKIE_NAME)
    return (saved as Variant) || DEFAULT_VARIANT
  })

  const setCollapsible = (value: Collapsible) => {
    _setCollapsible(value)
    Cookies.set(LAYOUT_COLLAPSIBLE_COOKIE_NAME, value, {
      expires: COOKIE_EXPIRES_DAYS
    })
  }

  const setVariant = (value: Variant) => {
    _setVariant(value)
    Cookies.set(LAYOUT_VARIANT_COOKIE_NAME, value, {
      expires: COOKIE_EXPIRES_DAYS
    })
  }

  const resetLayout = () => {
    setCollapsible(DEFAULT_COLLAPSIBLE)
    setVariant(DEFAULT_VARIANT)
  }

  const contextValue: LayoutContextType = {
    resetLayout,
    defaultCollapsible: DEFAULT_COLLAPSIBLE,
    collapsible,
    setCollapsible,
    defaultVariant: DEFAULT_VARIANT,
    variant,
    setVariant
  }

  return (
    <LayoutContext.Provider value={contextValue}>
      {children}
    </LayoutContext.Provider>
  )
}

export function useLayout() {
  const context = useContext(LayoutContext)
  if (!context) throw new Error("useLayout must be used within a LayoutProvider")
  return context
}
