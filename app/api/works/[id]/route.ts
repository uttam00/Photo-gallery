import { NextRequest, NextResponse } from "next/server";
import { getDB } from "../../../../utils/database";
import { ObjectId } from "mongodb";
import { runtime } from "../../../../config";

export { runtime };

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = await getDB();
    const work = await db
      .collection("works")
      .findOne({ _id: new ObjectId(params.id) });

    if (!work) {
      return NextResponse.json({ error: "Work not found" }, { status: 404 });
    }

    return NextResponse.json(work);
  } catch (error) {
    console.error("Error fetching work:", error);
    return NextResponse.json(
      { error: "Failed to fetch work" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = await getDB();
    const result = await db
      .collection("works")
      .deleteOne({ _id: new ObjectId(params.id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Work not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting work:", error);
    return NextResponse.json(
      { error: "Failed to delete work" },
      { status: 500 }
    );
  }
}
