import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!
});

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  return new Promise((resolve) => {
    cloudinary.uploader
      .upload_stream({ folder: "hotwheels" }, (error, result) => {
        if (error || !result) {
          resolve(
            NextResponse.json({ error: "Failed to upload" }, { status: 500 })
          );
        } else {
          resolve(
            NextResponse.json({
              url: result.secure_url
            })
          );
        }
      })
      .end(buffer);
  });
}
