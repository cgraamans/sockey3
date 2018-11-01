module.exports = function(data){

	return new Promise((resolve,reject)=>{

		this.$state.user.auth = false;
		this.$state.socket.emit(this.name,{ok:true});
		resolve(data);

	});

};