import { useIsMobile } from "@/hooks/use-mobile"
import { useTranslation } from "react-i18next"
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
import LanguagesSelect from "./languages-select"

export default function NavigationHeader() {
    const {t} = useTranslation()
    const isMobile = useIsMobile()
    return (
        <div className="flex justify-between font-[600] ml-[20px] mr-[20px]">
            <Link to={"/"} className="flex justify-center items-center gap-2">
                <img src={Logo} className=" w-[80px] h-[60px]" />
                <p className="uppercase text-[22px]" style={{color: '#4CC36F'}}>uncle henry</p>
            </Link>
            <NavigationMenu viewport={isMobile}>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                            <Link to={'/'}>{t('home')}</Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem className="hidden md:block">
                        <NavigationMenuTrigger><Link to={'/#'}>{t('ielts_courses')}</Link></NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                                <Link to={'/#'}>{t('writing_essays_marking')}</Link>
                            </NavigationMenuLink>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                            <Link to={'/#'}>{t('hall_of_fame')}</Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                            <Link to={'/#'}>{t('ielts_writing')}</Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                            <Link to={'/#'}>{t('ielts_reading')}</Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                            <Link to={'/#'}>{t('ielts_listening')}</Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                            <Link to={'/#'}>{t('ielts_speaking')}</Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    <LanguagesSelect />
                    <ModeToggle />
                </NavigationMenuList>
        </NavigationMenu>
        </div>
    )
}