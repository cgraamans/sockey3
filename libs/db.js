import mysql from 'mysql';

export default class DB {

	constructor(options){

		this.pool = null;
		try {

			this.pool = mysql.createPool(options.connection);

		} catch(e){

			throw e;
		
		}

	}

	// execute query with values
	execute(query,values) {

		return new Promise((resolve,reject)=>{

			this.pool.query(query,values,(error,res)=>{

				if(error) {
				
					reject(error);
				
				} else {

					resolve(res);

				}

			});

		});

	}

	// start transaction
	transact(query,values){

		return new Promise((resolve,reject)=>{
		
			this.execute('START TRANSACTION;',[])
				.then(()=>{

					this.execute(query,values)
						.then(res=>{

							this.commit()
								.then(()=>{

									resolve(res);

								})
								.catch(e=>{

									this.rollback()
										.then(()=>{

											reject(e);

										})
										.catch(e=>{

											reject(e);

										});

								});

						})
						.catch(e=>{

							this.rollback()
								.then(()=>{

									reject(e);

								})
								.catch(e=>{

									reject(e);

								});

						});

				})
				.catch(e=>{

					reject(e);

				});

		});

	}

	// commit transaction
	commit() {

		return new Promise((resolve,reject)=>{

			this.execute('COMMIT;',[])
				.then(()=>{	

					resolve();
				
				})
				.catch(e=>{

					reject(e);

				});

		});

	}

	// rollback transaction
	rollback() {

		return new Promise((resolve,reject)=>{

			this.execute('ROLLBACK;',[])
				.then(()=>{	

					resolve();
				
				})
				.catch(e=>{

					reject(e);

				});

		});

	}

	// query
	q(query,values,isTransaction) {

		return new Promise((resolve,reject)=>{


			if(!isTransaction){

				this.transact(query,values)
					.then(res=>{

						resolve(res);
					
					})
					.catch(e=>{
					
						reject(e);
					
					});

			} else {

				this.execute(query,values)
					.then(res=>{

						resolve(res);
					
					})
					.catch(e=>{

						reject(e);
					
					});

			}
		});
	
	}

};