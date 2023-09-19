import { Schema, models, model } from "mongoose"

export type User = {
    username: string,
    image: {
        Data: Buffer | ArrayBuffer,
        ContentType: string
    }
}


const userSchema = new Schema<User>({
        username: {
            type: String,
            required: true,
            min: 3,
            max: 25,
            trim: true
        },
        image: {
            Data: Buffer || ArrayBuffer,
            ContentType: String
        }
    },
    {
        timestamps: true
    }
)

const Users = models.Users || model<User>('Users', userSchema);

export default Users;
