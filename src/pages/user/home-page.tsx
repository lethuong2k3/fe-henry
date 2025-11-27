import BannerAlert from "@/components/banner-alert";
import BannerHome from "@/components/banner-home";
import NavigationHeader from "@/components/nav-menu";

export default function HomePage() {
    return (
        <>
            <NavigationHeader />
            <BannerHome />
            <BannerAlert />
        </>
    )
}