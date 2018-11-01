module.exports = function (data) {

	return new Promise((resolve,reject)=>{

		// console.log('example data:',data);
		// console.log('env:',this);

		this.$state.socket.emit(this.name,{ok:true});

		resolve(data);

	});

};