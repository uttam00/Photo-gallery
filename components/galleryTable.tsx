"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";
import { Trash2, ChevronLeft, ChevronRight } from "lucide-react";

interface Gallery {
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

interface WorksResponse {
  works: Gallery[];
  total: number;
  page: number;
  totalPages: number;
}

function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <TableRow key={index}>
          <TableCell>
            <div className="w-16 h-16 bg-accent/20 rounded-md animate-pulse" />
          </TableCell>
          <TableCell>
            <div className="h-4 w-32 bg-accent/20 rounded animate-pulse" />
          </TableCell>
          <TableCell>
            <div className="h-4 w-24 bg-accent/20 rounded animate-pulse" />
          </TableCell>
          <TableCell>
            <div className="h-4 w-48 bg-accent/20 rounded animate-pulse" />
          </TableCell>
          <TableCell className="text-right">
            <div className="h-8 w-8 bg-accent/20 rounded animate-pulse ml-auto" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

export default function GalleryTable() {
  const [images, setImages] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [workToDelete, setWorkToDelete] = useState<Gallery | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const itemsPerPage = 5;

  const fetchWorks = async (page: number) => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/works?page=${page}&limit=${itemsPerPage}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch images");
      }
      const data: WorksResponse = await response.json();
      setImages(data.works || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching works:", error);
      toast({
        title: "Error",
        description: "Failed to fetch images",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorks(currentPage);
  }, [currentPage]);

  const handleDeleteClick = (work: Gallery) => {
    setWorkToDelete(work);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!workToDelete) return;
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/works/${workToDelete._id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete work");
      }

      // Refresh the current page after deletion
      await fetchWorks(currentPage);
      toast({
        title: "Success",
        description: "Image deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting work:", error);
      toast({
        title: "Error",
        description: "Failed to delete work",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setWorkToDelete(null);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Gallery</CardTitle>
          <CardDescription>Manage your uploaded images</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableSkeleton />
              ) : Array.isArray(images) && images.length > 0 ? (
                images.map((work) => (
                  <TableRow key={work._id}>
                    <TableCell>
                      <div className="relative w-16 h-16">
                        <Image
                          src={work.image.url}
                          alt={work.title}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{work.title}</TableCell>
                    <TableCell>
                      {work.category.charAt(0).toUpperCase() +
                        work.category.slice(1)}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {work.description}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(work)}
                        disabled={isDeleting}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    No images found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-end space-x-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || loading}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || loading}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              work "{workToDelete?.title}" from your gallery.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-500 hover:bg-red-600 focus:ring-red-500"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}
