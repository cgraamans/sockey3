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
describe("API - DEFAULT - app.user.password.set",()=>{

	beforeEach(()=>{

		client = io.connect(socketURL, options);

	});

	afterEach(()=>{

		client.disconnect();
		userSecret = false;

	});

	it('success - user sets a new password', done=>{

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

					let setPasswordData = jwt.sign({
						_u:authData.user,
						password:process.env.TEST_PASSWORD
					},userSecret);

					client.emit('app.user.password.set',setPasswordData);
					client.on('app.user.password.set', getPwdData=>{

						let receivedPwdData = jwt.verify(getPwdData,userSecret);
						should(receivedPwdData).have.property('ok', true);
						done();
						
					});

				});

			});

		});

	});

});