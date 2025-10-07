import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
    // userId: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
}, { timestamps: true });


// This model uses the mongoose connection established earlier
export default mongoose.model('User', userSchema);