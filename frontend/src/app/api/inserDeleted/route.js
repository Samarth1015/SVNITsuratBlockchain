import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export default async function POST(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    // Connect to the MongoDB database
    if (!client.isConnected()) {
      await client.connect();
    }

    const db = client.db(); // Use the default database
    const collection = db.collection("deletedData"); // Your collection name

    const { data, hash } = req.body;

    if (!data || !hash) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Insert the deleted data directly into the collection
    const result = await collection.insertOne({
      data,
      hash,
    });

    return res
      .status(201)
      .json({ message: "Data inserted successfully", data: result.ops[0] });
  } catch (error) {
    console.error("Error inserting data:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  } finally {
    await client.close();
  }
}
