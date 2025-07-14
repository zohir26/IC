import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";

export async function GET() {
  try {
    const navLinkCollection = await dbConnect("navlinks");
    const data = await navLinkCollection.find({}).toArray();
    // The data is wrapped in an object with the key 'nodeList'
    // We need to extract this array before sending it
    const navlinks = data.length > 0 ? data[0].nodeList : [];
    return NextResponse.json(navlinks);
  } catch (error) {
    console.error("Failed to fetch navlinks:", error);
    // Return a proper error response
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}