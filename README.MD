# Creating a RESTful API with Node.js
This repository accompanies my YouTube video series on building a RESTful API with Node.js: [https://github.com/academind/node-restful-api-tutorial.git](https://github.com/academind/node-restful-api-tutorial.git)

## Usage
Check out the branch you're interested in (i.e. which belongs to the video in my series you just watched), ```git clone``` it and thereafter run ```npm install```.

Make sure to also add your Mongo Atlas Admin Username to a nodemon.json file (which you have to create).

```
{
    "env": {
        "MONGO_ATLAS_PW": "YOUR_MONGO_USER_PW"
    }
}
```

Cleaning up the db by year

```
db.flights.remove({date: {$gte: new Date('2006-01-01T00:00:00.000+00:00'), $lte: new Date('2006-12-30T00:00:00.000+00:00')}});
```