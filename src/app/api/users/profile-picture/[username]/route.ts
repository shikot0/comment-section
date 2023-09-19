import connectMongo from "@/utils/connectMongo";
import Users from "../../../../../../Models/userModel";
import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

type ProfilePictureProps = {
    params: {
        username: string
    }
}


export async function POST(req: NextRequest, {params}: ProfilePictureProps) {
    try {
        const {username} = params;

        await connectMongo();
        const user = await Users.findOne({username: username});
        
        const formData: FormData = await req.formData();
        const profilePicture: Blob = formData.entries().next().value[1];
        const imageBuffer = await profilePicture.arrayBuffer();
        const image = await sharp(imageBuffer).toBuffer();
        

        user.image.Data = image; 
        user.image.ContentType = profilePicture.type;

        await user.save();

        return new Response(JSON.stringify({succeeded: true}), {
            status: 200
        })
    }catch(err) {
        console.log(err);
    }
} 

export async function GET(req: Request, {params}: ProfilePictureProps) {
    try {
        const {username} = params;
        await connectMongo();

        const user = await Users.findOne({username: username});
        

        return new NextResponse(user.image.Data, {
            status: 200,
            headers: {
                'Content-Type': `${user.image.ContentType}`,
            }
        });
    }catch(err) {
        console.log(err);
    }
}