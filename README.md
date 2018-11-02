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
init 			// initial connection handshake
auth 			// authorization messages
_u 				// user's auth object
_user
```

### Default API endpoints

These are the available api endpoints you can trigger with socket emits.

#### app.test.access

Basic test for API access.

`{name:string}`

Returns: **app.test.access**

```
ok:boolean
msg:string			// Hello world
```

#### app.verify.password

Verify user's Password

`{password:string}`

Returns: **app.verify.password**

```
ok:true
```

Returns: **app.verify.password**

```
ok:false
msg:array			// any generated error from owasp
?e:error			// runtime errors
```

#### app.verify.name

Verify user's name

`{name:string}`

Returns: **app.verify.name**

```
ok:true
```

Returns: **app.verify.name**

```
ok:false
msg:array			// any generated error from password verification
?e:error			// runtime errors
```

#### app.verify.email

Verify Email Address

`{email:string}`

Returns: **app.verify.email**

```
ok:boolean
```

#### app.user.login

Login User

`{name:string,password:string} || {apiId:string,token:string} `

Returns: **auth**

```
ok:true
name:string			// user name
apiId:string		// user API ID
token:string		// user token
auth:number			// authorization level
```

Returns: **auth**

```
ok:false
msg:string			// error string
e:object 			// runtime errors
```

#### app.user.register

Register and Login User

`{name:string,password:string}`

Returns: **auth**

```
ok:true
name:string			// user name
apiId:string		// user API ID
token:string		// user token
auth:number			// authorization level
```

Returns: **auth.user.register**

```
ok:false
msg:string			// error string
e:object 			// runtime errors
```

#### app.user.logout

Destroy user session

`{}`

Requires: auth

Returns: **app.user.logout**

```
ok:boolean
```

#### app.user.email.set

Set user's email

`{email:string}`

Requires: auth

Returns: **app.user.email.get**

```
ok:true,
```

Returns: **app.user.email.get**

```
ok:false,
msg: string			// error string
?e: object 			// runtime errors
```

#### app.user.email.get

Get user's email

`{}`

Requires: auth

Returns: **app.user.email.get**

```
ok:true,
email:string
```

Returns: **app.user.email.get**

```
ok:false
msg: string			// error string
?e: object 			// runtime errors
```

#### app.user.password.set

Set user's password

`{password:string}`

Requires: auth

Returns: **app.user.password.set**

```
ok:boolean
?e:object 			// runtime errors
```

#### app.user.location.get
#### app.user.location.set

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## Acknowledgments

* [SemVer](https://semver.org/)
* [Good Readme](https://gist.github.com/PurpleBooth/109311bb0361f32d87a2)