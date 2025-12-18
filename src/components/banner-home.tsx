import { motion } from "motion/react"
import Logo from "@/assets/logo-henry.png"
import { CircleArrowRight } from "lucide-react"
import { Button } from "./ui/button"
import { useEffect, useState } from "react"
import { getBlogsByActive } from "@/service/blog-service";
import BannerCarousel from "./banner-carousel"

export default function BannerHome() {
    const [blogs, setBlogs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        setIsLoading(true)
        getBlogsByActive().then(res => {
            setBlogs(res);
            setIsLoading(false)
        }).catch(err => {
            console.log(err);
            setIsLoading(false)
        })
    }, [])
    return (
        <div className="relative text-center bg-[#00D26A] text-white py-16 px-6 overflow-hidden">
            {/* Cột bên trái có text và nút */}
           <div className="flex items-center justify-between mx-40">
                <motion.div
                    className="flex flex-col items-center"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1.0, ease: "easeOut", delay: 0.2}}
                >
                    <div className="text-base font-semibold tracking-wider mb-4">
                        UNCLE <br /> HENRY
                    </div>

                    <h2 className="text-3xl sm:text-3xl font-bold mb-3">
                        #Nhà Uncle Henry
                    </h2>

                    <p className="text-base sm:text-1xl font-medium mb-4 drop-shadow-md w-[400px] text-justify">
                        Dự án gia sư với bộ Tutors trẻ nhất Việt Nam, đạt 8.0 - 8.5 - 9.0 các skills đảm nhiệm,
                        có lượng feedback điểm Writing 6.5 - 8.0 cao nhất Việt Nam, có con mèo làm mascot đầu tiên ở Việt Nam.
                    </p>

                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <Button size="lg" variant="secondary" className="text-[16px] font-[500] cursor-pointer flex items-center gap-2">
                            <CircleArrowRight size={40} />
                            Đăng ký học
                        </Button>
                    </motion.div>

                    <motion.img
                        src={Logo}
                        className="w-40 sm:w-45 mt-10 drop-shadow-xl"
                        animate={{
                            y: [0, -10, 0],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                </motion.div>
                <motion.span
                    className="absolute top-10 left-10 text-yellow-300 text-3xl"
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >   ★
                </motion.span>
                <motion.span
                    className="absolute top-10 right-20 text-yellow-300 text-4xl"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                >   ★
                </motion.span>
                <motion.span
                    className="absolute bottom-16 right-12 text-yellow-300 text-3xl"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 3, repeat: Infinity }}
                >   ★
                </motion.span>
                <motion.span
                    className="absolute bottom-24 left-20 text-yellow-200 text-2xl"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 2.2, repeat: Infinity }}
                >   ★
                </motion.span>
                {/* Cột bên phải (placeholder) */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1.0, ease: "easeOut", delay: 0.2 }}
                    className="w-[37%]"
                >
                    <BannerCarousel data={blogs} isLoading={isLoading} />
                </motion.div>
           </div>
        </div>
    )
}
