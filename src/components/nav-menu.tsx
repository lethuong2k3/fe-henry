import { useIsMobile } from "@/hooks/use-mobile"
import { 
    NavigationMenu, 
    NavigationMenuContent, 
    NavigationMenuItem, 
    NavigationMenuLink, 
    NavigationMenuList, 
    NavigationMenuTrigger, 
    navigationMenuTriggerStyle 
} from "./ui/navigation-menu"
import { ModeToggle } from "./mode-toggle"
import { Link } from "react-router-dom"
import Logo from "@/assets/logo-henry.png"

export default function NavigationHeader() {
    const isMobile = useIsMobile()
    return (
        <div className="flex justify-between font-[700] ml-[20px] mr-[20px]">
            <Link to={"/"} className="flex justify-center items-center gap-3">
                <img src={Logo} className=" w-[80px] h-[60px]" />
                <p className="uppercase text-[22px] text-[#4CC36F]">uncle henry</p>
            </Link>
            <NavigationMenu viewport={isMobile}>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                            <Link to={'/'}>Trang chủ</Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem className="hidden md:block z-1">
                        <NavigationMenuTrigger><Link to={'/#'}>Khóa học IELTS</Link></NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                                <Link to={'/#'}>Gói chấm bài Writing</Link>
                            </NavigationMenuLink>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                            <Link to={'/#'}>Hall of fame</Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                            <Link to={'/#'}>IELTS Writing</Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                            <Link to={'/#'}>IELTS Reading</Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                            <Link to={'/#'}>IELTS Listening</Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                            <Link to={'/#'}>IELTS Speaking</Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    <ModeToggle />
                </NavigationMenuList>
        </NavigationMenu>
        </div>
    )
}