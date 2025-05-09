"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

interface BannerImage {
  url: string;
  width: number;
  height: number;
}

interface AdminDetails {
  email: string;
  phone: string;
  bannerImage?: BannerImage;
}

interface AdminContextType {
  adminDetails: AdminDetails | null;
  loading: boolean;
  refetchAdminDetails: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType>({
  adminDetails: null,
  loading: true,
  refetchAdminDetails: async () => Promise.resolve(),
});

export function AdminProvider({ children }: { children: ReactNode }) {
  const [adminDetails, setAdminDetails] = useState<AdminDetails | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAdminDetails = async () => {
    try {
      const response = await fetch("/api/admin-details");
      if (!response.ok) {
        throw new Error("Failed to fetch admin details");
      }
      const data = await response.json();
      setAdminDetails(data);
    } catch (error) {
      console.error("Error fetching admin details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminDetails();
  }, []);

  return (
    <AdminContext.Provider
      value={{
        adminDetails,
        loading,
        refetchAdminDetails: fetchAdminDetails,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => useContext(AdminContext);
