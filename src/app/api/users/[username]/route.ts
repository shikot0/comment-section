import { isValidObjectId } from "mongoose";
import Users from "../../../../../Models/userModel";
import connectMongo from "@/utils/connectMongo";

type Props = {
    params: {
        username: string
    }
}


export async function GET(req: Request, {params}: Props) {
    try {
        const {username} = params;

        if(!username) {
            return new Response(JSON.stringify({msg: 'Invalid user', succeeded: false}), {
                status: 400,
                statusText: 'Invalid user'
            })
        }

        await connectMongo();

        const user = await Users.findOne({username: username}).select({
            image: false
        });

        if(!user) {
            return new Response(JSON.stringify({msg: 'User does not exist', succeeded: false}), {
                status: 404
            })
        }

        return new Response(JSON.stringify({user, succeeded: true}), {
            status: 200
        })
    }catch(err) {
        console.log(err);
    }
}