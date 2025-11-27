import i18n from "@/i18";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

export default function LanguagesSelect () {
    return (
        <Select value={i18n.language} onValueChange={i18n.changeLanguage}>
            <SelectTrigger className="w-[130px] font-[500]">
                <SelectValue placeholder="Chọn ngôn ngữ" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectItem value="vi">Tiếng Việt</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}