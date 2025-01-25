const { MongoClient } = require("mongodb");
const { ObjectId } = require("mongodb");




async function readConditionData(nameOfDB, nameOfCollection, atrs , MongodbUri) {
  let uri = MongodbUri
  const client = new MongoClient(uri);

  try {
    // Connect to the database
    await client.connect();

    // Get database and collection references
    const database = client.db(nameOfDB);
    const collection = database.collection(nameOfCollection);

    // Fetch all documents
    const res = await collection.find({}).toArray();

    // Use a Set to ensure uniqueness
    const uniqueResults = new Set();

    // Apply filters dynamically
    const response = res.filter((doc) => {
      const matches = atrs.every(({ field, operator, value }) => {
        if (Array.isArray(value)) {
          // Handle array of values (like `$in` in MongoDB)
          if (operator === "==") {
            return value.includes(doc[field]);
          } else if (operator === "!=") {
            return !value.includes(doc[field]);
          } else {
            throw new Error(`Unsupported operator for array: ${operator}`);
          }
        } else {
          switch (operator) {
            case "<":
              return doc[field] < value;
            case "<=":
              return doc[field] <= value;
            case ">":
              return doc[field] > value;
            case ">=":
              return doc[field] >= value;
            case "==":
              return doc[field] == value;
            case "!=":
              return doc[field] != value;
            default:
              throw new Error(`Unsupported operator: ${operator}`);
          }
        }
      });

      // If the document matches, add it to the Set
      if (matches) {
        uniqueResults.add(JSON.stringify(doc)); // Serialize document to avoid object reference issues
      }

      return matches;
    });

    // Convert the Set back to an array and return unique results
    return Array.from(uniqueResults).map((doc) => JSON.parse(doc));
  } catch (err) {
    console.error("Error filtering data:", err);
    return [];
  } finally {
    // Ensure the client is closed after the operation
    await client.close();
  }
}

async function DeleteConditionBased(nameOfDB, nameOfCollection, atrs) {
  const client = new MongoClient(uri);

  try {
    // Connect to MongoDB
    await client.connect();
    const database = client.db(nameOfDB);
    const collection = database.collection(nameOfCollection);

    // Get data to update based on conditions
    const dataToUpdate = await readConditionData(
      nameOfDB,
      nameOfCollection,
      atrs
    );
    const response = [];

    for (const data of dataToUpdate) {
      const filter = { _id: new ObjectId(data._id) };

      const result = await collection.deleteOne(filter);
      response.push(result);
    }
    console.log(`${response.length} data affected!`);

    // Return the update results
    return true;
  } catch (error) {
    console.error("Error updating data:", error);
    return false;
  } finally {
    // Ensure the client is closed
    await client.close();
  }
}

// // Usage Example
// (async () => {
//   const atrs = [{ field: "age", operator: "<", value: 100 }];

//   const results = await DeleteConditionBased("jenil", "pamrar", atrs);
//   console.log(results);
// })();
