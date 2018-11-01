'use strict';

import DB from './db';
import App from './app';
import State from './state';
import Router from './router';

export class Service {

	constructor(options){

		try {

			if(options) this.options = options;

			// init db
			if(this.options && this.options.DB) this.DB = new DB(this.options.DB);

			// init socket w/wo redis
			if(this.options && this.options.SOCKET) {

				this.io = require('socket.io')(this.options.SOCKET.port,this.options.SOCKET.settings);			
				if(this.options.SOCKET.redis.active) {

					let redisAdapter = require('socket.io-redis');
					this.io.adapter(redisAdapter({ host: this.options.SOCKET.redis.host, port: this.options.SOCKET.redis.port }));

				}

			}

			// init App & router
			if(this.DB) this.App = new App(this.DB,this.options);
			if(this.App) this.Router = new Router(this.DB, this.App, this.options);

		} catch(e){

			throw e;

		}

	}

	// create session with routing
	session(socket){

		return new Promise((resolve,reject)=>{

			this.authorize(socket)
				.then(host=>{

					// create state from socket, options, host, new token
					let $state = new State(socket,this.options);
					$state.user.host = host;

					// init event loop
					$state.user.secret = this.App.token();

					$state.socket.emit('init',{ok:true,secret:$state.user.secret},true);
					$state.timers.intervals.push(setInterval(()=>{

						$state.user.secret = this.App.token();
						$state.socket.emit('init',{ok:true,secret:$state.user.secret},true);

					},this.options.APP.STATE.refresh));

					//
					// OverWrite emit and onevent
					//
					let _emit = $state.socket.emit,
						_onevent = $state.socket.onevent;

					$state.socket.emit = (packet,args,noDecode)=>{

						if(!noDecode){
							args = this.App.jwt.sign(args,$state.user.secret);
						}

						_emit.apply($state.socket,[packet,args]);

					};

					$state.socket.onevent = packet=>{

						if(packet.data && packet.data.length>1) {

							try {

								// verify decoded

								let decoded = this.App.jwt.verify(packet.data[1],$state.user.secret);
								packet.data[1] = decoded;

								let passedUserData;

								// user, _user, u, _u are all valid for passed userdata

								if(packet.data[1].user){ passedUserData = packet.data[1].user }									
								if(packet.data[1]._user){ passedUserData = packet.data[1]._user }
								if(packet.data[1].u){ passedUserData = packet.data[1].u }
								if(packet.data[1]._u){ passedUserData = packet.data[1]._u }

								if(passedUserData){

									if(!passedUserData.name || !passedUserData.apiId || !passedUserData.token){

										$state.socket.emit('error',{msg:'malformed user data',data:passedUserData},true);

									} else {

										this.App.verifyToken(passedUserData)
											.then(res=>{

												if(res.ban){

													$state.user.auth = false;
													// this.LOG('W','banned user requested access: '+passedUserData.apiId);

													$state.socket.emit('error',{msg:'you are banned.',data:res.ban},true);


													$state.socket.disconnect();

												}

												if(res.error){

													$state.user.auth = false;
													$state.socket.emit('error',{msg:'token error.',data:res.error},true);

												}

												if(res.user){

													if($state.user.auth) {

														if($state.user.auth.token !== res.user.token){

															$state.socket.emit('auth',{
																ok:true,
																user:{
																	apiId:res.user.apiId,
																	token:res.user.token,
																	authLvl:res.user.auth,
																	name:res.user.name,
																}
															});

														}

													}

													$state.user.auth = res.user;
													console.log('user authorized');
													// console.log('TO CONTROLLER FUNCTION HERE',packet,$state.user);

													this.Router.direct(packet,$state)
														.then(res=>{
															if(res) _onevent.call($state.socket,res);
														})
														.catch(e=>{
															console.log(e);
														});

												}

											})
											.catch(e=>{

												console.log(e);

											});

									}

								} else {

									// console.log('TO CONTROLLER FUNCTION HERE',packet,$state.user);

									this.Router.direct(packet,$state)
										.then(res=>{
											if(res) _onevent.call($state.socket,res);
										})
										.catch(e=>{
											console.log(e);
										});

								}

							} catch(err) {

								console.log(err);

							}

						}

					};

					resolve($state);

				})
				.catch(e=>{

					reject(e);

				});

		});

	}

	// check for bans by host
	authorize(socket){

		return new Promise((resolve,reject)=>{

			try {

				let host = socket.conn.remoteAddress;
				if (socket.handshake.address.length > 6) {

					host = socket.handshake.address;

				}
				if(socket.request.client._peername) {

					if (socket.request.client._peername.address.length > 6) {

						host = socket.request.client._peername.address;

					}

				}
				if(socket.handshake.headers['x-forwarded-for']) {

					if(socket.handshake.headers['x-forwarded-for'].length > 6) {

						host = socket.handshake.headers['x-forwarded-for'];
					
					}

				}
				if(host) {

					this.App.bansByHost(host)
						.then(res=>{

							if(res.length>0){

								socket.emit('error',{msg:'you are banned.',data:res},true);
								socket.disconnect();

								reject();

							} else {

								resolve(host);

							}
			
						})
						.catch(e=>{

							reject(e);
						
						});

				} else {

					reject({e:'No host'});

				}

			} catch(e){

				reject(e);

			}

		});

	}

};