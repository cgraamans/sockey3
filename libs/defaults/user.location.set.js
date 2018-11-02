module.exports = function(data){

	return new Promise((resolve,reject)=>{

		let err = false;

		if(!data.latitude) err = 'no latitude';
		if(!data.longitude) err = 'no longitude';

		if(data.latitude % 1 != 0) err = 'malformed latitude';
		if(data.longitude % 1 != 0) err = 'malformed longitude';

		if(!data.speed) data.speed = 0;
		if(!data.speed) data.speed = 0;

		if(!this.$state.user.auth) err = 'not logged in';

		if(!err) {

			this.App.DB.q(
					`
						SELECT id 
						FROM \`user.locations\`
						WHERE user_id = ?
					`,
					[this.$state.user.auth.id]
				)
				.then(hasLoc=>{

					if(hasLoc.length>0) {

						this.App.DB.q(
							`
								UPDATE \`user.locations\`
								SET latitude = ?, longitude = ?, speed = ?, elevation = ?, dt = ?
								WHERE user_id = ?
							`,
							[
								data.latitude, 
								data.longitude, 
								data.speed, 
								data.elevation,
								Math.round((new Date()).getTime()/1000),
								this.$state.user.auth.id
							]
						)
						.then(()=>{

							this.$state.socket.emit(this.name,{ok:true});
							resolve(data);

						})
						.catch(e=>{

							this.$state.socket.emit(this.name,{ok:false,msg:'locations update failed',e:e});
							resolve(data);

						});
					
					} else {

						this.App.DB.q(
							`
								INSERT INTO \`user.locations\`
								SET ?
							`,
							{
								user_id:this.$state.user.auth.id,
								latitude:data.latitude,
								longitude:data.longitude,
								speed:data.speed,
								elevation:data.elevation,
								dt:Math.round((new Date()).getTime()/1000)

							}
						)
						.then(()=>{

							this.$state.socket.emit(this.name,{ok:true});
							resolve(data);

						})
						.catch(e=>{

							this.$state.socket.emit(this.name,{ok:false,msg:'locations update failed',e:e});
							resolve(data);
							
						});						

					
					}

				})
				.catch(e=>{

					this.$state.socket.emit(this.name,{ok:false,msg:'locations update failed',e:e});
					resolve(data);

				});

		} else {

			this.$state.socket.emit(this.name,{ok:false,msg:err});
			resolve(data);
		}
		
	});

};