const { MongoClient } = require("mongodb");

async function checkDb(nameOfDB , MongoDbUri) {
  let uri=MongoDbUri;
  const client = new MongoClient(uri);
  try {
    // Connect the client to the server
    await client.connect();

    // List all databases
    const adminDb = client.db().admin();
    const dbs = await adminDb.listDatabases();

    // Check if the database exists in the list
    const dbExists = dbs.databases.some((db) => db.name === nameOfDB);

    if (dbExists) {
      console.log("Db Exists");
      return true;
    } else {
      console.log("No Db Exists");
      return false;
    }
  } catch (err) {
    console.error("Error occurred:", err);
    return false;
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
