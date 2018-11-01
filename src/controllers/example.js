module.exports = function (data) {

	return new Promise((resolve,reject)=>{


		console.log(this.name);
		// console.log('example data:',data);
		// console.log('env:',this);

		this.App.DB.q('select * from `users`',[])
			.then(res=>{

				resolve(data);

				console.log(res);

			})
			.catch(e=>{

				console.log(e);
						resolve(data);

			})

	});

};
