IEX Poll Microservice
This service is for pull information about companies: their names, symbols, logo urls and prices.
Initial available symbols are: A, AAON, ABCB, AAN, AAME, AADR, AAPL.

It uses Google Datastore as NoSQL database. 
The database endpoint is set as environment variable `DATASTORE_ENDPOINT`.
To launch it locally use `npm install` to install packages, 
then create .env file in project directory by example of file example.env, 
specify project name and port there
and then run `npm start` to launch server.

You are able to modify pulling interval and companies
by changing config.json file (minutesForUpdate and symbols fields).
The initial companies are: A, AAON, ABCB, AAN, AAME, AADR, AAPL, and interval is 1 minute.

To launch it locally use `npm install` to install packages, 
then create .env file in project directory by example of file example.env, 
specify project name and port there
and then run `npm start` to launch server.

To make this app production-ready one need to: 
 - 