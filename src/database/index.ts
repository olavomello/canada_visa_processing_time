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
async function connSelect( filter : object = {}): Promise<any>{
    // Select all data 
    // Empty filter = all
    try{

        // Check connection
        if ( !isConnected ) await connStart();
        if ( !isConnected ) {
            // Connection error
            return false;
        }
                
        const all = await GraphData.find(filter);
        connEnd();
        // Return
        return all;
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