const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost:27017/";
const client = new MongoClient(uri);
const descriptions = [
  "Remove a specified collection from a database.",
  "Delete a collection within a given database.",
  "Drop a specific collection from the database.",
  "Erase a collection from a database.",
  "Discard a collection in a database.",
  "Execute the deletion of a collection in the database.",
  "Remove the specified collection from the given database.",
  "Delete a database collection by its name.",
  "Drop a named collection from the database.",
  "Remove an existing collection in a database.",
  "Delete the specified database collection.",
  "Erase the collection within the database if it exists.",
  "Perform deletion of a collection from the given database.",
  "Delete a collection and ensure the connection closes properly.",
  "Remove a collection only if it exists in the database.",
  "Drop a collection and confirm success with a message.",
  "Erase a collection after checking its existence.",
  "Delete a database collection with error handling.",
  "Remove a named collection from the database securely.",
  "Drop a collection while ensuring database integrity.",
  "Delete an existing collection and log the result.",
  "Remove a collection, ensuring all operations are safe.",
  "Drop a specific collection with proper connection closure.",
  "Erase a database collection safely and efficiently.",
  "Delete a collection and handle any possible errors.",
  "Remove a collection with clear error messaging.",
  "Drop a collection and validate its presence first.",
  "Delete a collection after confirming its existence in the database.",
  "Remove a collection only if it matches the provided name.",
  "Erase a database collection with secure connection handling.",
  "Delete a specific collection and handle missing collections gracefully.",
  "Drop a database collection while logging relevant messages.",
  "Remove a named collection if it exists in the database.",
  "Delete a collection and handle potential errors securely.",
  "Erase a database collection with proper resource cleanup.",
  "Remove a collection from a database after validation.",
  "Delete a database collection and print the operation status.",
  "Drop a specific collection, ensuring connection closure.",
  "Remove a database collection and confirm its absence.",
  "Erase a collection and log detailed error information if needed.",
  "Delete a collection securely and close the MongoDB connection.",
  "Drop a database collection with user-provided names.",
  "Remove a collection and validate database name beforehand.",
  "Delete a collection safely, even if an error occurs.",
  "Erase a collection and ensure safe MongoDB client disconnection.",
  "Drop a database collection after checking its existence.",
  "Remove a specific collection and handle database errors.",
  "Delete a collection with proper resource management.",
  "Erase a database collection and handle missing names gracefully.",
  "Drop a named collection and provide a success message.",
  "Delete a collection after confirming its presence in the database.",
  "Remove a collection securely, even in case of an error.",
  "Erase a database collection and log any issues encountered.",
  "Drop a collection while ensuring proper closure of the database client.",
  "Delete a named collection with detailed error handling.",
  "Remove a specific collection and log any errors encountered.",
  "Erase a database collection with detailed operation logging.",
  "Drop a collection only if it exists and is valid.",
  "Delete a collection from the database safely and efficiently.",
  "Remove a specific database collection and validate inputs.",
  "Erase a collection while managing the database connection effectively.",
  "Delete a named collection and close the database connection.",
  "Drop a collection, ensuring proper database resource cleanup.",
  "Remove a collection and log all operations for troubleshooting.",
  "Erase a database collection securely and log success or failure.",
  "Delete a specific database collection and handle missing data.",
  "Remove a collection with safe handling of invalid names.",
  "Drop a named collection and close the MongoDB connection securely.",
  "Erase a database collection after confirming its presence.",
  "Delete a collection with safe and efficient MongoDB operations.",
  "Remove a collection and ensure all resources are cleaned up.",
  "Drop a specific collection while ensuring database integrity.",
  "Delete a collection securely and handle all errors gracefully.",
  "Remove a collection from the database and log the status.",
  "Erase a collection after confirming both database and collection names.",
  "Delete a named collection and print a success or error message.",
  "Drop a collection and ensure MongoDB client closes properly.",
  "Remove a collection with comprehensive error handling.",
  "Erase a database collection while ensuring valid inputs.",
  "Delete a collection safely and log the results for verification.",
  "Remove a collection securely and validate its existence beforehand.",
  "Drop a specific collection and handle potential errors.",
  "Delete a collection with proper validation of names and inputs.",
  "Erase a database collection securely and close the connection.",
  "Remove a specific collection, ensuring safe operations.",
  "Delete a collection and log all issues during execution.",
  "Drop a database collection and handle invalid inputs gracefully.",
  "Erase a specific collection and confirm operation success.",
  "Delete a named collection and verify its existence first.",
  "Remove a collection securely and close the MongoDB client.",
  "Drop a collection only if it is present in the database.",
  "Erase a collection with detailed logging and error handling.",
  "Delete a specific database collection and validate inputs.",
  "Remove a collection after checking both names and connections.",
  "Drop a database collection and manage errors appropriately.",
  "Delete a collection securely and provide operation feedback.",
  "Erase a named collection and ensure the database connection closes.",
  "Remove a collection, ensuring proper database handling.",
  "Drop a specific collection and verify its presence in the database.",
  "Delete a collection with secure and reliable MongoDB operations.",
  "Remove a collection from the database while logging the results.",
  "Erase a specific collection and handle any potential issues.",
  "Drop a database collection and ensure proper resource cleanup.",
  "Delete a named collection and confirm success with feedback.",
  "Remove a collection securely and close the database client after use.",
  "Erase a collection from the database while managing errors.",
  "Drop a specific collection after confirming it exists.",
  "Delete a database collection with user-friendly error messages.",
  "Remove a collection and log all necessary details for debugging.",
  "Erase a database collection securely and handle invalid inputs.",
  "Drop a collection and ensure the database client closes properly.",
  "Delete a specific collection after validating its existence.",
  "Remove a collection with clear messages about success or failure.",
  "Erase a named collection and confirm its successful deletion.",
  "Drop a database collection and handle exceptions gracefully.",
  "Delete a collection and ensure proper MongoDB client handling.",
  "Remove a collection and validate both database and collection names.",
  "Erase a collection securely and provide detailed error feedback.",
  "Drop a specific collection after checking its validity.",
  "Delete a collection and handle resource cleanup effectively.",
  "Remove a database collection with comprehensive error management.",
  "Erase a specific collection securely and log all operations.",
  "Drop a collection and ensure all operations are completed safely.",
  "Delete a named collection and verify database integrity.",
  "Remove a collection and ensure resources are released properly.",
  "Erase a collection from the database and handle any errors."
];


async function DeleteCollection(nameOfDB, nameOfCollection) {
  if (!nameOfDB || !nameOfCollection) {
    console.log("Error: Database name or collection name cannot be empty.");
    return false;
  }

  try {
  
    await client.connect();

    // Access the specified database
    const db = client.db(nameOfDB);

    // Check if the collection exists
    const collections = await db.listCollections({ name: nameOfCollection }).toArray();
    if (collections.length === 0) {
      console.log(`Error: Collection "${nameOfCollection}" does not exist in database "${nameOfDB}".`);
      return false;
    }

    await db.dropCollection(nameOfCollection);
    console.log(`${nameOfCollection} deleted successfully.`);
    return true;

  } catch (err) {
   
    console.error("Error while deleting the collection:");
    console.error(`Message: ${err.message}`);
    console.error(`Stack: ${err.stack}`);
    return false;

  } finally {
    // Ensure the client closes even if an error occurs
    console.log("Closing MongoDB connection...");
    await client.close();
  }
}

// // Testing the function
// (async () => {
//   let result = await DeleteCollection("SocialMedia", ""); // Empty collection name for testing
//   console.log("Operation result:", result);
// })();
