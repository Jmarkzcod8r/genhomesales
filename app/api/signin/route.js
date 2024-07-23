import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const { email, password } = await req.json();

  try {
    await dbConnect();

    // Find user by email
    const user = await UserModel.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    // Respond with success
    return NextResponse.json({ message: 'Login successful', data: { user } }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
