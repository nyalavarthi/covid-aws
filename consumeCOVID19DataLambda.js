const aws = require('aws-sdk');
const s3 = new aws.S3();
const https = require('https');
var covid_data = null;

exports.handler = async (event, context) => {
    let dataString = '';
    // Environment variables for S3 Bucket & API
    var STATES_API = process.env.STATES_API;
    var BUCKET = process.env.DATA_BUCKET;

    const response = await new Promise((resolve, reject) => {
        const req = https.get(STATES_API, function(res) {
          res.on('data', chunk => {
            dataString += chunk;
          });
          res.on('end', () => {
            resolve({
                statusCode: 200,
                body: JSON.stringify(JSON.parse(dataString), null, 4)
            });
            
            covid_data = dataString
          });
        });
        
        req.on('error', (e) => {
          reject({
              statusCode: 500,
              body: 'Something went wrong!'
          });
        });
    });
    // Save JSON response into S3
    //console.log("end of promise", covid_data);
    //console.log("bucket name ", BUCKET);
    var key = "covid-data-"+Date.now()+".json";
    var params = {
        Body: JSON.stringify(dataString),
        Bucket: BUCKET,
        Key: key
    };
    const result =  await putObjectWrapper(params);
    //console.log("result of put ", result);
    
    return response;
};


const putObjectWrapper = (params) => {
  return new Promise((resolve, reject) => {
    s3.putObject(params, function (err, result) {
      if(err) reject(err);
      if(result) resolve(result);
    });
  })
}