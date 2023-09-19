import {connect} from 'mongoose';
import { MONGODB_URI } from '../../statics';

export default async function connectMongo() {
    await connect(MONGODB_URI)
}
