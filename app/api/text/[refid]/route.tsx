import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../../config/dbConnect";
import Field from "../../../models/fieldModel";

export async function POST(request: NextRequest, { params }: { params: { refid: string } }) {
    await connectDB();
    const { text } = await request.json();
    const refid = params.refid;

    if (!text || !refid) {
        console.log(text, refid);
        return NextResponse.json({ "message": "All fields are required." }, { status: 400 });
    }

    const fieldAvailable = await Field.findOne({ refid });
    if (fieldAvailable) {
        // return NextResponse.json({ "message": "Field already exists." }, { status: 400 });
        const field = await Field.findOneAndUpdate(
            { refid },  // Find field by refid
            { text },  // Update fields
            { new: true }  // Return the updated document
        );
        return NextResponse.json({ "message": "Field modified successfully.", _id: field.id, refid: field.refid }, { status: 201 });
    }

    const field = await Field.create({ refid, text });

    if (field) {
        return NextResponse.json({ "message": "Field created successfully.", _id: field.id, refid: field.refid }, { status: 201 });
    } else {
        return NextResponse.json({ "message": "Field creation failed." }, { status: 500 });
    }
}

export async function GET(request: NextRequest, { params }: { params: { refid: string } }) {
    await connectDB();
    const refid = params.refid;

    const field = await Field.findOne({ refid });
    if (field) {
        return NextResponse.json({ text: field.text }, { status: 200 });
    } else {
        return NextResponse.json({ "message": "Field not found." }, { status: 404 });
    }
}