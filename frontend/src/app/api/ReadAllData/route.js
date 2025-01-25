const { MongoClient } = require("mongodb");



async function readAllData(nameOfDB, nameOfCollection , MongodbUri) {
  let uri = MongodbUri;
  const client = new MongoClient(uri);
  try {
    // Connect to the database
    await client.connect();

    // Get database and collection references
    const database = client.db(nameOfDB);
    const collection = database.collection(nameOfCollection);

    // Insert the provided data
    const res = await collection.find({}).toArray();
    console.log("Data Inserted Successfully!");

    return res;
  } catch (err) {
    console.error("Error inserting data:", err);
    return [{}];                           
  } finally {
    // Ensure the client is closed after the operation
    await client.close();                             
  }
}

// // Usage example
// (async () => {
//   const res = await readAllData("SocailMedia", "posts");
//   console.log(res);
// })();
