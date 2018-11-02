'use strict'
const ROUTES = [

		{
			name:"app.user.login",
			controller:"libs/defaults/user.login.js",
		},

		{
			name:"app.user.register",
			controller:"libs/defaults/user.register.js",
		},
		
		{
			name:"app.user.logout",
			controller:"libs/defaults/user.logout.js",
		},
		
		{
			name:"app.user.email.get",
			controller:"libs/defaults/user.email.get.js",
			auth:true,
		},
		
		{
			name:"app.user.email.set",
			controller:"libs/defaults/user.email.set.js",
			auth:true,
			noRoute:true,
		},
		
		{
			name:"app.user.location.set",
			controller:"libs/defaults/user.location.set.js",
			auth:true,
		},

		{
			name:"app.user.location.get",
			controller:"libs/defaults/user.location.get.js",
			auth:true,
		},

		{
			name:"app.user.password.set",
			controller:"libs/defaults/user.password.set.js",
			noRoute:true,
			auth:true,
		},
		
		{
			name:"app.verify.name",
			controller:"libs/defaults/verify.name.js",
		},
		
		{
			name:"app.verify.password",
			controller:"libs/defaults/verify.password.js",
			noRoute:true,
		},
		
		{
			name:"app.verify.email",
			controller:"libs/defaults/verify.email.js",
		},

		{
			name:"app.test.access",
			controller:"libs/defaults/test.access.js",
		},

		// {
		// 	name:"admin.ban",
		// 	controller:"libs/defaults/admin.ban.js",
		// 	level:2,	
		// },
		
		// {
		// 	name:"admin.list.users",
		// 	controller:"libs/defaults/admin.list.users.js",
		// 	level:1,	
		// },
		
		// {
		// 	name:"admin.list.bans",
		// 	controller:"libs/defaults/admin.list.bans.js",	
		// 	level:1,			
		// },

		// {
		// 	name:"admin.list.online",
		// 	controller:"libs/defaults/admin.list.online.js",
		// 	level:1,
		// },

];

export const Defaults = {

	ROUTES,

};