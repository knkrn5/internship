import mongoose from 'mongoose';
const { Schema } = mongoose;
import bcrypt from 'bcrypt';

const userSchema = new Schema({
    // userId: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
}, { timestamps: true });


// middleware for hashing password
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    //   const salt = await bcrypt.genSalt(10);
    const saltRounds = 10
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();

    //    try {
    //     const salt = await bcrypt.genSalt(10);
    //     this.password = await bcrypt.hash(this.password, salt);
    //     return next();
    //   } catch (err) {
    //     return next(err as Error);
    //   }
});


// This model uses the mongoose connection established earlier
export default mongoose.model('User', userSchema);