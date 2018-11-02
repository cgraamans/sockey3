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
describe("API - DEFAULT - app.verify.name",()=>{

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
				
				let emitData = jwt.sign({name:'sn0rsn0rsn0r'},userSecret);
				client.emit('app.verify.name',emitData);

				client.on('app.verify.name', data=>{
					
					let receivedData = jwt.verify(data,userSecret);
					should(receivedData).have.property('ok', true);

					done();

				});

			});

		});

	});

	it('too short', done=>{

		client.on('connect',data=>{

			client.on('init', data=>{
				
				userSecret = data.secret;
				
				let emitData = jwt.sign({name:'l'},userSecret);
				client.emit('app.verify.name',emitData);

				client.on('app.verify.name', data=>{
					
					let receivedData = jwt.verify(data,userSecret);
					should(receivedData).have.property('ok', false);
					should(receivedData).have.property('msg', 'too short');

					done();

				});

			});

		});

	});

	it('too long', done=>{

		client.on('connect',data=>{

			client.on('init', data=>{
				
				userSecret = data.secret;
				
				let emitData = jwt.sign({name:'lllllllllllllllllllllllllllllllll'},userSecret);
				client.emit('app.verify.name',emitData);

				client.on('app.verify.name', data=>{
					
					let receivedData = jwt.verify(data,userSecret);
					should(receivedData).have.property('ok', false);
					should(receivedData).have.property('msg', 'too long');

					done();

				});

			});

		});

	});

	it('invalid', done=>{

		client.on('connect',data=>{

			client.on('init', data=>{
				
				userSecret = data.secret;
				
				let emitData = jwt.sign({name:'####'},userSecret);
				client.emit('app.verify.name',emitData);

				client.on('app.verify.name', data=>{
					
					let receivedData = jwt.verify(data,userSecret);
					should(receivedData).have.property('ok', false);
					should(receivedData).have.property('msg', 'invalid');

					done();

				});

			});

		});

	});

});