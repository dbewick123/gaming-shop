# Gaming Shop API
A project I took on for fun to help learn node.js and related frameworks

## Description
A fictional Node.js e-commerce API that simulates the back end of a video gaming shop. A more detailed description of each aspect can be seen below:

- API: The API contains end points for Users (inc authentication & authorisation), Products, Carts & Orders. Then core node.js uses express.js as a server to run the api as well as handle all the routing for requests.
- Authentication: Authentication uses local sessions with a secret key to validate logged-in users for authorisation routes.
- Database: Postgres is used as the data storage layer, there is both a test and a dev database.
- ORM: Sequelize has been used to connect API to Data layer. I wanted to ensure abstraction for future extention/refactor

## Documentation
The swagger documentation can be found here: https://app.swaggerhub.com/apis-docs/DaveBewick/game-shop-api/1.0.0#/

## Installation

1. Clone this repo & install all dependencies with npm install. You will need node and npm installed already for this. 
2. Create a postgres DB on your local machine and update the database.js & testDatabase.js files with connection info. Note, you need to create an empty test and a dev database in this step
3. Run the setup.sql file to create your database tables in both test and dev. This will only setup your database structure, without data. 
4. Create a .env file at root level and include the following. Note the secret key can be anything you choose, however, I recommend using an online tool to generate a long key for you. 

    `SESSION_SECRET=YOUR_SECRET_KEY_HERE`
  
    `DB_NAME=YOUR_DEV_DB_NAME_HERE`
  
    `TEST_DB_NAME=YOUR_TEST_DB_NAME_HERE`
5. Run the server/api in terminal with `node api.js` 

## Testing
Testing can be ran from the project folder using jest, it will automatically use the test db and all tests populate the database with data appropriately, data is then wiped before each run.

