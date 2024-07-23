// /model/User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    age: { type: Number, required: true },
    birthday: { type: Date, required: true },
    status: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },

    // priority: { type: Number, required: true , default: 0 },

  },
  { timestamps: true }
);

const UserModel = mongoose.models?.User || mongoose.model('User', UserSchema);

export default UserModel;
