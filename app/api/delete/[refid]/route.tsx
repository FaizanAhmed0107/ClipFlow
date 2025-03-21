import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import Field from "../../../models/fieldModel";
import connectDB from "@/app/config/dbConnect";


const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.NEXT_PUBLIC_LOCATION;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const FOLDER_ID = process.env.FOLDER_ID;

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const drive = google.drive({ version: "v3", auth: oauth2Client });

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ refid: string }>; }) {
    try {
        await connectDB();
        const { refid } = await params;

        const fieldResult = await Field.findOne({ refid });
        if (!fieldResult || fieldResult.fileUrl === 'None') {
            return NextResponse.json({ message: "File not found" }, { status: 404 });
        }

        const fileId = fieldResult.fileUrl.split("/").slice(-2, -1)[0]; // Extract file ID from URL

        // Delete file from Google Drive
        await drive.files.delete({ fileId });

        // Remove reference from the database
        await Field.findOneAndUpdate({ refid }, { fileUrl: 'None' });

        return NextResponse.json({ message: "File deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Delete Error:", error);
        return NextResponse.json({ message: "File deletion failed" }, { status: 500 });
    }
}