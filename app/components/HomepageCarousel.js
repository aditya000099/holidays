"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function HomepageCarousel() {
  const slides = [
    {
      image: "/tm.jpg",
      country: "thailand",
    },
    {
      image: "/tungnath.jpg",
      country: "india",
    },
    {
      image: "/mun.jpg",
      country: "india",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 20000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const handleCarouselClick = () => {
    router.push(`/countries/India`);
  };

  return (
    <section className="relative overflow-hidden mb-12">
      <div
        ref={carouselRef}
        className="flex rounded transition-opacity duration-1000 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)`, opacity: 1 }}
      >
        {slides.map((slide, index) => (
          <div key={index} className="w-full flex-shrink-0 relative">
            <div className="absolute inset-0 bg-black opacity-20"></div>
            <Image
              className="w-full h-[60vh] sm:h-[90vh] object-cover duration-1000 ease-in-out"
              src={slide.image}
              alt="India"
              width={12000}
              height={12000}
              style={{ opacity: index === currentSlide ? 1 : 0 }}
              onClick={() => handleCarouselClick()}
            />
            {/* <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white p-4 w-fit text-center">
              <div className=" bg-opacity-50 rounded-md p-4">
                <h2 className="text-xl sm:text-5xl  font-bold font-sans">
                  Explore | Customize | Travel
                </h2>
              </div>
            </div> */}
          </div>
        ))}
      </div>
    </section>
  );
}

// "use client";

// import Image from "next/image";
// import { useState, useEffect, useRef } from "react";
// import { useRouter } from "next/navigation";

// export default function HomepageCarousel() {
//   const slides = [
//     {
//       image: "/tm.jpg",
//       country: "thailand",
//     },
//     {
//       image: "/tungnath.jpg",
//       country: "india",
//     },
//     {
//       image: "/mun.jpg",
//       country: "australia",
//     },
//   ];

//   const [currentSlide, setCurrentSlide] = useState(0);
//   const router = useRouter();

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
//     }, 10000);
//     return () => clearInterval(interval);
//   }, [slides.length]);

//   const handleCarouselClick = () => {
//     router.push(`/countries/India`);
//   };

//   return (
//     <section className="relative overflow-hidden mb-12">
//       <div className="relative w-full h-full sm:h-[90vh] object-cover">
//         {slides.map((slide, index) => (
//           <div
//             key={index}
//             className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
//             style={{ opacity: index === currentSlide ? 1 : 0 }}
//             onClick={() => handleCarouselClick()}
//           >
//             {/* Add 10% black film here with an empty div*/}
//             <div className="absolute inset-0 bg-black opacity-10"></div>
//             <Image
//               className="w-full h-full sm:h-[90vh] object-cover"
//               src={slide.image}
//               alt="India"
//               width={12000}
//               height={12000}
//               style={{ objectFit: "cover" }}
//               onClick={() => handleCarouselClick()}
//             />
//             <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white p-4 w-fit text-center">
//               <div className=" bg-opacity-50 rounded-md p-4">
//                 <h2 className="text-xl sm:text-5xl font-medium">
//                   Explore | Customise | Travel
//                 </h2>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }
