import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';

const client = new MongoClient('mongodb://localhost:27017', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export async function POST(req) {
  const { email, password } = await req.json();

  try {
    await client.connect();
    const db = client.db('mydatabase');
    const collection = db.collection('users'); // Ensure this matches your collection name

    // Find user by email
    const user = await collection.findOne({ email });
    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }

    // Compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return new Response(JSON.stringify({ error: 'Invalid password' }), { status: 401 });
    }

    // Respond with success
    return new Response(JSON.stringify({ message: 'Login successful', user: {user} }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  } finally {
    await client.close();
  }
}
