import React from "react";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
import Autoplay from "embla-carousel-autoplay"

import { Skeleton } from "./ui/skeleton";

export default function BannerCarousel({data, isLoading}: {data: any[], isLoading: boolean}) {
    const plugin = React.useRef(
        Autoplay({delay: 5000, stopOnInteraction: true})
    )
    return (
        <Carousel plugins={[plugin.current]} className="w-full">
            <CarouselContent>
                {data.map(item => (
                    <CarouselItem key={item.id}>
                          {isLoading ? 
                          (<Skeleton className="w-full aspect-square" />
                            ) : (
                                <img
                                src={item.imageUrl}
                                 alt={item.title}
                                 className="w-full aspect-square object-cover rounded-md"
                                            />
                         )}
                    </CarouselItem>
                ))}
            </CarouselContent>
        </Carousel>
    )
}