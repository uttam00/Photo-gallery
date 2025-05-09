import { NextResponse } from "next/server";
import { getDB } from "../../../utils/database";
import { runtime } from "../../../config";

export { runtime };

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "5");
    const skip = (page - 1) * limit;

    const db = await getDB();
    const total = await db.collection("works").countDocuments();
    const works = await db
      .collection("works")
      .find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      works,
      total,
      page,
      totalPages,
    });
  } catch (error) {
    console.error("Error fetching works:", error);
    return NextResponse.json(
      { error: "Failed to fetch works" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const db = await getDB();
    const work = await request.json();

    if (!work.title || !work.category || !work.description) {
      return NextResponse.json(
        { error: "Missing required fields (title, category, description)" },
        { status: 400 }
      );
    }

    const result = await db.collection("works").insertOne({
      ...work,
      createdAt: new Date(),
    });

    if (!result.acknowledged) {
      throw new Error("Failed to insert work into database");
    }

    return NextResponse.json({
      ...work,
      _id: result.insertedId,
    });
  } catch (error) {
    console.error("Error in POST /api/works:", error);
    return NextResponse.json(
      {
        error: "Failed to create work",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
