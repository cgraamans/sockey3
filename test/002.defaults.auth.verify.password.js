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
describe("API - DEFAULT - auth.verify.password",()=>{

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
				
				let emitData = jwt.sign({password:'!1234567Ass'},userSecret);
				client.emit('auth.verify.password',emitData);

				client.on('auth.verify.password', data=>{
					
					let receivedData = jwt.verify(data,userSecret);
					should(receivedData).have.property('ok', true);

					done();

				});

			});

		});

	});

	it('fails - too short', done=>{

		client.on('connect',data=>{

			client.on('init', data=>{
				
				userSecret = data.secret;
				
				let emitData = jwt.sign({password:'!1234SDAa'},userSecret);
				client.emit('auth.verify.password',emitData);

				client.on('auth.verify.password', data=>{
					
					let receivedData = jwt.verify(data,userSecret);
					should(receivedData).have.property('ok', false);
					receivedData.msg.should.be.instanceof(Array).and.have.lengthOf(1);
					should(receivedData.msg[0]).be.exactly('The password must be at least 10 characters long.');
					done();

				});

			});

		});

	});


	it('fails - no lowercase', done=>{

		client.on('connect',data=>{

			client.on('init', data=>{
				
				userSecret = data.secret;
				
				let emitData = jwt.sign({password:'1231231231A!'},userSecret);
				client.emit('auth.verify.password',emitData);

				client.on('auth.verify.password', data=>{
					
					let receivedData = jwt.verify(data,userSecret);
					should(receivedData).have.property('ok', false);
					receivedData.msg.should.be.instanceof(Array).and.have.lengthOf(1);
					should(receivedData.msg[0]).be.exactly('The password must contain at least one lowercase letter.');
					done();

				});

			});

		});

	});

	it('fails - no uppercase', done=>{

		client.on('connect',data=>{

			client.on('init', data=>{
				
				userSecret = data.secret;
				
				let emitData = jwt.sign({password:'1231231231a!'},userSecret);
				client.emit('auth.verify.password',emitData);

				client.on('auth.verify.password', data=>{
					
					let receivedData = jwt.verify(data,userSecret);
					should(receivedData).have.property('ok', false);
					receivedData.msg.should.be.instanceof(Array).and.have.lengthOf(1);
					should(receivedData.msg[0]).be.exactly('The password must contain at least one uppercase letter.');
					done();

				});

			});

		});

	});

	it('fails - no special characters', done=>{

		client.on('connect',data=>{

			client.on('init', data=>{
				
				userSecret = data.secret;
				
				let emitData = jwt.sign({password:'1231231231aA'},userSecret);
				client.emit('auth.verify.password',emitData);

				client.on('auth.verify.password', data=>{
					
					let receivedData = jwt.verify(data,userSecret);
					should(receivedData).have.property('ok', false);
					receivedData.msg.should.be.instanceof(Array).and.have.lengthOf(1);
					should(receivedData.msg[0]).be.exactly('The password must contain at least one special character.');
					done();

				});

			});

		});

	});

});