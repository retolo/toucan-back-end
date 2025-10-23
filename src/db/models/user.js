
import { Schema, model } from "mongoose";



const userSchema = new Schema({
    email: {type: String, required: true},
    password: {type: String, required: true}
}, {timestamps: true, versionKey: false});

userSchema.methods.toJSON = function(){
    const obj = this.toObject();
    delete obj.password;
    return obj;
}
export const UserCollection = model('users', userSchema);
