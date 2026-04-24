// Updated to use ImgBB for 100% Free Image Hosting (No Credit Card required)
import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const adminSession = cookieStore.get(process.env.ADMIN_SESSION_COOKIE_NAME || "ott_admin");

    if (!adminSession) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!file.type?.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files are allowed." }, { status: 400 });
    }

    const configuredMaxMb = Number(process.env.IMGBB_MAX_UPLOAD_MB || "10");
    const maxUploadMb = Number.isFinite(configuredMaxMb) && configuredMaxMb > 0 ? configuredMaxMb : 10;
    const maxBytes = Math.floor(maxUploadMb * 1024 * 1024);

    if (file.size > maxBytes) {
      return NextResponse.json(
        { error: `Image too large. Max allowed is ${maxUploadMb}MB.` },
        { status: 400 }
      );
    }

    const apiKey = process.env.IMGBB_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Free image hosting setup required. Please get a free API key from https://api.imgbb.com and add it as IMGBB_API_KEY in Vercel." },
        { status: 500 }
      );
    }

    const buffer = await file.arrayBuffer();
    const base64String = Buffer.from(buffer).toString('base64');
    
    // Upload directly to ImgBB
    const imgbbFormData = new URLSearchParams();
    imgbbFormData.append("key", apiKey);
    imgbbFormData.append("image", base64String);

    const uploadResponse = await fetch("https://api.imgbb.com/1/upload", {
      method: "POST",
      body: imgbbFormData,
    });

    const data = await uploadResponse.json();

    if (!uploadResponse.ok || !data.success) {
      throw new Error(data.error?.message || "Failed to upload to ImgBB");
    }

    // Return the direct image URL from ImgBB
    return NextResponse.json({ url: data.data.url });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? `Upload failed: ${error.message}` : "Internal Server Error" },
      { status: 500 }
    );
  }
}
