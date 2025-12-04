import { Link } from 'react-router-dom'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import Logo from '@/assets/logo-henry.png'

export function AppTitle() {
  const { setOpenMobile } = useSidebar()
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="gap-0 py-0 hover:bg-transparent active:bg-transparent"
          asChild
        >
          <div className="relative flex items-center justify-between">
             <div className='mr-2 text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg'>
                <img src={Logo}  />
            </div>
            <Link
              to="/"
              onClick={() => setOpenMobile(false)}
              className="grid flex-1 text-start text-sm leading-tight"
            >
              <span className="truncate font-medium">Uncle Henry</span>
              <span className="truncate text-xs">Enterprise</span>
            </Link>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

