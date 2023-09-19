import { isValidObjectId } from "mongoose";
import Posts from "../../../../../Models/postModel";
import connectMongo from "@/utils/connectMongo";

type Props = {
    params: {
        id: string;
    }
}

export async function DELETE(req: Request, {params}: Props) {
    try {
        const {id} = params;

        if(!isValidObjectId(id) || !id) {
            return new Response(JSON.stringify({msg: 'Invalid ID', succeeded: false}), {
                status: 400,
                statusText: 'Invalid Id'
            })
        }

        await connectMongo();
        
        const post = await Posts.findById(id);

        if(post.type === 'reply') {
            const originalComment = await Posts.findOne({replies: {$in: id}});
            if(originalComment) {
                const index = originalComment.replies.indexOf(id);
                originalComment.replies.splice(index, 1);
                await originalComment.save();
            }
        }

        await Posts.deleteOne({_id: id, user: 'juliusomo'});

        return new Response(JSON.stringify({msg: 'Deleted post', succeeded: true}), {
            status: 200
        })
    }catch(err) {
        console.log(err);
    }
}

export async function PATCH(req: Request, {params}: Props) {
    try {
        const {id} = params;
        const {text} = await req.json();

        if(!isValidObjectId(id) || !id) {
            return new Response(JSON.stringify({msg: 'Invalid ID', succeeded: false}), {
                status: 400,
                statusText: 'Invalid Id'
            })
        }

        await connectMongo();

        const post = await Posts.findById(id);
        post.text = text;
        await post.save();

        return new Response(JSON.stringify({succeeded: true}), {
            status: 200
        })
    }catch(err) {
        console.log(err);
    }
}