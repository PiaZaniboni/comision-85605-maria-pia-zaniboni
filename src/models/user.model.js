import mongoose  from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    age: { type: Number, required: true, min: 0 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
}, { timestamps: true });

export const UserModel = mongoose.model('User', userSchema);