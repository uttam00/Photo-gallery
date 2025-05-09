"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useAdmin } from "../context/AdminContext";
import { FormInput } from "@/components/ui/form-input";

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const { adminDetails, loading } = useAdmin();

  const validateForm = () => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!name.trim()) {
      newErrors.name = "Name is required";
    } else if (name.length < 2) {
      newErrors.name = "Name must be at least 2 characters long";
    }

    // Email validation
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Subject validation
    if (!subject.trim()) {
      newErrors.subject = "Subject is required";
    } else if (subject.length < 5) {
      newErrors.subject = "Subject must be at least 5 characters long";
    }

    // Message validation
    if (!message.trim()) {
      newErrors.message = "Message is required";
    } else if (message.length < 10) {
      newErrors.message = "Message must be at least 10 characters long";
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
      const response = await fetch("/api/contact-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, subject, message }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      toast({
        title: "Success",
        description: "Your message has been sent successfully",
      });

      // Reset form and errors
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setErrors({});
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    field: keyof FormErrors,
    value: string,
    setter: (value: string) => void
  ) => {
    setter(value);
    // Clear error for the field being changed
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have a question or want to work together? Feel free to reach out
            through the contact form or using the information below.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {loading ? (
                  <div className="space-y-4">
                    <div className="h-6 bg-muted animate-pulse rounded" />
                    <div className="h-6 bg-muted animate-pulse rounded" />
                    <div className="h-6 bg-muted animate-pulse rounded" />
                  </div>
                ) : (
                  <>
                    <div className="flex items-center space-x-4">
                      <Mail className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Email</p>
                        <a
                          href={`mailto:${adminDetails?.email}`}
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          {adminDetails?.email}
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Phone className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Phone</p>
                        <a
                          href={`tel:${adminDetails?.phone}`}
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          {adminDetails?.phone}
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <MapPin className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Location</p>
                        <p className="text-muted-foreground">
                          New York, NY, United States
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Send a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <FormInput
                    id="name"
                    label="Name"
                    value={name}
                    onChange={(value) =>
                      handleInputChange("name", value, setName)
                    }
                    error={errors.name}
                    minLength={2}
                  />
                  <FormInput
                    id="email"
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(value) =>
                      handleInputChange("email", value, setEmail)
                    }
                    error={errors.email}
                  />
                  <FormInput
                    id="subject"
                    label="Subject"
                    value={subject}
                    onChange={(value) =>
                      handleInputChange("subject", value, setSubject)
                    }
                    error={errors.subject}
                    minLength={5}
                  />
                  <FormInput
                    id="message"
                    label="Message"
                    type="textarea"
                    value={message}
                    onChange={(value) =>
                      handleInputChange("message", value, setMessage)
                    }
                    error={errors.message}
                    minLength={10}
                  />
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
