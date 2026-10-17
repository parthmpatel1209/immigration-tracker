import { NextResponse } from "next/server";
import sharp from "sharp";

export const runtime = "nodejs";

/** Mean brightness (0-255) of a pixel strip. */
async function stripMean(img: Buffer, left: number, top: number, width: number, height: number) {
  const { data } = await sharp(img)
    .extract({ left, top, width, height })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  let sum = 0;
  for (const v of data) sum += v;
  return sum / data.length;
}

/**
 * Instagram letterboxes some posters with a ~2.5% black frame. If the outer
 * strips are pure black, crop them off so the artwork fills the card; images
 * that already run edge-to-edge are left untouched.
 */
async function trimBlackFrame(buf: Buffer): Promise<Buffer> {
  const meta = await sharp(buf).metadata();
  const w = meta.width ?? 0;
  const h = meta.height ?? 0;
  if (w < 200 || h < 200) return buf;

  const insetX = Math.round(w * 0.025);
  const insetY = Math.round(h * 0.025);
  const [l, t, r, b] = await Promise.all([
    stripMean(buf, 1, Math.round(h * 0.1), Math.max(2, insetX - 4), Math.round(h * 0.8)),
    stripMean(buf, Math.round(w * 0.1), 1, Math.round(w * 0.8), Math.max(2, insetY - 4)),
    stripMean(buf, w - insetX + 3, Math.round(h * 0.1), Math.max(2, insetX - 4), Math.round(h * 0.8)),
    stripMean(buf, Math.round(w * 0.1), h - insetY + 3, Math.round(w * 0.8), Math.max(2, insetY - 4)),
  ]);
  if (Math.max(l, t, r, b) > 10) return buf;

  return sharp(buf)
    .extract({ left: insetX, top: insetY, width: w - insetX * 2, height: h - insetY * 2 })
    .jpeg({ quality: 86, mozjpeg: true })
    .toBuffer();
}

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

    const original = Buffer.from(await res.arrayBuffer());
    let body: Buffer = original;
    let contentType = res.headers.get("content-type") || "image/jpeg";
    try {
      body = await trimBlackFrame(original);
      if (body !== original) contentType = "image/jpeg";
    } catch (err) {
      console.error("Thumbnail trim failed, serving original:", err);
    }

    return new NextResponse(body, {
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
