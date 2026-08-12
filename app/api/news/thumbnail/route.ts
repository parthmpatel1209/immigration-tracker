import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const reelId = searchParams.get("reel_id");

    if (!reelId) {
      return new NextResponse("Missing reel_id", { status: 400 });
    }

    const instaMediaUrl = `https://www.instagram.com/p/${reelId}/media/?size=l`;

    const res = await fetch(instaMediaUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      redirect: "follow",
    });

    if (!res.ok) {
      return new NextResponse("Image not found", { status: 404 });
    }

    const arrayBuffer = await res.arrayBuffer();
    const contentType = res.headers.get("content-type") || "image/jpeg";

    return new NextResponse(Buffer.from(arrayBuffer), {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
      },
    });
  } catch (error) {
    console.error("Thumbnail proxy error:", error);
    return new NextResponse("Failed to fetch thumbnail", { status: 500 });
  }
}
