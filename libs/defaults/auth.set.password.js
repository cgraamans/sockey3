module.exports = function(data){

	return new Promise((resolve,reject)=>{

		let proceed = true;
		if(!data.password) {
			this.$state.socket.emit(this.name,{ok:false,msg:'no password'});
			proceed = false;
		} else {

			let pass = this.App.verifyPassword(data.password);
			if(pass.errors.length > 0){
				this.$state.socket.emit(this.name,{ok:false,msg:'invalid password',result:pass.errors});
				proceed = false;
			}
		}
		if(!this.$state.user.auth){
			this.$state.socket.emit(this.name,{ok:false,msg:'not logged in'});	
			proceed = false;
		}
		if(proceed){

			this.App.DB.q('UPDATE `users` SET password = ? WHERE id = ?',[this.App.hash(data.password),this.$state.user.auth.id])
				.then(()=>{

					this.$state.socket.emit(this.name,{ok:true});

				})
				.catch(e=>{
					
					this.$state.socket.emit(this.name,{ok:false,msg:'password update failed',e:e});

				});

		}
		resolve();

	});

};