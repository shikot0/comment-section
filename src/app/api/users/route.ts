import connectMongo from "@/utils/connectMongo";
import { NextApiRequest } from "next";
import Users from "../../../../Models/userModel";
import { NextRequest } from "next/server";

export async function GET(req: Request) {
    try {
        await connectMongo();
        
        const users = await Users.find().select([
            "username"
        ]);

        return new Response(JSON.stringify({users, succeeded: true}), {
            status: 200
        })
    } catch(err) {
        console.log(err);
    }
} 

export async function POST(req: Request) {
    try {
        await connectMongo();

        const {username} = await req.json();
        
        const user = await Users.create({username});

        return new Response(JSON.stringify({id: user._id, succeeded: true}), {
            status: 201
        })
    } catch(err) {
        console.log(err)
    }
}