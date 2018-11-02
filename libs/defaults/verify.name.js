module.exports = function(data){

	return new Promise((resolve,reject)=>{

		if(data.name){

			this.App.verifyName(data.name)
				.then(res=>{
					if(res === true){
						this.$state.socket.emit(this.name,{ok:true})
					} else {
						this.$state.socket.emit(this.name,{ok:false,msg:res});
					}
					resolve();
				})
				.catch(e=>{
					this.$state.socket.emit(this.name,{ok:false,e:e});
					reject(e);
				});

		}

	});

};