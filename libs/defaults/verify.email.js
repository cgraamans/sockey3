module.exports = function(data){

	return new Promise((resolve,reject)=>{

		if(data.email){

			let pass = this.App.verifyEmail(data.email);
			this.$state.socket.emit(this.name,{ok:pass});

		}

	});

};