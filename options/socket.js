const SOCKET = {

	port:9001, 							// port
	settings:{ 							// socket.io specific configuration options
		pingInterval:20000,
		pingTimeout:40000
		//ex: transports:['websocket']
	},
	redis:{ 							// redis configuration
		active:false, 					// enable redis
		host:'localhost',
		port:6379
	}

};
export default SOCKET;