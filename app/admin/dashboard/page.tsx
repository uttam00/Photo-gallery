"use client";

import Image from "next/image";
import AdminDetailsForm from "@/components/AdminDetailsForm";
import WorkUploadForm from "@/components/WorkUploadForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { useAdmin } from "@/app/context/AdminContext";
import { Card } from "@/components/ui/card";
import GalleryTable from "@/components/galleryTable";

interface TabConfig {
  id: string;
  label: string;
  content: React.ReactNode;
}

export default function AdminDashboard() {
  const { adminDetails } = useAdmin();

  const tabs: TabConfig[] = [
    {
      id: "upload-works",
      label: "Upload Works",
      content: <WorkUploadForm />,
    },
    {
      id: "gallery",
      label: "Gallery",
      content: <GalleryTable />,
    },
    {
      id: "admin-details",
      label: "Admin Details",
      content: (
        <>
          <Card className="mb-6 p-4 bg-accent/20 rounded-lg">
            <h3 className="text-sm font-medium mb-3">Current Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">
                  {adminDetails?.email || "Not set"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">
                  {adminDetails?.phone || "Not set"}
                </p>
              </div>
              {adminDetails?.bannerImage && (
                <div className="md:col-span-2">
                  <p className="text-sm text-muted-foreground mb-2">
                    Current Banner
                  </p>
                  <div className="relative w-full h-32 rounded-lg overflow-hidden">
                    <Image
                      src={adminDetails?.bannerImage.url}
                      alt="Current Banner"
                      className="object-cover"
                      fill
                    />
                  </div>
                </div>
              )}
            </div>
          </Card>
          <AdminDetailsForm />
        </>
      ),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-8"
    >
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>
      <Tabs defaultValue={tabs[0].id} className="space-y-8">
        <TabsList>
          {tabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className="space-y-8">
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>
    </motion.div>
  );
}
