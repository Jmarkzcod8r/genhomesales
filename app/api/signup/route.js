// // app/api/signup/route.js
// import { MongoClient } from 'mongodb';
// import bcrypt from 'bcrypt';
// import * as dotenv from 'dotenv';

// dotenv.config();

// const client = new MongoClient(process.env.MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// const saltRounds = 10;

// export async function POST(request) {
//   try {
//     const { firstName, lastName, age, birthday, status, email, password } = await request.json();

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, saltRounds);

//     // Connect to MongoDB
//     await client.connect();
//     const db = client.db('mydatabase'); // Replace with your database name
//     const collection = db.collection('users'); // Replace with your collection name

//     // Insert the new user
//     const result = await collection.insertOne({
//       firstName,
//       lastName,
//       age,
//       birthday,
//       status,
//       email,
//       password: hashedPassword,
//     });

//     // Respond with success message
//     return new Response(
//       JSON.stringify({ message: 'User created successfully', userId: result.insertedId }),
//       { headers: { 'Content-Type': 'application/json' } }
//     );
//   } catch (e) {
//     console.error(e);
//     return new Response(
//       JSON.stringify({ error: 'Internal Server Error' }),
//       { status: 500, headers: { 'Content-Type': 'application/json' } }
//     );
//   } finally {
//     await client.close();
//   }
// }


// pages/api/signup.js
// /app/api/signup/route.js


// /app/api/signup/route.js
// /app/api/signup/route.js
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import { NextResponse } from 'next/server';

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

    // Create a new user
    // const user = new UserModel({
    //   firstName,
    //   lastName,
    //   age,
    //   birthday,
    //   status,
    //   email,
    //   password,
    //   isAdmin: isAdmin || false,
    // });

    // await user.save();

    const user = await new UserModel({
        firstName,
        lastName,
        age,
        birthday,
        status,
        email,
        password,
        isAdmin: isAdmin || false,
      }).save()

    return NextResponse.json({ message: 'User created successfully', user: {user} }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}
