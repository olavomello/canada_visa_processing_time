if ( process.env.NODE_ENV != 'production' )  require('dotenv-safe').config({ silent: true });
import express from 'express';
import http from "http";
import https from "https";
import cors from "cors";

// Start server
const app = express();
const port = ( process.env.PORT || 3001 );

// Receive JSON
app.use(express.json());

// Cors options for cors midddleware
// List of allowed origins
const allowedOrigins = ['http://localhost:'+port,'https://localhost:'+port,"https://canada-visa-processing-time.vercel.app:"+port,"https://canada-visa-processing-time.vercel.app","https://canada-visa-processing-time.herokuapp.com","*"];

// Cor options
const corsOptions: cors.CorsOptions = {
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'X-Access-Token',
  ],
  origin: allowedOrigins,
  credentials: true,
  methods: 'GET,HEAD,OPTIONS,PUT,POST,DELETE',
  preflightContinue: false,
};

// Server options ***

// Cors pre-flight  
app.use(cors(corsOptions));

// Routes ---------
app.get('/get', (req, res) => {

    // URL
    const URL : string = "https://www.canada.ca/content/dam/ircc/documents/json/data-ptime-en.json";

    https.get(URL, ( urlRes : any ) => {
      // Body
      let body = '';

      // Read data
      urlRes.on('data', (chunk : any) => (body += chunk.toString()));

      // On error
      urlRes.on('error', ( err : any ) => res.send( "Request failed" ));

      // On end
      urlRes.on('end', () => {
        if (urlRes.statusCode >= 200 && urlRes.statusCode <= 299) {
            // Ok
            let jsonData = JSON.parse(body);

            // Find Visa BR on types
            const VOC : string = jsonData["visitor-outside-canada"]["BR"];
            const SUP : string = jsonData["supervisa"]["BR"];
            const STD : string = jsonData["study"]["BR"];
            const WOR : string = jsonData["work"]["BR"];
            const CHD : string = jsonData["child_dependent"]["BR"];
            const CHA : string = jsonData["child_adopted"]["BR"];
            const REG : string = jsonData["refugees_gov"]["BR"];
            const REP : string = jsonData["refugees_private"]["BR"];
            
            // Send BR data   
            res.send({VOC,SUP,STD,WOR,CHD,CHA,REG,REP});
        } else {
            // Error
            res.send("Request failed. status: " + urlRes.statusCode);
        }
      });
    });
});

// Index ---------
app.get('/', function(req : any, res : any){
  // Return HTML
  res.sendFile('public_html/index.html', { root : __dirname });
});

// Start server
app.listen(port).setTimeout(10000); // Timeout msecs;

// Started
console.log("Server listen on port", port);