require("dotenv").config();
const readline = require("readline");
const aws = require("aws-sdk");
const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET
}); //create a s3 Object with s3 User ID and Key

const read = async () => {
  return new Promise(resolve => {
    const urls = [];
    const params = {
      Bucket: "xc-league",
      Key: "scraper/flights-2019.txt"
    };
    let rl;
    try {
      rl = readline.createInterface({
        input: s3.getObject(params).createReadStream()
      });
    } catch (err) {
      console.log(err);
    }

    rl.on("line", function(line) {
      urls.push(line.replace(/['"]+/g, ''));
    }).on("close", function() {
      console.log("closed stream", urls.length);
      return resolve(urls);
    });
  });
};

module.exports = read;
