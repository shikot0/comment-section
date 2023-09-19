import connectMongo from "@/utils/connectMongo";
import { isValidObjectId } from "mongoose";
import Posts from "../../../../../../Models/postModel";

type Props = {
    params: {
        id: string
    }
}

export async function PATCH(req: Request, {params}: Props) {
    try {
        const {id} = params;
        if(!isValidObjectId(id) || !id) {
            return new Response(JSON.stringify({msg: 'Invalid id', succeeded: false}), {
                status: 400,
                statusText: 'Invalid id'
            })
        }

        const {action} = await req.json();
        await connectMongo();
        const post = await Posts.findById(id);

        if(!post) {
            return new Response(JSON.stringify({msg: 'Post does not exist', succeeded: false}), {
                status: 404,
                statusText: 'Post not found'
            })
        }

        if(action === 'increase') {
            post.score = post.score+1;
        }else if (action === 'decrease') {
            post.score = post.score-1;
        }

        await post.save();
        return new Response(JSON.stringify({score: post.score, succeeded: true}), {
            status: 200,
        })
    }catch(err) {
        console.log(err);
    }
}