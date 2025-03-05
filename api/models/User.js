import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        required: true
    },
    firstname: {
        type: String,
        required: true,
        trim: true,
    },
    lastname: {
        type: String,
        required: true,
        trim: true,
    },
    birthdate: {
        type: Date,
        required: true,
        max: new Date()
    },
    city: {
        type: String,         
        required: true,
    },
    country: {
        type: String,         
        required: true,
    },
    photo: {
        type: String,         
    },
    phone: {
        type: String,
        required: true,
        trim: true,
        validate: /^([\+]?[(]?[0-9]{2,3}[)]?)?[-\s\.]?[0-9]{1,3}([-\s\.]?[0-9]{2,4}){4,6}$/
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate: /^[A-zÀ-ÿ\-.]+@([\w-]+\.)+[\w-]{2,4}$/
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    category:{
        type:String,
        enum:['Marketing','Client','Technique'],
        required: true,
    }
    ,isAdmin:{
        type:Boolean,
        required:true
    }
}, {
    timestamps: true
})
export const UserModel = mongoose.model("User", UserSchema);