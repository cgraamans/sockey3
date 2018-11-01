var should = require('should');
var io = require('socket.io-client');
var jwt = require('jsonwebtoken');

var socketURL = 'http://0.0.0.0:9001';

var options ={
	transports: ['websocket'],
	'force new connection': true
};

let userSecret = false;
let client = false;
describe("API - DEFAULT - auth.login",()=>{

	beforeEach(()=>{

		client = io.connect(socketURL, options);

	});

	afterEach(()=>{

		client.disconnect();
		userSecret = false;

	});

	it('success - regular user', done=>{

		client.on('connect',data=>{

			client.on('init', data=>{
				
				userSecret = data.secret;
				let name = 'TestUserRegular';

				let emitData = jwt.sign({name:name,password:process.env.TEST_PASSWORD},userSecret);
				client.emit('auth.login',emitData);

				client.on('auth', authData=>{
					
					let receivedData = jwt.verify(authData,userSecret);
					should(receivedData).have.property('ok', true);
					should(receivedData.user).have.property('name',name);
					should(receivedData.user).have.property('auth',0);
					done();

				});

			});

		});

	});

	it('success - administrative user', done=>{

		client.on('connect',data=>{

			client.on('init', data=>{
				
				userSecret = data.secret;
				let name = 'TestUserAdmin';

				let emitData = jwt.sign({name:name,password:process.env.TEST_PASSWORD},userSecret);
				client.emit('auth.login',emitData);

				client.on('auth', authData=>{
					
					let receivedData = jwt.verify(authData,userSecret);
					should(receivedData).have.property('ok', true);
					should(receivedData.user).have.property('name',name);
					should(receivedData.user).have.property('auth',2);
					done();

				});

			});

		});

	});

	it('fails - non-existant user', done=>{

		client.on('connect',data=>{

			client.on('init', data=>{
				
				userSecret = data.secret;
				let name = 'noThisUser';

				let emitData = jwt.sign({name:name,password:process.env.TEST_PASSWORD},userSecret);
				client.emit('auth.login',emitData);

				client.on('auth', authData=>{
					
					let receivedData = jwt.verify(authData,userSecret);
					should(receivedData).have.property('ok', false);
					should(receivedData).have.property('msg', 'user not found');
					done();

				});

			});

		});

	});

});