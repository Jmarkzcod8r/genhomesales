

import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

export async function POST(req) {
  await dbConnect();

  try {
    const { firstName, lastName, age, birthday, status, email, password, isAdmin } = await req.json();

    if (!firstName || !lastName || !age || !birthday || !status || !email || !password) {
      return NextResponse.json({ message: 'Please provide all required fields' }, { status: 400 });
    }

    // Check if the user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = await new UserModel({
      firstName,
      lastName,
      age,
      birthday,
      status,
      email,
      password: hashedPassword,
      isAdmin: isAdmin || false,
    }).save();

    return NextResponse.json({ message: 'User created successfully', user: { user } }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}
