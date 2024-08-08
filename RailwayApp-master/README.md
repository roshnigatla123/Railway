# RailwayApp

  This is a Railway App similar to IRCTC. All Booking and PNR checking related functions have been added. Hope you enjoy using my app.

## Getting Started

  Just Git-Pull the files and run **npm install** then start the server using **npm start**

### Prerequisites

  NodeJS must be installed
  Angular CLI must be installed
  MongoDB must be installed
  Python must be installed

### Installing

  First we need to install the datastore files database by issuing
  $ mongoimport --jsonArray --db <dbName> --collection <collectionName> --drop --file <file location of the .json file>;
  
  Then just start the respective servers for Angular and Express.
  $ npm start

## Server Details

	1. The backend express server will be running on http://localhost:3000/
	2. The frontend angular server will be running on http://localhost:4200/

## Major Services
  
  1. The Transactional messaging service for OTP and Success are being sent through Twilio
      App ID and Secret must be provided.
  2. The Mailer service is provided by Nodemailer and hence email id and password must be provided.
  3. Authentication of user is done using JWT.

## Authors

 **Abhishek Roy**

See also the list of [contributors](https://github.com/AbhiRoy96/RailwayApp/contributors) who participated in this project.

## License

This project is licensed under the GNU General Public License v3.0 and Authors


