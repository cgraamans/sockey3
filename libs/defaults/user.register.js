module.exports = function(data){

	return new Promise((resolve,reject)=>{

		let msg = false;
		if(!data.password || !data.name) msg = 'invalid credentials';

		if(!msg){
			let pTest = this.App.verifyPassword(data.password);
			if(pTest.errors.length>0) msg = 'invalid password';
		}

		if(!msg){

			this.App.verifyName(data.name)
				.then(nameValid =>{

					if(nameValid === true) {

						this.App.userRegister(data)
							.then(()=>{
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

										}
										resolve(data);

									})
									.catch(e=>{

										this.App.LOG('E','this.App.AUTH.userLogin');
										this.App.LOG('E',e,true);
										this.$state.socket.emit(this.name,{ok:false,msg:'error in '+this.name,e:e});
										resolve();

									});
							})
							.catch(e=>{

								this.App.LOG('E','this.App.AUTH.userRegister');
								this.App.LOG('E',e,true);
								this.$state.socket.emit(this.name,{ok:false,msg:'error in '+this.name,e:e});
								resolve();

							});

					} else {

						this.$state.socket.emit(this.name,{ok:false,msg:'name '+nameValid});
						resolve();

					}

				})
				.catch(e=>{

					this.App.LOG('E','this.App.AUTH.verifyName');
					this.App.LOG('E',e,true);
					this.$state.socket.emit(this.name,{ok:false,msg:'error in '+this.name,e:e});
					resolve();

				});

		} else {
		
			this.$state.socket.emit(this.name,{ok:false,msg:msg});
			resolve();

		}


	});

};