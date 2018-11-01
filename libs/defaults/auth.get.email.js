module.exports = function(data){

	return new Promise((resolve,reject)=>{

		if(this.$state.user.auth){

				this.App.DB.q("SELECT email FROM users WHERE id = ?",[this.$state.user.auth.id])
					.then(hasEmail=>{

						if(hasEmail.length>0){
		
							this.$state.socket.emit(this.name,{ok:true,email:hasEmail[0].email});
							resolve(data);
						
						}

					})
					.catch(e=>{

						this.$state.socket.emit(this.name,{ok:false,msg:'error fetching email',e:e});
						resolve(data);

					});

		} else {

			this.$state.socket.emit(this.name,{ok:false,msg:'not logged in'});
			resolve(data);

		}

	});

};