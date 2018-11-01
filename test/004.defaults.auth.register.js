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
describe("API - DEFAULT - auth.register",()=>{

	beforeEach(()=>{

		client = io.connect(socketURL, options);

	});

	afterEach(()=>{

		client.disconnect();
		userSecret = false;

	});

	it('success', done=>{

		client.on('connect',data=>{

			client.on('init', data=>{
				
				userSecret = data.secret;
				let name = 'deleteThisUser-'+Math.round(Math.random()*1000);

				let emitData = jwt.sign({name:name,password:process.env.TEST_PASSWORD},userSecret);
				client.emit('auth.register',emitData);
				client.on('auth', data=>{
					
					let receivedData = jwt.verify(data,userSecret);
					should(receivedData).have.property('ok', true);
					should(receivedData.user).have.property('name',name);
					done();

				});

			});

		});

	});

	it('fails - invalid credentials', done=>{

		client.on('connect',data=>{

			client.on('init', data=>{
				
				userSecret = data.secret;
				
				let emitData = jwt.sign({password:'hjh1',},userSecret);
				client.emit('auth.register',emitData);

				client.on('auth.register', data=>{
					
					let receivedData = jwt.verify(data,userSecret);
					should(receivedData).have.property('ok', false);
					should(receivedData).have.property('msg', 'invalid credentials');

					done();

				});

			});

		});

	});

	it('fails - user name check (too short)', done=>{

		client.on('connect',data=>{

			client.on('init', data=>{
				
				userSecret = data.secret;
				
				let emitData = jwt.sign({password:process.env.TEST_PASSWORD,name:'ab'},userSecret);
				client.emit('auth.register',emitData);

				client.on('auth.register', data=>{
					
					let receivedData = jwt.verify(data,userSecret);
					should(receivedData).have.property('ok', false);
					should(receivedData).have.property('msg', 'name too short');

					done();

				});

			});

		});

	});

});