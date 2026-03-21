import { useState, useEffect, useRef } from "react";
import CaraouselDaaji1 from "url:../Images/Caraousel-Daaji-1 Upscaled.png"; 
import CaraouselDaaji2 from "url:../Images/Caraousel-Daaji-2.jpg"; 

const slides = [
    {
        image: CaraouselDaaji1,
        title: "Daaji1",
    },
    {
        image: CaraouselDaaji2,
        title: "Daaji2",
    },
];

const Carousel = () => {
    const [current, setCurrent] = useState(0);
    const touchStartX = useRef(null);
    const touchEndX = useRef(null);

    const nextSlide = () => {
        setCurrent((prev) => (prev+1) % slides.length);
    };

    const prevSlide = () => {
        setCurrent((prev) =>
            prev === 0 ? slides.length-1 : prev -1 
        );
    }

    useEffect(() => {
        const interval = setInterval(nextSlide, 4000);
        return () => clearInterval(interval);
    }, []);

    const handleTouchStart = (e) => {
        touchStartX.current = e.targetTouches[0].clientX;
    }

    const handleTouchMove = (e) => {
        touchEndX.current = e.targetTouches[0].clientX;
    };

    const handleTouchEnd = () => {
        if (!touchStartX.current || !touchEndX.current) return;
        
        const distance = touchStartX.current - touchEndX.current;

        if (distance > 50) nextSlide();
        if (distance < -50) prevSlide();
    };

    return (
        <div 
            className="relative w-full h-[55vh] md:h-[75vh] overflow-hidden "
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            {slides.map((slide, index) => (
                <img
                    key={index}
                    src={slide.image}
                    alt={slide.title}
                    className={`absolute top-0 left-0 w-full h-full object-cover object-center transition-transform duration-500 ${
                        index === current
                         ? "translate-x-0"
                         : index < current
                         ? "-translate-x-full"
                         : "translate-x-full"
                    }`}
         />
      ))}

      <button
        onClick={prevSlide}
        className="hidden md:block absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 text-white px-3 py-2 rounded"
      >
        ❮
      </button>

      <button
        onClick={nextSlide}
        className="hidden md:block absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 text-white px-3 py-2 rounded"
      >
        ❯
      </button>

      <div className="absolute bottom-4 w-full flex justify-center gap-2">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full ${
              index === current ? "bg-white" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
    