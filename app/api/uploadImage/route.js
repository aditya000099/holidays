// /app/api/uploadImage/route.js
import { NextResponse } from 'next/server';
import { Client, Storage, ID } from 'appwrite';

export async function POST(req) {
  try {
    const data = await req.formData();
    const image = data.get('image');
   if (!image) {
      return NextResponse.json({ success: false, error: "No image received" }, {status: 400});
   }

    const client = new Client()
     .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
     .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

    const storage = new Storage(client);

    const uploadedFile = await storage.createFile(
      process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID,
       ID.unique(),
        image
   );
   const filePreview = await storage.getFileView(
         process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID,
        uploadedFile.$id
    );
    console.log("Image route, success", uploadedFile)
      return NextResponse.json({success: true, imageUrl: filePreview.$id}, {status:200});
    } catch (e) {
        console.error("Error during upload", e)
       return NextResponse.json({success: false, message: "Something went wrong"}, {status: 500});
   }
}

export const config = {
    api: {
      bodyParser: false,
    },
};