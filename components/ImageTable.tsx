"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

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
  createdAt: string;
}

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export function ImageTable() {
  const [works, setWorks] = useState<WorkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: 10,
    hasMore: true,
  });

  const fetchWorks = async (page: number) => {
    try {
      const response = await fetch(
        `/api/works?page=${page}&limit=${pagination.limit}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch works");
      }
      const data = await response.json();
      setWorks(data.works);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching works:", error);
      toast({
        title: "Error",
        description: "Failed to fetch works",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorks(1);
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/works/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete work");
      }

      // Remove the deleted work from the state
      setWorks((prev) => prev.filter((work) => work._id !== id));
      toast({
        title: "Success",
        description: "Work deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting work:", error);
      toast({
        title: "Error",
        description: "Failed to delete work",
        variant: "destructive",
      });
    }
  };

  const handlePageChange = (newPage: number) => {
    fetchWorks(newPage);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {works.map((work) => (
            <TableRow key={work._id}>
              <TableCell>
                <div className="relative w-20 h-20">
                  <Image
                    src={work.image.url}
                    alt={work.title}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
              </TableCell>
              <TableCell>{work.title}</TableCell>
              <TableCell>{work.category}</TableCell>
              <TableCell className="max-w-xs truncate">
                {work.description}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(work._id)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Showing {works.length} of {pagination.total} works
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={!pagination.hasMore}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
