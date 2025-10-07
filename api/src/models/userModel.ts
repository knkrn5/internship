import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
    // userId: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

export default mongoose.model('User', userSchema);