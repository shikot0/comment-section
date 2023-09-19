import connectMongo from "@/utils/connectMongo";
import Posts from "../../../../Models/postModel";

export async function POST(req: Request) {
    try {
        let {user, text, type} = await req.json();

        await connectMongo();

        const post = await Posts.create({user, text, type});

        return new Response(JSON.stringify({succeeded: true}), {
            status: 201
        })
    } catch(err) {
        console.log(err);
    }
}

export async function GET(req: Request) {
    try {
        await connectMongo();

        const comments = await Posts.find({type: 'comment'}).sort({score: -1});

        return new Response(JSON.stringify({comments, succeeded: true}), {
            status: 200
        })
    }catch(err) {
        console.log(err);
    }
}