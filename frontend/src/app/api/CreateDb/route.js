const { MongoClient } = require("mongodb");



async function createDb(nameOfDB, nameOfCollection, dataInArray , MongodbUri) {
  let uri = MongodbUri
  const client = new MongoClient(uri);
  try {
    // Connect to the database
    await client.connect();

    // Get database and collection references
    const database = client.db(nameOfDB);
    const collection = database.collection(nameOfCollection);

    // Insert the provided data
    await collection.insertMany(dataInArray);
    console.log("Data Inserted Successfully!");

    return true;
  } catch (err) {
    console.error("Error inserting data:", err);
    return false;
  } finally {
    // Ensure the client is closed after the operation
    await client.close();
  }
}

// Usage example
// (async () => {
//   const res = await createDb("jenil", "pamrar", [
//     { name: "Hi", age: 14 },
//     { name: "Hello", age: 18 },
//     { name: "Hey", age: 20 },
//   ]);
//   console.log(res);
// })();
