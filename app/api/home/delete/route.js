import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import { NextResponse } from 'next/server';

export async function DELETE(req) {
  try {
    await dbConnect();

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const deletedUser = await UserModel.findByIdAndDelete(id);

    if (!deletedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
