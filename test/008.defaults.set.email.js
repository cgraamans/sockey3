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
describe("API - DEFAULT - auth.set.email",()=>{

	beforeEach(()=>{

		client = io.connect(socketURL, options);

	});

	afterEach(()=>{

		client.disconnect();
		userSecret = false;

	});

	it('success - user sets the email address', done=>{

		client.on('connect',data=>{

			client.on('init', data=>{
				
				userSecret = data.secret;
				let name = 'TestUserRegular',
					testEmail = 'test.normalUser@gmail.com';

				let emitData = jwt.sign({name:name,password:process.env.TEST_PASSWORD},userSecret);
				client.emit('auth.login',emitData);

				client.on('auth', authData=>{
					
					let receivedData = jwt.verify(authData,userSecret);
					should(receivedData).have.property('ok', true);
					should(receivedData.user).have.property('name',name);
					should(receivedData.user).have.property('auth',0);

					let getEmailEmit = jwt.sign({
						_u:authData.user,
						email:testEmail
					},userSecret);

					client.emit('auth.set.email',getEmailEmit);
					client.on('auth.set.email', getEmailEmitData=>{
						
						let receivedEmailEmitData = jwt.verify(getEmailEmitData,userSecret);
						should(receivedEmailEmitData).have.property('ok', true);
						done();
						
					});

				});

			});

		});

	});

	it('fails - user has an incorrect email address', done=>{

		client.on('connect',data=>{

			client.on('init', data=>{
				
				userSecret = data.secret;
				let name = 'TestUserRegular',
					testEmail = 'test.normalUser@gmail.';

				let emitData = jwt.sign({name:name,password:process.env.TEST_PASSWORD},userSecret);
				client.emit('auth.login',emitData);

				client.on('auth', authData=>{
					
					let receivedData = jwt.verify(authData,userSecret);
					should(receivedData).have.property('ok', true);
					should(receivedData.user).have.property('name',name);
					should(receivedData.user).have.property('auth',0);

					let getEmailEmit = jwt.sign({
						_u:authData.user,
						email:testEmail
					},userSecret);

					client.emit('auth.set.email',getEmailEmit);
					client.on('auth.set.email', getEmailEmitData=>{
						
						let receivedEmailEmitData = jwt.verify(getEmailEmitData,userSecret);
						should(receivedEmailEmitData).have.property('ok', false);
						should(receivedEmailEmitData).have.property('msg', 'invalid email address');

						done();
						
					});

				});

			});

		});

	});

});