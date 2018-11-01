// Routing settings

// Switches
// 
// name			- string	- socket name
// controller 	- string 	- location of the controller
// noRoute		- boolean	- do not pass packet data from default to the user controller
// overwrite	- boolean	- overwrite packet data sent to the user controller from the default controller
// auth 		- boolean	- only allow for authenticated users. (default:false)
// level 		- int		- admin level required for controller (default 0);
//							  * if level is set, auth defaults to true

// ToDo: chain (string).

const ROUTES = [

	{
		name:"example",
		controller:"src/controllers/example.js",
	},

];
export default ROUTES;