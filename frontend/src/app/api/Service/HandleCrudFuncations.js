// import { createDb } from "../CreateDb/route";
// import { DeleteCollection } from "../DeleteCollection/route";
// import { DeleteConditionBased } from "../DeleteConditionBased/route";
// import { insertData } from "../InsertData/route";
// import { readAllData } from "../ReadAllData/route";
// import { readConditionData } from "../ReadConditionBased/route";
// import { updateData } from "../Update/route";
// data = [dataTOInsert ,  ]

 
async function HandleCrudFuncutions(
  intent,
  nameOfDB,
  nameOfCollection,
  MongoDbUri,
  ...data
) {
  if (String(intent).toLowerCase() === "create") {
    const res = await createDb(nameOfDB, nameOfCollection, data[0], MongoDbUri);
    return true;
  } else if (String(intent).toLowerCase() === "read") {
    const res = await readAllData(nameOfDB, nameOfCollection, MongoDbUri);
    return;
  } else if (String(intent).toLowerCase() === "delete") {
    // Handle delete case
  } else if (String(intent).toLowerCase() === "delete_conditioned_based") {
    // Handle delete_conditioned_based case
  } else if (String(intent).toLowerCase() === "read_condition_based_data") {
    // Handle READ_CONDITION_BASED_DATA case
  } else if (String(intent).toLowerCase() === "insert") {
    // Handle INSERT case
  } else {
    // Handle default case
  }
}

console.log(
  HandleCrudFuncutions("read", "jenil", "pamrar", "mongodb://localhost:27017/")
);
