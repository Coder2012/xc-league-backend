
const aws = require('aws-sdk'); //require aws-sdk
require('dotenv').config();
const file = require('fs').createWriteStream('../../tmp/flights-2019.js');
const s3 = new aws.S3({ accessKeyId: process.env.AWS_ACCESS_KEY, secretAccessKey: process.env.AWS_SECRET }); //create a s3 Object with s3 User ID and Key

const read = async () => {
    const params = {
        Bucket: 'xc-league',
        Key: 'scraper/flights-2019.js'
    }
    
    s3Promise = s3.getObject(params).promise();

        s3Promise.then((data) => {
          file.write(data.Body, () => {
            file.end();
          });
        }).catch((err) => {
          console.log(err);
        });

    return s3Promise;
};

module.exports = read;