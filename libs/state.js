export default class State {
		
	constructor(socket,options){

		try {

			this.socket = socket;

			this.user = {

				auth:false,
				host:false,
				secret:false,

			};

			this.timers = {

				intervals:[],
				timeouts:[],

			};

			// clean timers on disconnect
			this.socket.on('disconnect',()=>{

				if(this.timers.intervals.length>0){

					this.timers.intervals.forEach(interval=>{

						clearInterval(interval);

					});
				}		

				if(this.timers.timeouts.length>0){

					this.timers.timeouts.forEach(timeout=>{

						clearTimeout(timeout);

					});
				}

			});


		} catch (e) {

			throw e;

		}

	}



};