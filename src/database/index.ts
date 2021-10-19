// MongoDB connection
if ( process.env.NODE_ENV != 'production' )  require('dotenv-safe').config({ silent: true });
import { connect, Schema, model } from 'mongoose';

// Config
const HOST : string           =  ( process.env.DB_HOST || '' );
const NAME : string           =  ( process.env.DB_NAME || '' );
const USER : string           =  ( process.env.DB_USER || '' );
const PASS : string           =  ( process.env.DB_PASS || '' );

// Globals
var isConnected : boolean = false;
var connection : any = null;

// Models
const GraphSchema = new Schema({
    VOC       : { type : String },
    SUP       : { type : String },
    STD       : { type : String },
    WOR       : { type : String },
    CHD       : { type : String },
    CHA       : { type : String },
    REG       : { type : String },
    REP       : { type : String },
    createAt  : {
        type    : Date,
        default : new Date()
    }   
},{ collection: 'processing_time_brazil' });
const GraphData     =  model('graph', GraphSchema);

// Function connection start
async function connStart(): Promise<boolean>{
    
    if( !HOST || !USER || !PASS ) {
        console.warn("Connection config error !");
        return false;
    }

    // Connetion string
    const CONN_STRING : string  =   `mongodb+srv://${USER}:${PASS}@${HOST}/${NAME}?retryWrites=true&w=majority&ssl=true`;

    try {
        // Connect to MongoDB
        connection = await connect(CONN_STRING);
        // Connection success
        isConnected = true;

        // End Connection
        connEnd();

        return isConnected;
    } catch (error) {
        // Connection error
        console.warn("Connection error :", error);
        isConnected = false;

        // End Connection
        connEnd();        

        return isConnected;
    }
}
// Function connect end
function connEnd(): boolean{
    if ( isConnected ){
        // Connected
    }
    return true;
}

// Function Add Data
async function connAdd( dataValues : any ): Promise<boolean>{
    
    // Check connection
    if ( !isConnected ) await connStart();
    if ( !isConnected ) {
        // Connection error
        return false;
    }

    // No data sent 
    if( !dataValues ) return false;
    
    // Model add
    const addData   =   new GraphData(dataValues);
    // Save
    addData.save( (err:any, response:any) => {
        if (err) {
            // Error
            console.error(err);
            return false;
        }
        // Sucessfully
        return true;
    });  

    // On await error
    return false;    
}

// Database select
async function connSelect( filter : object = {} ): Promise<any>{
    // Select all data 
    // Empty filter = all
    try{

        // Check connection
        if ( !isConnected ) await connStart();
        if ( !isConnected ) {
            // Connection error
            return false;
        }
            
        // Result 
        let result;

        // Await select
        result = await GraphData.aggregate([
            {
                $match    : filter
            },
            {
                $group    : 
                    { 
                        _id: {
                            dte     : { $dateToString: { format: "%Y-%m-%d-%H", date: "$createAt" } },
                            dtef    : { $dateToString: { format: "%d/%m/%Y %Hhs", date: "$createAt" } },
                            VOC     : { $convert: { input:{ $replaceOne: { input: "$VOC", find: " days", replacement: "" } }, to: "int" }},
                            SUP     : { $convert: { input:{ $replaceOne: { input: "$SUP", find: "No processing time available", replacement: "0" } }, to: "int" }},
                            STD     : { $multiply: [ { $convert: { input:{ $replaceOne: { input: "$STD", find: " weeks", replacement: "" }}, to: "int" }},7 ]},
                            WOR     : { $multiply: [ { $convert: { input:{ $replaceOne: { input: "$WOR", find: " weeks", replacement: "" }}, to: "int" }},7 ]},
                            CHD     : { $convert: { input:{ $replaceOne: { input: "$CHD", find: "No processing time available", replacement: "0" } }, to: "int" }},
                            CHA     : { $convert: { input:{ $replaceOne: { input: "$CHA", find: "No processing time available", replacement: "0" } }, to: "int" }},
                            REG     : { $convert: { input:{ $replaceOne: { input: "$REG", find: "No processing time available", replacement: "0" } }, to: "int" }},
                            REP     : { $convert: { input:{ $replaceOne: { input: "$REP", find: "No processing time available", replacement: "0" } }, to: "int" }},                             
                        }                  
                    }
            },
            {
                $sort : 
                    {
                        _id   : 1 /* _id ASC */
                    }
            },
            { 
                $project: {  
                    _id     :   0,
                    col     :   "$_id",
                    VOC     :   "$VOC",
                    SUP     :   "$SUP",
                    STD     :   "$STD",
                    WOR     :   "$WOR",
                    CHD     :   "$CHD",
                    CHA     :   "$CHA",
                    REG     :   "$REG",
                    REP     :   "$REP",
                    dte     :   "$dte"
                }
            }             
        ]); 
        // End connection
        connEnd();
        
        // Return
        return result;
    } catch(error){
        // error
        connEnd();
        return error;
    }
}

export {
    connStart,
    connEnd,
    connAdd,
    connSelect
}