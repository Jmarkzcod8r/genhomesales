import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    await dbConnect();

    // Fetch all users from the database
    const users = await UserModel.find({});

    // Return the user data
    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
