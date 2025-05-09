"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  X,
  Download,
} from "lucide-react";

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
  height: number;
  loading?: boolean;
}

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
  totalPages: number;
}

export default function WorkPage() {
  const [works, setWorks] = useState<WorkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedWork, setSelectedWork] = useState<WorkItem | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const observerTarget = useRef<HTMLDivElement>(null);

  const handleImageLoad = (workId: string) => {
    setLoadedImages((prev) => new Set([...prev, workId]));
  };

  const fetchWorks = async (pageNum: number) => {
    try {
      const response = await fetch(`/api/works?page=${pageNum}&limit=12`);
      if (!response.ok) {
        throw new Error("Failed to fetch works");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching works:", error);
      throw error;
    }
  };

  const loadMoreWorks = async () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    try {
      const nextPage = page + 1;
      const data = await fetchWorks(nextPage);

      if (data.works.length === 0) {
        setHasMore(false);
        return;
      }

      setWorks((prev) => [...prev, ...data.works]);
      setPage(nextPage);
      setHasMore(data.page < data.totalPages);
    } catch (error) {
      setError("Failed to load more works");
    } finally {
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          loadMoreWorks();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoadingMore]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const initialLoad = async () => {
      try {
        const data = await fetchWorks(1);
        setWorks(data.works);
        setHasMore(data.page < data.totalPages);
      } catch (error) {
        setError("Failed to load works");
      } finally {
        setLoading(false);
      }
    };

    initialLoad();
  }, []);

  const handleWorkSelect = (work: WorkItem) => {
    const index = works.findIndex((w) => w._id === work._id);
    setCurrentIndex(index);
    setSelectedWork(work);
  };

  const handlePrevious = () => {
    const newIndex = (currentIndex - 1 + works.length) % works.length;
    setCurrentIndex(newIndex);
    setSelectedWork(works[newIndex]);
  };

  const handleNext = () => {
    const newIndex = (currentIndex + 1) % works.length;
    setCurrentIndex(newIndex);
    setSelectedWork(works[newIndex]);
  };

  const handleClose = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
    setSelectedWork(null);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!selectedWork) return;

    switch (e.key) {
      case "ArrowLeft":
        handlePrevious();
        break;
      case "ArrowRight":
        handleNext();
        break;
      case "Escape":
        handleClose();
        break;
    }
  };

  useEffect(() => {
    if (selectedWork) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [selectedWork, currentIndex]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleDownload = async () => {
    if (!selectedWork) return;

    try {
      const response = await fetch(selectedWork.image.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${selectedWork.title
        .toLowerCase()
        .replace(/\s+/g, "-")}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-[2400px] mx-auto px-4 pb-12">
      {/* <motion.h1
        className="text-4xl font-bold mb-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        My Work
      </motion.h1> */}

      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {works.map((work, index) => (
          <motion.div
            key={work._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="break-inside-avoid relative group cursor-pointer"
            onClick={() => handleWorkSelect(work)}
          >
            <div className="relative">
              {!loadedImages.has(work._id) && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg" />
              )}
              <Image
                src={work.image.url}
                alt={work.title}
                width={work.image.width}
                height={work.image.height}
                className={`w-full h-auto rounded-lg transition-opacity duration-300 ${
                  loadedImages.has(work._id) ? "opacity-100" : "opacity-0"
                }`}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1536px) 33vw, 25vw"
                onLoad={() => handleImageLoad(work._id)}
                priority={index < 4}
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-xl font-semibold text-white mb-1">
                    {work.title}
                  </h3>
                  <p className="text-sm text-white/80">{work.category}</p>
                  <p className="text-sm text-white/60 line-clamp-2 mt-1">
                    {work.description}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Observer target for infinite scroll */}
      <div ref={observerTarget} className="h-10 w-full">
        {isLoadingMore && (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedWork && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-4xl w-full max-h-[90vh]"
            >
              <div className="relative">
                <Image
                  src={selectedWork.image.url}
                  alt={selectedWork.title}
                  width={selectedWork.image.width}
                  height={selectedWork.image.height}
                  className="w-full h-auto rounded-lg"
                  style={{ maxHeight: "90vh" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg">
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {selectedWork.title}
                    </h3>
                    <p className="text-lg text-white/80 mb-2">
                      {selectedWork.category}
                    </p>
                    <p className="text-base text-white/70">
                      {selectedWork.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="fixed bottom-4 left-0 right-0 flex justify-center gap-4 sm:hidden z-50">
                <button
                  className="text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors"
                  onClick={handlePrevious}
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  className="text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors"
                  onClick={handleNext}
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </div>

              {/* Desktop Navigation Controls */}
              <button
                className="hidden sm:flex fixed left-4 top-1/2 -translate-y-1/2 text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors z-50 md:left-8 lg:left-12"
                onClick={handlePrevious}
              >
                <ChevronLeft className="h-6 w-6 md:h-8 md:w-8" />
              </button>
              <button
                className="hidden sm:flex fixed right-4 top-1/2 -translate-y-1/2 text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors z-50 md:right-8 lg:right-12"
                onClick={handleNext}
              >
                <ChevronRight className="h-6 w-6 md:h-8 md:w-8" />
              </button>

              {/* Action Controls */}
              <div className="fixed top-4 right-4 flex gap-2 z-50 md:top-8 md:right-8 lg:top-12 lg:right-12">
                <button
                  className="text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors"
                  onClick={handleDownload}
                  title="Download image"
                >
                  <Download className="h-5 w-5 md:h-6 md:w-6" />
                </button>
                <button
                  className="text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors"
                  onClick={toggleFullscreen}
                >
                  {isFullscreen ? (
                    <Minimize2 className="h-5 w-5 md:h-6 md:w-6" />
                  ) : (
                    <Maximize2 className="h-5 w-5 md:h-6 md:w-6" />
                  )}
                </button>
                <button
                  className="text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors"
                  onClick={handleClose}
                >
                  <X className="h-5 w-5 md:h-6 md:w-6" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
