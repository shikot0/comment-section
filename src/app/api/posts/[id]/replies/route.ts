import { isValidObjectId } from "mongoose";
import Posts from "../../../../../../Models/postModel";
import connectMongo from "@/utils/connectMongo";

type Props = {
    params: {
        id: string
    }
}

export async function POST(req: Request, {params}: Props) {
    try {
        const {id} = params;
        
        if(!isValidObjectId(id) || !id) {
            return new Response(JSON.stringify({msg: 'Invalid ID', succeeded: false}), {
                status: 400,
                statusText: 'Invalid Id'
            })
        }

        
        const {user, text, score, type} = await req.json();

        await connectMongo();
        
        const reply = await Posts.create({user, text, score, type});
        
        if(!reply) {
            return new Response(JSON.stringify({msg: 'Error adding your reply', succeeded: false}), {
                status: 400
            })
        }
        
        await Posts.updateOne({_id: id}, {$addToSet: {replies: reply._id}});
        
        return new Response(JSON.stringify({succeeded: true}), {
            status: 201,
            statusText: 'Added reply'
        });
        
    }catch(err) {
        console.log(err);
    }
}

export async function GET(req: Request, {params}: Props) {
    try {
        const {id} = params;

        if(!isValidObjectId(id) || !id) {
            return new Response(JSON.stringify({msg: 'Invalid ID', succeeded: false}), {
                status: 400,
                statusText: 'Invalid Id'
            })
        }

        await connectMongo();
        
        const post = await Posts.findById(id).select([
            "replies"
        ]);

        if(!post) {
            return new Response(JSON.stringify({msg: 'Post does not exist', succeeded: false}), {
                status: 404,
                statusText: 'Post does not exist'
            })
        }

        const replies = await Posts.find({type: 'reply', _id: {$in: post.replies}});

        return new Response(JSON.stringify({replies, succeeded: true}), {
            status: 200
        })
    }catch(err) {
        console.log(err);
    }
}