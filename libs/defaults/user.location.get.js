module.exports = function(data){

	return new Promise((resolve,reject)=>{

		if(this.$state.user.auth){

			this.App.DB.q(
					`
						SELECT longitude, latitude, speed, elevation, dt 
						FROM \`user.locations\`
						WHERE user_id = ?
					`,
					[
						this.$state.user.auth.id
					]
				)
				.then(location=>{

					if(location.length>0){
	
						this.$state.socket.emit(this.name,{ok:true,location:location[0]});
						resolve(data);
					
					}

				})
				.catch(e=>{

					this.$state.socket.emit(this.name,{ok:false,msg:'error fetching location',e:e});
					resolve(data);

				});

		} else {

			this.$state.socket.emit(this.name,{ok:false,msg:'not logged in'});
			resolve(data);

		}

	});

};