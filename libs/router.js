'use strict';

import {Defaults} from './defaults';

export default class Router {

	constructor(db,app,options){
		try {


			this.routes = options.ROUTES;
			this.defaults = Defaults.ROUTES;

			this.db = db;
			this.App = app;

			this.load()
				.catch(err=>{

					throw err;

				});

		} catch(e) {

			throw e;

		}

	}

	load(){

		return new Promise((resolve,reject)=>{

			try {

				for(let i=0,c=this.routes.length;i<c;i++) this.routes[i].f = require(process.cwd() + '/' + this.routes[i].controller);
				for(let i=0,c=this.defaults.length;i<c;i++) this.defaults[i].f = require(process.cwd() + '/' + this.defaults[i].controller);

				resolve();

			} catch(e) {

				reject(e);

			}


		});

	}

	route(type,packet) {

		return new Promise((resolve,reject)=>{

			// verify packet
			if(packet && packet.data && packet.data.length>1 && ['routes','defaults'].includes(type)) {

					let TargetRoute = this[type].find(x=>x.name === packet.data[0]);
					if(TargetRoute && TargetRoute.f) {
					
						resolve(TargetRoute);
					
					} else {

						resolve();
					
					}

			} else {

				reject({e:'malformed data in route'});

			}

		});

	}

	validateUser(route,$state) {

			let err = false; 

			if(route.auth && !$state.user.auth) err = 'not logged in';
			if(route.level && $state.user.auth && $state.user.auth.level < route.level) err = 'not authorized';

			return err;

	}

	direct(packet,$state) {

		return new Promise((resolve,reject)=>{

			this.route('defaults',packet)
				.then(DefaultRoute=>{
					if(DefaultRoute) {

						let err = this.validateUser(DefaultRoute,$state);
						if(!err) {

							DefaultRoute.$state = $state;
							DefaultRoute.App = this.App;

							DefaultRoute.f(packet.data[1])
								.then(res=>{

										if(DefaultRoute.noRoute) packet.data[1] = {};
										if(res && DefaultRoute.overwrite) packet.data[1] = res;

									this.route('routes',packet)
										.then(ServiceRoute=>{

											if(ServiceRoute) {

												let errService = this.validateUser(ServiceRoute,$state);
												if(!errService) {

													ServiceRoute.$state = $state;
													ServiceRoute.App = this.App;

													ServiceRoute.f(packet.data[1])
														.then(resS=>{

															if(ServiceRoute.noRoute) packet.data[1] = {};
															if(ServiceRoute.overwrite) packet.data[1] = resS;

															resolve(packet);

														})
														.catch(e=>{

															reject({e:'error in processing service route',data:packet});

														})

												} else {

													reject({e:errService});

												}

											} else {

												resolve();

											}

										})
										.catch(e=>{

											reject({e:'error in service route acquisition',data:e});

										});


								})
								.catch(e=>{

									reject({e:'error in processing default route',data:e});

								})


						} else {

							reject({e:err});

						}

					} else {

						this.route('routes',packet)
							.then(ServiceRoute=>{

								if(ServiceRoute){


									let errService = this.validateUser(ServiceRoute,$state);
									if(!errService) {

										ServiceRoute.$state = $state;
										ServiceRoute.App = this.App;

										ServiceRoute.f(packet.data[1])
											.then(resS=>{

												if(ServiceRoute.noRoute) packet.data[1] = {};
												if(resS && ServiceRoute.overwrite) packet.data[1] = resS;

												resolve(packet);

											})
											.catch(e=>{

												reject({e:'error in processing service route',data:e});

											});


									} else {

										reject({e:errService});

									}

								} else {

									resolve();

								}


							})
							.catch(e=>{

								reject({e:'error in service route acquisition',data:e});

							});

					}

				})
				.catch(e=>{

					reject({e:'error in route acquisition',data:e});

				})

			// resolve();

		});

	}

};