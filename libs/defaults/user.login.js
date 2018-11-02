module.exports = function(data) {

	return new Promise((resolve,reject)=>{

		if(!((data.apiId && data.token) || (data.name && data.password))) {

			this.$state.socket.emit('auth',{ok:false,msg:'missing identifiers'});
			resolve();

		} else {

			this.App.userLogin(data)
				.then(login=>{

					let cont = true;
					if(login.ban){

						this.$state.user.auth = false;
						this.App.LOG('E','banned user requested access: '+data.name);

						this.$state.socket.emit('auth',{
							ok:false,
							bans:login.ban
						});
						cont = false;

					}
					if(login.error){

						this.$state.user.auth = false;
						this.App.LOG('D',login.error);

						this.$state.socket.emit('auth',{
							ok:false,
							msg:login.error
						});											
						cont = false;
					
					}
					if(cont && login.user){

						this.$state.user.auth = login.user;
						this.$state.socket.emit('auth',{
							ok:true,
							user:{
								apiId:login.user.apiId,
								token:login.user.token,
								auth:login.user.auth,
								name:login.user.name,
							}
						});
						this.App.LOG('D',this.name + ': '+ this.$state.user.auth.name);

					}
					resolve();

				})
				.catch(e=>{

					this.App.LOG('E','this.app.user.login');
					this.App.LOG('E',e,true);
					this.$state.socket.emit('auth',{ok:false,msg:'error in '+this.name,e:e});
					resolve();

				});

		}

	});

};