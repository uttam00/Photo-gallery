import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { getDB } from "@/utils/database";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
  try {
    const db = await getDB();
    const adminDetails = await db
      .collection("admin")
      .findOne({ type: "admin" });

    if (!adminDetails) {
      return NextResponse.json({
        email: "",
        phone: "",
      });
    }

    return NextResponse.json(adminDetails);
  } catch (error) {
    console.error("Error fetching admin details:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin details" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const bannerImage = formData.get("bannerImage") as File;

    if (!email || !phone) {
      return NextResponse.json(
        { error: "Email and phone are required" },
        { status: 400 }
      );
    }

    let bannerImageUrl = null;
    let bannerImageWidth = null;
    let bannerImageHeight = null;

    if (bannerImage) {
      // Convert file to buffer
      const bytes = await bannerImage.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Upload to Cloudinary
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              resource_type: "auto",
              folder: "portfolio/admin",
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          )
          .end(buffer);
      });

      const { secure_url, width, height } = result as any;
      bannerImageUrl = secure_url;
      bannerImageWidth = width;
      bannerImageHeight = height;
    }

    // Store admin details in database
    const db = await getDB();
    await db.collection("admin").updateOne(
      { type: "admin" }, // Using a type field instead of _id
      {
        $set: {
          email,
          phone,
          ...(bannerImageUrl && {
            bannerImage: {
              url: bannerImageUrl,
              width: bannerImageWidth,
              height: bannerImageHeight,
            },
          }),
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    return NextResponse.json({
      email,
      phone,
      ...(bannerImageUrl && {
        bannerImage: {
          url: bannerImageUrl,
          width: bannerImageWidth,
          height: bannerImageHeight,
        },
      }),
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to update admin details" },
      { status: 500 }
    );
  }
}
