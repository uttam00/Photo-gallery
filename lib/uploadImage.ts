export async function uploadImage(file: File): Promise<{
  imageUrl: string;
  width: number;
  height: number;
}> {
  // Create a FormData instance
  const formData = new FormData();
  formData.append("file", file);

  // Upload to your image hosting service (e.g., Cloudinary)
  const uploadResponse = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  if (!uploadResponse.ok) {
    throw new Error("Failed to upload image");
  }

  const { url, width, height } = await uploadResponse.json();
  return { imageUrl: url, width, height };
}
