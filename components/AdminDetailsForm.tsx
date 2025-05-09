"use client";

import { useState, useEffect } from "react";
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
import { Upload, ImagePlus } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useAdmin } from "../app/context/AdminContext";
import { FormInput } from "@/components/ui/form-input";

interface FormData {
  email: string;
  phone: string;
  bannerImage: File | null;
  bannerPreviewUrl: string | null;
}

type FormField = "email" | "phone" | "bannerImage";

interface FormErrors {
  email?: string;
  phone?: string;
  bannerImage?: string;
}

export default function AdminDetailsForm() {
  const { adminDetails, loading, refetchAdminDetails } = useAdmin();
  const [formData, setFormData] = useState<FormData>({
    // email: adminDetails?.email || "",
    // phone: adminDetails?.phone || "",
    // bannerPreviewUrl: adminDetails?.bannerImage?.url || null,
    email: "",
    phone: "",
    bannerImage: null,
    bannerPreviewUrl: null,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // useEffect(() => {
  //   if (adminDetails) {
  //     setFormData((prev) => ({
  //       ...prev,
  //       email: adminDetails.email || "",
  //       phone: adminDetails.phone || "",
  //       bannerPreviewUrl: adminDetails.bannerImage?.url || null,
  //     }));
  //   }
  // }, [adminDetails]);

  const validateForm = () => {
    const newErrors: FormErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!formData.email.trim()) {
      newErrors.email = "Email cannot be empty";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    // Phone validation
    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!formData.phone.trim()) {
      newErrors.phone = "Phone number cannot be empty";
    } else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
      newErrors.phone = "Invalid phone number format";
    }

    // Banner image validation
    if (!formData.bannerImage && !formData.bannerPreviewUrl) {
      newErrors.bannerImage = "Banner image is required";
    } else if (formData.bannerImage) {
      // Check file size (max 10MB)
      // const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      // if (formData.bannerImage.size > maxSize) {
      //   newErrors.bannerImage = "Image size must be less than 10MB";
      // }

      // Check file type
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(formData.bannerImage.type)) {
        newErrors.bannerImage = "Only JPG, PNG, and WEBP images are allowed";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form first
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone", formData.phone);
      if (formData.bannerImage) {
        formDataToSend.append("bannerImage", formData.bannerImage);
      }

      const response = await fetch("/api/admin-details", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update admin details");
      }

      if (formData.bannerImage) {
        setFormData((prev) => ({
          ...prev,
          bannerImage: null,
        }));
      }
      setErrors({});
      refetchAdminDetails();
      toast({
        title: "Success",
        description: "Admin details updated successfully",
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update admin details",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: FormField, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for the field being changed
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prev) => ({ ...prev, bannerImage: file }));
      if (errors.bannerImage) {
        setErrors((prev) => ({ ...prev, bannerImage: undefined }));
      }

      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prev) => ({
          ...prev,
          bannerPreviewUrl: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Admin Details</CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-10 bg-accent/20 rounded animate-pulse" />
            <div className="h-10 bg-accent/20 rounded animate-pulse" />
            <div className="h-40 bg-accent/20 rounded animate-pulse" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Admin Details</CardTitle>
          <CardDescription>
            Update your contact information and banner image
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <FormInput
              id="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={(value) => handleInputChange("email", value)}
              error={errors.email}
            />

            <FormInput
              id="phone"
              label="Phone Number"
              value={formData.phone}
              onChange={(value) => handleInputChange("phone", value)}
              error={errors.phone}
              placeholder="+1 (555) 123-4567"
            />

            <div className="space-y-2">
              <Label htmlFor="banner">Banner Image</Label>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-accent/50 transition-colors ${
                  errors.bannerImage ? "border-red-500" : ""
                }`}
                onClick={() =>
                  document.getElementById("banner-upload")?.click()
                }
              >
                <Input
                  id="banner-upload"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <ImagePlus className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Click to upload banner image
                </p>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG or WEBP (max. 10MB)
                </p>
              </div>
              {errors.bannerImage && (
                <p className="text-sm text-red-500">{errors.bannerImage}</p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                  Updating...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" /> Update Details
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Banner Image Preview</CardTitle>
          <CardDescription>
            Preview your banner image before uploading
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="aspect-video rounded-lg overflow-hidden bg-accent/20 flex items-center justify-center">
            {formData.bannerPreviewUrl ? (
              <Image
                src={formData.bannerPreviewUrl}
                alt="Banner Preview"
                width={800}
                height={400}
                className="object-cover w-full h-full"
              />
            ) : (
              <p className="text-muted-foreground text-sm">
                No banner image selected
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
