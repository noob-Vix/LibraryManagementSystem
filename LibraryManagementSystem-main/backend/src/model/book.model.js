import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
    title:{type:String, required:true},
    author:{type:String,required:true},
    isbn:{type:String,required:true},
    year:{type:Number},
    totalCopies:{type:Number,required:true},
    availableCopies:{type:Number,required:true},
},{timestamps:true})

export const Book = mongoose.model("Book",bookSchema)