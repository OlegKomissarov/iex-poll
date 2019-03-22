# IEX Poll Microservice

The service for pull information about companies: their names, symbols, logo urls and prices. Initial available symbols are: A, AAON, ABCB, AAN, AAME, AADR, AAPL.

It uses Google Datastore as NoSQL database and pull data from IEX API. The database endpoint is set as environment variable `DATASTORE_ENDPOINT`.

You are able to modify pulling interval and companies by changing config.json file (minutesForUpdate and symbols fields). The initial companies are: A, AAON, ABCB, AAN, AAME, AADR, AAPL, and interval is 1 minute.

To launch it locally use `npm install` to install packages, then create .env file in project directory by example of example.env file, specify project name and port there and then run `npm start` to launch server.

To make this app production-ready one need to: 
 - Add tests.
 - Move all messages like "App listening on port" or "Not found" to config file to make app extensible to translations.
 - Handle errors when one trying to get information about company by symbol that doesnt exist.
 - Make datastore variable KIND dynamic.
 - Use axios for pulling IEX API
