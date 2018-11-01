module.exports = function(data){

	return new Promise((resolve,reject)=>{

		if(data.password){

			let pass = this.App.verifyPassword(data.password);
			if(pass.errors.length > 0){
				this.$state.socket.emit(this.name,{ok:false,msg:pass.errors});
			}
			if(pass.errors.length === 0){
				this.$state.socket.emit(this.name,{ok:true});
			}

		}

	});

};