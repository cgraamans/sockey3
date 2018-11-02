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
describe("API - DEFAULT - app.verify.email",()=>{

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
				
				let emitData = jwt.sign({email:'graamans@gmail.com'},userSecret);
				client.emit('app.verify.email',emitData);

				client.on('app.verify.email', data=>{
					
					let receivedData = jwt.verify(data,userSecret);
					should(receivedData).have.property('ok', true);

					done();

				});

			});

		});

	});

	it('fails - no tld', done=>{

		client.on('connect',data=>{

			client.on('init', data=>{
				
				userSecret = data.secret;
				
				let emitData = jwt.sign({email:'graamans@gmail.'},userSecret);
				client.emit('app.verify.email',emitData);

				client.on('app.verify.email', data=>{
					
					let receivedData = jwt.verify(data,userSecret);
					should(receivedData).have.property('ok', false);

					done();

				});

			});

		});

	});

	it('fails - no identifier', done=>{

		client.on('connect',data=>{

			client.on('init', data=>{
				
				userSecret = data.secret;
				
				let emitData = jwt.sign({email:'@gmail.com'},userSecret);
				client.emit('app.verify.email',emitData);

				client.on('app.verify.email', data=>{
					
					let receivedData = jwt.verify(data,userSecret);
					should(receivedData).have.property('ok', false);

					done();

				});

			});

		});

	});

});