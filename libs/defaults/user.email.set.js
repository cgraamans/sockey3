module.exports = function(data){

	return new Promise((resolve,reject)=>{

		let err = false;
		if(!data.email) err = 'no email';
		if(!this.$state.user.auth) err = 'not logged in';
		if(!this.App.verifyEmail(data.email)) err = 'invalid email address';

		if(!err) {

			this.App.DB.q('UPDATE users SET email = ? WHERE id = ?',[data.email,this.$state.user.auth.id])
				.then(()=>{

					this.$state.socket.emit(this.name,{ok:true});

				})
				.catch(e=>{

					this.$state.socket.emit(this.name,{ok:false,msg:'email update failed',e:e});

				});

		} else {

			this.$state.socket.emit(this.name,{ok:false,msg:err});
		
		}
		resolve(data);

	});

};