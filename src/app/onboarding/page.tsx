"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Sparkles, Users, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const SLIDES = [
    {
        id: 1,
        title: "Kelola Komsel",
        subtitle: "Dengan Mudah",
        description: "Jadwal, absensi, dan koordinasi tim dalam satu aplikasi yang simpel.",
        icon: Sparkles,
        image: "/images/onboarding/slide-1.png",
        gradient: "from-amber-50 via-orange-50 to-rose-50",
    },
    {
        id: 2,
        title: "Seru-seruan",
        subtitle: "Bareng",
        description: "Roda undian, tebak kata, dan aktivitas seru untuk komsel yang lebih hidup.",
        icon: Users,
        image: "/images/onboarding/slide-2.png",
        gradient: "from-cyan-50 via-teal-50 to-emerald-50",
    },
    {
        id: 3,
        title: "Tumbuh",
        subtitle: "Bersama",
        description: "Pantau pertumbuhan rohani dan bangun komunitas yang saling mendukung.",
        icon: Heart,
        image: "/images/onboarding/slide-3.png",
        gradient: "from-violet-50 via-purple-50 to-fuchsia-50",
    },
];

export default function OnboardingPage() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isScrolling, setIsScrolling] = useState(false);

    // Handle scroll snap detection
    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;

        let scrollTimeout: NodeJS.Timeout;

        const handleScroll = () => {
            setIsScrolling(true);
            clearTimeout(scrollTimeout);

            scrollTimeout = setTimeout(() => {
                setIsScrolling(false);
                const scrollLeft = container.scrollLeft;
                const slideWidth = container.offsetWidth;
                const newSlide = Math.round(scrollLeft / slideWidth);
                setCurrentSlide(newSlide);
            }, 100);
        };

        container.addEventListener("scroll", handleScroll);
        return () => {
            container.removeEventListener("scroll", handleScroll);
            clearTimeout(scrollTimeout);
        };
    }, []);

    const goToSlide = (index: number) => {
        const container = scrollRef.current;
        if (!container) return;
        container.scrollTo({
            left: index * container.offsetWidth,
            behavior: "smooth",
        });
        setCurrentSlide(index);
    };

    const CurrentIcon = SLIDES[currentSlide].icon;

    return (
        <main className="min-h-screen flex flex-col bg-white relative overflow-hidden">
            {/* Animated Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${SLIDES[currentSlide].gradient} transition-all duration-700`} />

            {/* Skip Button */}
            <div className="absolute top-6 right-6 z-20">
                <Link href="/login">
                    <Button variant="ghost" className="text-neutral-500 hover:text-neutral-700 text-sm">
                        Lewati
                    </Button>
                </Link>
            </div>

            {/* Carousel Container */}
            <div
                ref={scrollRef}
                className="flex-1 flex overflow-x-auto snap-x snap-mandatory scrollbar-hide relative z-10"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
                {SLIDES.map((slide, index) => (
                    <div
                        key={slide.id}
                        className="min-w-full h-full flex flex-col items-center justify-center px-8 snap-center"
                    >
                        {/* Illustration */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="w-64 h-64 md:w-80 md:h-80 relative mb-8"
                        >
                            <Image
                                src={slide.image}
                                alt={slide.title}
                                fill
                                className="object-contain"
                                priority={index === 0}
                            />
                        </motion.div>

                        {/* Content */}
                        <div className="text-center max-w-sm">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3 }}
                                className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/60 backdrop-blur-sm rounded-full mb-4"
                            >
                                <slide.icon className="w-4 h-4 text-indigo-600" />
                                <span className="text-xs font-medium text-indigo-600">
                                    {index + 1} dari 3
                                </span>
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-3xl md:text-4xl font-bold text-neutral-900 leading-tight mb-2"
                            >
                                {slide.title}
                                <br />
                                <span className="text-indigo-600">{slide.subtitle}</span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="text-neutral-600 text-base leading-relaxed"
                            >
                                {slide.description}
                            </motion.p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom Controls */}
            <div className="relative z-10 px-8 pb-12 pt-4">
                {/* Dot Indicators */}
                <div className="flex justify-center gap-2 mb-6">
                    {SLIDES.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`transition-all duration-300 rounded-full ${currentSlide === index
                                    ? "w-8 h-2 bg-indigo-600"
                                    : "w-2 h-2 bg-neutral-300 hover:bg-neutral-400"
                                }`}
                        />
                    ))}
                </div>

                {/* CTA Button */}
                <AnimatePresence mode="wait">
                    {currentSlide === SLIDES.length - 1 ? (
                        <motion.div
                            key="start"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <Link href="/login" className="block">
                                <Button
                                    size="lg"
                                    className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-2xl text-base shadow-lg shadow-indigo-200"
                                >
                                    Mulai Sekarang
                                    <ChevronRight className="w-5 h-5 ml-1" />
                                </Button>
                            </Link>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="next"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <Button
                                size="lg"
                                onClick={() => goToSlide(currentSlide + 1)}
                                className="w-full h-14 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold rounded-2xl text-base"
                            >
                                Lanjut
                                <ChevronRight className="w-5 h-5 ml-1" />
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
}
