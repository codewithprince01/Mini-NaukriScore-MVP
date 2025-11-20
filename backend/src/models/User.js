import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    Name: { type: String, required: true, trim: true },
    Email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    Password: { type: String, required: true }
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;
