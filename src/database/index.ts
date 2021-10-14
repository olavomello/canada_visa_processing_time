// MongoDB connection
if ( process.env.NODE_ENV != 'production' )  require('dotenv-safe').config({ silent: true });
import { MongoClient, MongoClientOptions  } from "mongodb";
// import * as Mongoose from "mongoose";

export default function DB(){
    
    // Config
    const HOST = process.env.DB_HOST || '';
    const USER = process.env.DB_USER || '';
    const PASS = process.env.DB_PASS || '';

    // Check 
    if( !( HOST && USER && PASS ) ) {
        // Config error
        console.warn('DB config error');
        return false;
    }

    // URL
    const uri  : string = `mongodb+srv://${USER}:${PASS}@${HOST}/myFirstDatabase?retryWrites=true&w=majority`;
    const opts : MongoClientOptions = {
        useNewUrlParser     : true, 
        useUnifiedTopology  : true
    }; 
    const client = new MongoClient(uri, opts);

    // Try to connect
    client.connect( ( err : any ) => {
        // Get colletion
        const collection = client.db("test").collection("devices");
        // Trace error
        console.log(collection, err);
        // Close DB
        client.close();
    });
}