const aws = require('aws-sdk');
const s3 = new aws.S3();
const https = require('https');

exports.handler = async (event, context) => {
    let dataString = '';
    // Environment variables for S3 Bucket & API
    //1. DATA_BUCKET = your bucket name  ( Not arn) 
    //2. STATES_API = https://covidtracking.com/api/states
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
    var key = "covid-data-"+Date.now()+".json";
    var params = {
        Body: JSON.stringify(dataString),
        Bucket: BUCKET,
        Key: key
    };
    const result =  await putObject(params);

    return response;
};

// save data to S3.
const putObject = (params) => {
  return new Promise((resolve, reject) => {
    s3.putObject(params, function (err, result) {
      if(err) reject(err);
      if(result) resolve(result);
    });
  })
}
