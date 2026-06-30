import mongoose from "mongoose";
const userSchema=mongoose.Schema({
    name:{
        type:String,
        required:true,

    },
    email:{
        type:String,
        required:true,
        unique: true,
    },
    password:{
        type:String,
        // required:true,
    },
    phone:{
        type:String,
        // required:true
    },
    role:{
        type:String,
        enum:["user","admin"],
        default:"user"
    },
    isVerified: {
        type: Boolean,
        default: false
    },

    verificationToken: String,
    verificationTokenExpires: Date,
    googleId: String,
    avatar: String,

    authProvider: {
        type: String,
        enum: ["local", "google"],
        default: "local"
    },
},{
    timestamps: true,
});

export default mongoose.model('User',userSchema);