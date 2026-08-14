import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const files = formData.getAll("files") as File[];
        
        if (!files || files.length === 0) {
            return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
        }

        const urls: string[] = [];
        
        // Ensure public/uploads directory exists
        const uploadDir = path.join(process.cwd(), "public", "uploads");
        await mkdir(uploadDir, { recursive: true });

        for (const file of files) {
            const buffer = Buffer.from(await file.arrayBuffer());
            const uniqueName = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
            const filePath = path.join(uploadDir, uniqueName);
            await writeFile(filePath, buffer);
            urls.push(`/uploads/${uniqueName}`);
        }

        return NextResponse.json({ urls });
    } catch (err: any) {
        console.error("Upload error:", err);
        return NextResponse.json({ error: err.message || "Failed to upload file" }, { status: 500 });
    }
}
