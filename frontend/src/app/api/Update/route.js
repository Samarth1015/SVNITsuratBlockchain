const { MongoClient } = require("mongodb");
const { ObjectId } = require("mongodb");



async function readConditionData(nameOfDB, nameOfCollection, atrs , MongoDbUri) {
  let uri = MongoDbUri;
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
          // Handle regular single-value conditions
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

async function updateData(nameOfDB, nameOfCollection, atrs, changeAtrs) {
  const client = new MongoClient(uri);

    
  try {
    // Connect to MongoDB
    await client.connect();
    const database = client.db(nameOfDB);
    const collection = database.collection(nameOfCollection);

    // Get data to update based on conditions
    const dataToUpdate = await readConditionData(nameOfDB, nameOfCollection, atrs);
    const response = [];

    
    // Iterate over the database and check if the _id matches
    for (const data of dataToUpdate) {
        
        // Assuming the data contains _id as an ObjectId
        const filter = { _id:(new ObjectId(data._id)) }; // Convert string _id to ObjectId
        

      // Update the specific field in the database
      const update = { $set: { [changeAtrs['field']]: changeAtrs['value'] } };

      // Perform the update operation
      const result = await collection.updateOne(filter, update);
      response.push(result);
    }

    // Return the update results
    return `${response.length} data affected!`;
  } catch (error) {
    console.error("Error updating data:", error);
    return [];
  } finally {
    // Ensure the client is closed
    await client.close();
  }
}

// Usage Example
(async () => {
  const atrs = [
    { field: "age", operator: "<", value: 100 },
  ];

  const changeAtrs = {
    field: "name",
    value: "hogaya",
  };

  const results = await updateData("jenil", "pamrar", atrs, changeAtrs);
  console.log(results); // Logs the results of the update operations
})();
