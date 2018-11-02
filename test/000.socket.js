var should = require('should');
var io = require('socket.io-client');
var jwt = require('jsonwebtoken');

var socketURL = 'http://0.0.0.0:9001';

var options ={
	transports: ['websocket'],
	'force new connection': true
};

describe("API - socket",()=>{

	it('Should connect', done=>{

		let client = io.connect(socketURL, options);
		client.on('connect',data=>{

			client.disconnect();
			done();

		});

	});

	it('Should receive an init event with a secret',done=>{

		let client = io.connect(socketURL, options);
		client.on('connect',data=>{

			client.on('init', data=>{

				should.exist(data.secret);
				client.disconnect();

				done();

			});

		});

	});

	it('Should emit a test emission and receive a response.', done=>{

		let client = io.connect(socketURL, options);
		client.on('connect',data=>{

			client.on('init', data=>{

				should.exist(data.secret);
				userSecret = data.secret;

				let emitData = jwt.sign({ok:true,test:'Hello world.'},userSecret);
				client.emit('app.test.access',emitData);

				client.on('app.test.access', data=>{

					let receivedData = jwt.verify(data,userSecret);
					should(receivedData).have.property('ok', true);
					
					client.disconnect();
					done();

				});

			});

		});

	});	

});