import mongoose from "mongoose";

const userScheme = new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,
        unique:true,
        required:true,
        lowercase:true,
        match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, 'Please fill a valid email address']},
    password:{type:String,required:true},
    role:{type:String,enum:['ADMIN','USER'],default:'USER'}
},{timestamps:true});

const User = mongoose.model("User",userScheme)
export default User;