"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Upload, ImagePlus } from "lucide-react";

interface FormData {
  title: string;
  category: string;
  description: string;
  file: File | null;
}

interface FormErrors {
  title?: string;
  category?: string;
  description?: string;
  file?: string;
}

const TITLE_MIN_LENGTH = 3;
const TITLE_MAX_LENGTH = 30;
const DESCRIPTION_MIN_LENGTH = 10;
const DESCRIPTION_MAX_LENGTH = 90;

export default function WorkUploadForm() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isUploading, setIsUploading] = useState(false);

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!title.trim()) {
      newErrors.title = "Title is required";
    } else if (title.length < TITLE_MIN_LENGTH) {
      newErrors.title = `Title must be at least ${TITLE_MIN_LENGTH} characters`;
    } else if (title.length > TITLE_MAX_LENGTH) {
      newErrors.title = `Title must be less than ${TITLE_MAX_LENGTH} characters`;
    }

    if (!category) {
      newErrors.category = "Category is required";
    }

    if (!description.trim()) {
      newErrors.description = "Description is required";
    } else if (description.length < DESCRIPTION_MIN_LENGTH) {
      newErrors.description = `Description must be at least ${DESCRIPTION_MIN_LENGTH} characters`;
    } else if (description.length > DESCRIPTION_MAX_LENGTH) {
      newErrors.description = `Description must be less than ${DESCRIPTION_MAX_LENGTH} characters`;
    }

    if (!file) {
      newErrors.file = "Image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!file) {
      return;
    }

    setIsUploading(true);

    try {
      // Get image dimensions before upload
      const dimensions = await new Promise<{ width: number; height: number }>(
        (resolve) => {
          const img = document.createElement("img");
          img.onload = () => {
            resolve({ width: img.width, height: img.height });
          };
          img.src = URL.createObjectURL(file);
        }
      );

      // Create form data for upload
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title);
      formData.append("category", category);
      formData.append("description", description);

      // Upload to our API endpoint
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const result = await response.json();
      const imageUrl = result.url;

      // Reset form
      setTitle("");
      setCategory("");
      setDescription("");
      setFile(null);
      setPreviewUrl(null);
      setErrors({});

      toast({
        title: "Success",
        description: "Work uploaded successfully",
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Upload New Work</CardTitle>
            <CardDescription>
              Add new images to your portfolio gallery
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleUpload}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (errors.title) {
                      setErrors((prev) => ({ ...prev, title: undefined }));
                    }
                  }}
                  className={errors.title ? "border-red-500" : ""}
                  maxLength={TITLE_MAX_LENGTH}
                />
                {errors.title ? (
                  <p className="text-sm text-red-500">{errors.title}</p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {title.length}/{TITLE_MAX_LENGTH} characters
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={category}
                  onValueChange={(value) => {
                    setCategory(value);
                    if (errors.category) {
                      setErrors((prev) => ({ ...prev, category: undefined }));
                    }
                  }}
                >
                  <SelectTrigger
                    className={errors.category ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="photography">Photography</SelectItem>
                    <SelectItem value="digital-art">Digital Art</SelectItem>
                    <SelectItem value="illustration">Illustration</SelectItem>
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-red-500">{errors.category}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    if (errors.description) {
                      setErrors((prev) => ({
                        ...prev,
                        description: undefined,
                      }));
                    }
                  }}
                  className={errors.description ? "border-red-500" : ""}
                  maxLength={DESCRIPTION_MAX_LENGTH}
                />
                {errors.description ? (
                  <p className="text-sm text-red-500">{errors.description}</p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {description.length}/{DESCRIPTION_MAX_LENGTH} characters
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Image</Label>
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-accent/50 transition-colors ${
                    errors.file ? "border-red-500" : ""
                  }`}
                  onClick={() =>
                    document.getElementById("image-upload")?.click()
                  }
                >
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const selectedFile = e.target.files[0];
                        setFile(selectedFile);
                        if (errors.file) {
                          setErrors((prev) => ({ ...prev, file: undefined }));
                        }

                        // Create preview URL
                        const reader = new FileReader();
                        reader.onload = () => {
                          setPreviewUrl(reader.result as string);
                        };
                        reader.readAsDataURL(selectedFile);
                      }
                    }}
                  />
                  <ImagePlus className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG or WEBP (max. 10MB)
                  </p>
                </div>
                {errors.file && (
                  <p className="text-sm text-red-500">{errors.file}</p>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isUploading}>
                {isUploading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" /> Upload
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Image Preview</CardTitle>
            <CardDescription>
              Preview your image before uploading
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-square rounded-lg overflow-hidden bg-accent/20 flex items-center justify-center">
              {previewUrl ? (
                <Image
                  src={previewUrl}
                  alt="Preview"
                  width={400}
                  height={400}
                  className="object-contain w-full h-full"
                />
              ) : (
                <p className="text-muted-foreground text-sm">
                  No image selected
                </p>
              )}
            </div>
            {previewUrl && (
              <div className="mt-4">
                <p className="font-medium">{title || "Untitled"}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {category
                    ? category.charAt(0).toUpperCase() + category.slice(1)
                    : "Uncategorized"}
                </p>
                {description && (
                  <p className="text-sm mt-2 line-clamp-3">{description}</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
