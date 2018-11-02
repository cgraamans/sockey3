# ![alt text](https://raw.githubusercontent.com/cgraamans/sockey/master/client/img/logo48.png "Sockey!") Sockey3

### A Standalone NodeJS/Socket.IO API Framework for web applications.

Sockey is a Easy, Lightweight, Scalable and Secure Server-side [Socket.IO](https://socket.io) framework, specifically made to divorce server-side and client-side processing for high-end containerized web application deployments.

It is perfect for creating web-socket enabeld web applications by providing a REDIS-ready, MySQL/MariaDB-supported API with JWT/HS256 secured transactions.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

What things you need to install the software and how to install them

```
- MySQL Database
- NodeJS v8+ (tested up to 10)
- (optional) Apache or other web server to hook into
```

### Installing

A step by step series of examples that tell you how to get a development env running

Set the environmental variables

```
export _DB_USERNAME=""
export _DB_PASSWD=""
export _DB="sockey3"
export TEST_PASSWORD=""
```

Import the mysql schema into the database you've created for this project

```
mysql -u[username] -p[password] [databasename] < init/mysql/base.sql
```

Install npm packages

```
npm i
```

Run the service 

```
npm start
```

## Running the tests

Run the tests with mocha 

```
npm test
```

## API guide

The API guide denotes reserved endpoints and default API endpoints.

### Reserved endpoints

```
init 						// initial connection handshake
auth 						// authorization messages
```

### Default API endpoints

These are the available api endpoints you can trigger with socket emits.

```
app.test.access 			// check socket return value
app.verify.password 		// verify password string with OWASP
app.verify.name 			// verify user name string
app.verify.email 			// verify user email string
app.user.login 				// create session for user
app.user.register 			// create user and login
app.user.logout 			// destroy session for user
app.user.email.set 			// set user email
app.user.email.get 			// get user email
app.user.password.set 		// set user password
app.user.location.get 		// get user location
app.user.location.set 		// set user location
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## Acknowledgments

* [SemVer](https://semver.org/)
* [Good Readme](https://gist.github.com/PurpleBooth/109311bb0361f32d87a2)