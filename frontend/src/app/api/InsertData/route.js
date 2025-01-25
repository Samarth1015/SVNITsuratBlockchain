const {MongoClient} = require("mongodb")



async function insertData(nameOfDB , nameOfColletion , data , MongodbUri) {
    let uri = MongodbUri;
    const client = new MongoClient(uri)
    if(!Array.isArray(data)) {
        console.error("Kindly Add Array in Data nothing other then that !!");
        
        return false;
    }
    if(!nameOfColletion || !nameOfDB){
        console.error("Please Enter the Name of Database or Collection Correctly!!");
        return false;
    }
    try{
        await client.connect();
        const db = client.db(nameOfDB);
        const col = db.collection(nameOfColletion);
        const res = col.insertMany(data);
        
        return true;
    }
    catch (err){
        console.log(err);
        return false;
        
    }
}
