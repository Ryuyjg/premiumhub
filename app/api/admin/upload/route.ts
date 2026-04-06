import { type NextRequest, NextResponse } from "next/server";
import { adminStorage } from "@/lib/firebase/admin";
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

    const buffer = await file.arrayBuffer();
    const bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "website-b4855.firebasestorage.app";
    const bucket = adminStorage.bucket(bucketName);
    
    const fileName = `products/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;
    const fileRef = bucket.file(fileName);

    await fileRef.save(Buffer.from(buffer), {
      metadata: {
        contentType: file.type
      }
    });

    // Generate a long-lived signed URL to securely bypass any bucket rules or public-access blocks.
    const [url] = await fileRef.getSignedUrl({
      action: "read",
      expires: "01-01-2500"
    });

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? `Upload failed: ${error.message}` : "Internal Server Error" },
      { status: 500 }
    );
  }
}
