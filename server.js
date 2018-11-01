import {Service} from './libs/service.js';
import {Options} from './libs/options.js';

// create service
let svc = new Service(Options);
svc.io.on('connection',socket=>{

	// initialize session
	svc.session(socket)
		.then($state=>{

			console.log('session created');

			// $state.socket.on('example',function(data){
			// 	console.log('passthrough:',data);
			// });
		
		})
		.catch(e=>{

			console.log(e);
		
		});

	console.log('user connected');

});
console.log('server ready');