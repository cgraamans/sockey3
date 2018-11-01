const DB = {

	// process.env for all secure settings
	connection:{
		user:process.env._DB_USERNAME,
		password:process.env._DB_PASSWD,
		database:process.env._DB,
		host:'localhost',
		charset:'utf8mb4'
	},

};
export default DB;