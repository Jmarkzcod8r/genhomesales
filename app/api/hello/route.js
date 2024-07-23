// app/api/hello/route.js
import { MongoClient } from 'mongodb';

const client = new MongoClient('mongodb://localhost:27017', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export async function GET() {
  try {
    await client.connect();
    const db = client.db('mydatabase'); // Replace with your database name
    const collection = db.collection('mycollection'); // Replace with your collection name

    // Fetch data from MongoDB
    const data = await collection.find({}).toArray();

    // Respond with JSON data
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  } finally {
    await client.close();
  }
}
