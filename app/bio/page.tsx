"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Award, Calendar, MapPin, User } from "lucide-react";
import { useAdmin } from "../context/AdminContext";

interface AdminDetails {
  email: string;
  phone: string;
  bannerImage: string;
}

export default function BioPage() {
  const { adminDetails, loading } = useAdmin();
  const [scrollY, setScrollY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle scroll for header transparency effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Parallax effect for hero image
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.5]);

  return (
    <div className="min-h-screen" ref={containerRef}>
      {/* Hero Section with Artist Portrait */}
      <div className="relative h-[80vh] md:h-[90vh] overflow-hidden">
        <motion.div
          className="absolute inset-0 z-0"
          style={{ y, opacity }}
          initial={{ y: 0 }}
        >
          {loading ? (
            <div className="w-full h-full bg-accent/20 animate-pulse" />
          ) : adminDetails?.bannerImage ? (
            <Image
              src={adminDetails.bannerImage.url}
              alt="Artist Portrait"
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          ) : (
            <Image
              src="/placeholder.svg?height=1080&width=1920&text=Artist+Portrait"
              alt="Artist Portrait"
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-background/10" />
        </motion.div>

        <div className="relative z-10 h-full flex flex-col justify-end p-6 md:p-12 lg:p-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 drop-shadow-lg">
              About the Artist
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl drop-shadow-md">
              Visual storyteller exploring the boundaries between reality and
              perception.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Artist Statement Section */}
      <section className="py-16 md:py-24 px-4 md:px-8 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            Artist Statement
          </h2>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p>
              My work explores the intersection of light, form, and human
              experience. Through photography and digital manipulation, I seek
              to reveal the extraordinary within the ordinary, capturing moments
              that might otherwise go unnoticed.
            </p>
            <p>
              Influenced by both classical composition and contemporary visual
              culture, my aesthetic balances technical precision with emotional
              resonance. Each image is an invitation to pause, to look more
              deeply, and to discover new perspectives on familiar subjects.
            </p>
            <p>
              I believe in the power of visual storytelling to bridge divides
              and create connections. Whether documenting urban landscapes or
              creating abstract compositions, my goal remains the same: to
              create work that resonates on both intellectual and emotional
              levels.
            </p>
          </div>
        </motion.div>

        {/* Background Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Background</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start">
                <User className="w-5 h-5 mt-1 mr-4 text-primary" />
                <div>
                  <h3 className="font-medium text-lg">Education</h3>
                  <p className="text-muted-foreground">
                    MFA in Photography, School of Visual Arts
                  </p>
                  <p className="text-muted-foreground">
                    BA in Fine Arts, Rhode Island School of Design
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <MapPin className="w-5 h-5 mt-1 mr-4 text-primary" />
                <div>
                  <h3 className="font-medium text-lg">Based in</h3>
                  <p className="text-muted-foreground">
                    New York City, with projects throughout North America and
                    Europe
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex items-start">
                <Calendar className="w-5 h-5 mt-1 mr-4 text-primary" />
                <div>
                  <h3 className="font-medium text-lg">
                    Professional Experience
                  </h3>
                  <p className="text-muted-foreground">
                    15+ years working in fine art and commercial photography
                  </p>
                  <p className="text-muted-foreground">
                    Former artist-in-residence at the International Center of
                    Photography
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Award className="w-5 h-5 mt-1 mr-4 text-primary" />
                <div>
                  <h3 className="font-medium text-lg">Recognition</h3>
                  <p className="text-muted-foreground">
                    Recipient of the National Photography Award, 2022
                  </p>
                  <p className="text-muted-foreground">
                    Featured in Communication Arts Annual, 2021
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Exhibitions Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            Selected Exhibitions
          </h2>
          <div className="space-y-8">
            {[
              {
                year: "2023",
                title: "Liminal Spaces",
                venue: "Museum of Contemporary Photography, Chicago",
                description:
                  "Solo exhibition exploring transitional urban environments",
              },
              {
                year: "2022",
                title: "Light & Form",
                venue: "Gallery of Modern Art, New York",
                description:
                  "Group exhibition featuring contemporary photographers",
              },
              {
                year: "2021",
                title: "Digital Frontiers",
                venue: "International Center of Photography, New York",
                description:
                  "Exhibition showcasing innovative approaches to digital image-making",
              },
            ].map((exhibition, index) => (
              <motion.div
                key={index}
                className="border-l-2 border-primary pl-6 py-2"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-sm text-primary font-medium mb-1">
                  {exhibition.year}
                </div>
                <h3 className="text-xl font-semibold mb-1">
                  {exhibition.title}
                </h3>
                <div className="text-muted-foreground mb-2">
                  {exhibition.venue}
                </div>
                <p>{exhibition.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Artistic Style Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            Artistic Style
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Composition",
                description:
                  "Emphasis on strong geometric forms and balanced asymmetry, drawing influence from architectural principles and classical painting.",
              },
              {
                title: "Color & Light",
                description:
                  "Characterized by high contrast and selective color palettes, often employing dramatic lighting to create mood and direct attention.",
              },
              {
                title: "Subject Matter",
                description:
                  "Focused on the intersection of natural and built environments, human presence within spaces, and moments of unexpected beauty.",
              },
            ].map((style, index) => (
              <motion.div
                key={index}
                className="p-6 rounded-lg bg-accent/50"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                viewport={{ once: true }}
              >
                <h3 className="text-xl font-semibold mb-3">{style.title}</h3>
                <p className="text-muted-foreground">{style.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
}
