import { google } from "googleapis";
import { Readable } from "stream";
import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../../config/dbConnect";
import Field from "../../../models/fieldModel";


const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.NEXT_PUBLIC_LOCATION;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const FOLDER_ID = process.env.FOLDER_ID;

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const drive = google.drive({ version: "v3", auth: oauth2Client });

export async function POST(req: NextRequest, { params }: { params: Promise<{ refid: string }>; }) {
    await connectDB();
    try {
        const formData = await req.formData();
        const file = formData.get("file");
        const { refid } = await params;

        if (!file || !(file instanceof Blob)) {
            return NextResponse.json({ message: "Invalid file upload" }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const fileMetadata = {
            name: file.name,
            parents: FOLDER_ID ? [FOLDER_ID] : [], // Upload to specific folder
        };

        const media = {
            mimeType: file.type,
            body: Readable.from(buffer),
        };

        // Upload file to Google Drive
        const response = await drive.files.create({
            requestBody: fileMetadata,
            media: media,
            fields: "id, webViewLink",
        });

        const fileId = response.data.id;
        if (!fileId) {
            throw new Error("File ID is missing, unable to set permissions");
        }

        await drive.permissions.create({
            fileId: fileId, // ID of the uploaded file
            requestBody: {
                role: "reader", // Read-only access
                type: "anyone", // Anyone on the internet
            },
        });

        const fileUrl = response.data.webViewLink;

        const fieldAvailable = await Field.findOne({ refid });
        if (fieldAvailable) {
            const field = await Field.findOneAndUpdate(
                { refid },  // Find field by refid
                { fileUrl },  // Update fields
                { new: true }  // Return the updated document
            );
            return NextResponse.json({ message: "File uploaded successfully", url: fileUrl }, { status: 201 });
        }

        const field = await Field.create({ refid, fileUrl });

        return NextResponse.json({ message: "File uploaded successfully", url: fileUrl }, { status: 201 });
    } catch (error) {
        console.error("Upload Error:", error);
        return NextResponse.json({ message: "File upload failed" }, { status: 500 });
    }
}