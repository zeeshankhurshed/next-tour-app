import mongoose from 'mongoose';

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:false,
    },
    confirmPassword:{
        type:String,
        required:false,
    },
    googleId:{
        type:String,
        required:false,
    },
    id:{
        type:String,
    },
    profilePicture:{
        type:String,
        default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlie4MsQ9pJSSKY7DoEpxn3uBAq-rT7in1sA&s",

    }
},{timestamps:true})

const User=mongoose.model("User",userSchema);

export default User;