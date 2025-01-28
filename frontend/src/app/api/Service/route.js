import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";
import {sendReqToModel} from './SendReqToModel.js' 
export async function POST(req) {
  try {
    // Extract data from the request body
    const { nameOfDB, nameOfCollection, paragraph, MongoDbUri } =
      await req.json();

    // Validate the required parameters
    if (!nameOfDB || !nameOfCollection || !MongoDbUri || !paragraph) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message:
            "Missing required fields (nameOfDB, nameOfCollection, MongoDbUri , paragraph)",
        }),
        { status: 400 }
      );
    }

    const [intent , ... rest] = await sendReqToModel(paragraph);
    



    
    

    // Respond with the data
    return new NextResponse(JSON.stringify({ success: true, data: data }), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500 }
    );
  }
}

