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
describe("API - DEFAULT - app.user.email.get",()=>{

	beforeEach(()=>{

		client = io.connect(socketURL, options);

	});

	afterEach(()=>{

		client.disconnect();
		userSecret = false;

	});

	it('success - user gets the correct email', done=>{

		client.on('connect',data=>{

			client.on('init', data=>{
				
				userSecret = data.secret;
				let name = 'TestUserRegular';

				let emitData = jwt.sign({name:name,password:process.env.TEST_PASSWORD},userSecret);
				client.emit('app.user.login',emitData);

				client.on('auth', authData=>{
					
					let receivedData = jwt.verify(authData,userSecret);
					should(receivedData).have.property('ok', true);
					should(receivedData.user).have.property('name',name);
					should(receivedData.user).have.property('auth',0);

					let getEmailEmit = jwt.sign({
						_u:authData.user,
					},userSecret);

					client.emit('app.user.email.get',getEmailEmit);
					client.on('app.user.email.get', getEmailEmitData=>{
						
						let receivedEmailEmitData = jwt.verify(getEmailEmitData,userSecret);
						should(receivedEmailEmitData).have.property('ok', true);
						should(receivedEmailEmitData).have.property('email', 'test.normalUser@gmail.com');
						done();
						
					});

				});

			});

		});

	});

});