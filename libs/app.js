export default class App {

		constructor(DB,options){

			try {

				this.DB = DB;
				this.options = options;

				this.SHA256 = require('crypto-js/sha256');
				this.jwt = require('jsonwebtoken');

				this.owasp = require('owasp-password-strength-test');
				this.owasp.config(this.options.APP.OWASP);

				this.argv = require('minimist')(process.argv.slice(2));

			} catch (e) {

				throw e;
			
			}

		}

		token(data){

			if (data) {

				return this.SHA256(Math.random().toString(36).replace(/[^a-z]+/g, '')+data).toString();

			} else {

				return this.SHA256(Math.random().toString(36).replace(/[^a-z]+/g, '')).toString();	

			}

		}

		bansByHost(host){

			return new Promise((resolve,reject)=>{

				this.DB.q('SELECT reason, dt FROM `user.bans` WHERE active = 1 AND ((? LIKE CONCAT("%",host,"%")) OR (? LIKE CONCAT(host,"%")) OR (? LIKE CONCAT("%",host)))',[
						host,
						host,
						host
					])
					.then(res=>{
						resolve(res);
					})
					.catch(e=>{
						reject(e);
					});

			});

		}

		verifyToken(user){

			return new Promise((resolve,reject)=>{

				let rtn = {
					ban:false,
					user:false,
					error:false,
				};

				this.DB.q(`
						SELECT ub.reason, ub.dt 
						FROM \`user.bans\` AS ub 
						INNER JOIN users u ON u.id = ub.user_id 
						WHERE ub.active = 1 
						AND u.api_id = ?
					`,[user.apiId])
					.then(bans=>{

						if(bans.length>0){

							rtn.ban = bans[0];
							resolve(rtn);

						} else {

							this.DB.q('SELECT u.id,u.auth,u.name,ut.token,ut.dt,ut.persistent FROM users AS u INNER JOIN `user.tokens` ut ON ut.user_id = u.id WHERE u.api_id = ? AND ut.token = ? ORDER BY u.id DESC LIMIT 1',[
									user.apiId,
									user.token
								])
								.then(databaseUser=>{

									if(databaseUser.length > 0){

										let timeout = Math.round(((new Date()).getTime() - this.options.AUTH.timeout)/1000);
										let ttl = Math.round(((new Date()).getTime() - app.options.AUTH.maxTTL)/1000);

										if(databaseUser[0].dt < timeout) {

											rtn.error = 'you have not logged in with this token in '+timeout+' seconds.';
											resolve(rtn);

										} else {

											rtn.user = user;

											rtn.user.id = databaseUser[0].id;
											rtn.user.auth = databaseUser[0].auth;
											rtn.user.name = databaseUser[0].name;

											if(databaseUser[0].dt < ttl) {

												this.userToken(databaseUser[0].id,databaseUser[0].persistent,databaseUser[0].name+databaseUser.token+(new Date()))
													.then(newToken=>{

														rtn.user.token = newToken;
														resolve(rtn);

													})
													.catch(e=>{

														reject(e);

													});

											} else {

												resolve(rtn);

											}

										}

									} else {

										rtn.error = 'user not found';
										resolve(rtn);

									}
								})
								.catch(e=>{

									reject(e);

								});

						}

					})
					.catch(e=>{

						reject(e);
					
					});

			});

		}

		userToken(userId,isPersistent,salt) {

			return new Promise((resolve,reject)=>{

				let now = Math.round((new Date()).getTime());
				let newToken = this.token(salt);
				let persistent = 0;
				if(isPersistent) persistent = 1;

				let ins = {
					user_id:userId,
					token:newToken,
					dt:Math.round(now / 1000),
					persistent:persistent
				};

				this.DB.q('INSERT INTO `user.tokens` SET ?',ins,true)
					.then(res=>{

						if(res.insertId) {

							resolve(newToken);	
						
						} else {
						
							reject('Error inserting token');
						
						}
						

					})
					.catch(e=>{

						reject(e);

					});

			});

		}

		userLogin(user){

			return new Promise((resolve,reject)=>{

				let rtn = {
					ban:false,
					user:false,
					error:false,
				};
				let persistent = 0;
				if(user.persistent) persistent = 1;

				if(user.name && user.password) {

					this.DB.q('SELECT ub.reason, ub.dt FROM `user.bans` AS ub INNER JOIN users u ON u.id = ub.user_id WHERE ub.active = 1 AND u.name = ?',[user.name])
						.then(bans=>{
								
							if(bans.length>0){

								rtn.ban = bans;
								resolve(rtn);

							} else {

								let pwd = this.SHA256(user.password).toString();
								this.DB.q('SELECT id, name, auth, api_id as apiId FROM users WHERE name = ? AND password = ? LIMIT 1',[user.name,pwd])
									.then(userArrofObj=>{

										if(userArrofObj.length === 1){

											let user = userArrofObj[0];
											this.userToken(user.id,persistent,(new Date()).getTime()*Math.random())
												.then(token=>{

													rtn.user = user;
													rtn.user.token = token;

													resolve(rtn);

												})
												.catch(e=>{

													reject(e);

												});

										} else {

											rtn.error = 'user not found';
											resolve(rtn);

										}

									})
									.catch(e=>{

										reject(e);

									});

							}

						})
						.catch(e=>{

							reject(e);

						});

				}

				// Initial user authentication by socket on return
				if(user.token && user.apiId) {

						this.verifyToken(user)
							.then(user=>{

								resolve(user);

							})
							.catch(e=>{

								reject(e);

							});
								
				}

			});

		}

		userRegister(user){

			return new Promise((resolve,reject)=>{

				let pass = false;
				if(typeof user.persistent === 'undefined') user.persistent = 1;
				if(!user.password) pass = true;
				if(!user.name) pass = true;

				if(!pass) {
					
					let insUsr = {
						password:this.hash(user.password),
						api_id:this.token(),
						dt_register:Math.round((new Date()).getTime()/1000),
						name:user.name
					};
					this.DB.q('INSERT INTO `users` SET ?',insUsr,true)
						.then(res=>{
							if(res.insertId){

								resolve();

							} else {

								reject('problem adding user');

							}

						})
						.catch(e=>{

							reject(e);

						});

				} else {

					reject('missing identifiers');
				
				}

			});

		}

		verifyName(name){

			return new Promise((resolve,reject)=>{

				let msg = false;
				if(name.length > 32) {

					msg = 'too long';

				}
				if(name.length < 3) {

					msg = 'too short';

				}
				if(/[^a-zA-Z0-9_\-]/g.test(name)) {

					msg = 'invalid';

				}

				if(!msg) {

					this.DB.q("SELECT id FROM users WHERE name = ?",[name])
						.then(hasName=>{

							if(hasName.length>0){

								resolve('in use');

							} else {

								resolve(true);
								
							}

						})
						.catch(e=>{

							reject(e);

						});


				} else {

					resolve(msg);

				}


			});

		}

		verifyPassword(password){

			return this.owasp.test(password);

		}

		// https://stackoverflow.com/questions/46155/how-can-an-email-address-be-validated-in-javascript
		verifyEmail(email){

			var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return re.test(String(email).toLowerCase());

		}

		emailGet(email){

			return new Promise((resolve,reject)=>{

			});

		}
		
		emailSet(email){

			return new Promise((resolve,reject)=>{

			});
			
		}

		hash(string){

			return this.SHA256(string).toString();

		}

		LOG(type,message,isRaw){

			let logIt = false;
			let typeLevel = 'E';
			let possibleTypes = ['E','D','I'];

			if(!possibleTypes.includes(type)) type = 'E';

			if(this.argv.v){
				logIt = true;
				if(possibleTypes.includes(this.argv.v)) typeLevel = this.argv.v;
			}   
			if(process.env._LOGLEVEL) {
				logIt = true;
				if(possibleTypes.includes(process.env._LOGLEVEL)) typeLevel = process.env._LOGLEVEL; 
			}
			let doLog = false;
			if (type === 'E' && logIt && (typeLevel === 'E' || typeLevel === 'D' || typeLevel === 'I')) doLog = true;
			if (type === 'D' && logIt && (typeLevel === 'D' || typeLevel === 'I')) doLog = true;
			if (type === 'I' && logIt && typeLevel === 'I') doLog = true;

			if(doLog){

				if(isRaw) {

					console.log(message);

				} else {

					console.log("\x1b[1m" + type + "\x1b[0m - " + new Date +' - ' + message);
				
				}

			}

			return;

		}

	}