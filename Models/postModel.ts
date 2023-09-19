import {Schema, model, models, Types} from 'mongoose';


type Post = {
    user: string,
    type: 'comment' | 'reply',
    text: string,
    replies: string[],
    score: number,
    createdAt: Date,
}


const postSchema = new Schema<Post>({
        user: {
            type: String
        },
        text: {
            type: String,
            min: 1,
            max: 250
        },
        type: {
            type: String,
            required: true
        },
        replies: [{
            type: Types.ObjectId || String
        }],
        score: {
            type: Number,
            default: 0
        }
    }, {
        timestamps: true
    }
)

const Posts = models.Posts || model<Post>('Posts', postSchema);

export default Posts;