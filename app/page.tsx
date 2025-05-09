"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface WorkItem {
  _id: string;
  title: string;
  category: string;
  description: string;
  image: {
    url: string;
    width: number;
    height: number;
  };
}

export default function Home() {
  const containerRef = useRef(null);
  const [featuredWorks, setFeaturedWorks] = useState<WorkItem[]>([]);
  const [loading, setLoading] = useState(true);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  useEffect(() => {
    const fetchFeaturedWorks = async () => {
      try {
        const response = await fetch("/api/works?page=1&limit=3");
        if (!response.ok) {
          throw new Error("Failed to fetch featured works");
        }
        const data = await response.json();
        setFeaturedWorks(data.works);
      } catch (error) {
        console.error("Error fetching featured works:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedWorks();
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {/* Hero Section */}
      <motion.section
        className="h-[95vh] relative flex items-center justify-center overflow-hidden"
        style={{ opacity, scale }}
      >
        <div className="absolute inset-0 z-0">
          <Image
            src="/static_home.jpg"
            alt="Featured artwork"
            fill
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
            quality={90}
            className="object-cover md:object-center object-top opacity-70"
          />
        </div>
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6 text-black"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Capturing Moments in Art
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl mb-8 text-black/90"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            A visual journey through photography and artistic expression
          </motion.p>
          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90"
            >
              <Link href="/work">
                Explore Work <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div> */}
        </div>
      </motion.section>

      {/* Featured Work Section */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
          Featured Work
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading
            ? // Loading skeletons
              Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="aspect-square bg-gray-200 animate-pulse rounded-lg"
                />
              ))
            : featuredWorks.map((work, index) => (
                <motion.div
                  key={work._id}
                  className="group relative overflow-hidden rounded-lg aspect-square"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  whileHover={{ scale: 1.03 }}
                >
                  <Image
                    src={work.image.url}
                    alt={work.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">
                        {work.title}
                      </h3>
                      <p className="text-white/80">{work.category}</p>
                      <p className="text-white/60 line-clamp-2 mt-1">
                        {work.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
        </div>
        <div className="text-center mt-12">
          <Button variant="outline" asChild size="lg">
            <Link href="/work">View All Work</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
