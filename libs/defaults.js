'use strict'
const ROUTES = [

		{
			name:"auth.login",
			controller:"libs/defaults/auth.user.login.js",
		},

		{
			name:"auth.register",
			controller:"libs/defaults/auth.user.register.js",
		},
		
		{
			name:"auth.logout",
			controller:"libs/defaults/auth.user.logout.js",
		},
		
		{
			name:"auth.get.email",
			controller:"libs/defaults/auth.get.email.js",
			auth:true,
		},
		
		{
			name:"auth.set.email",
			controller:"libs/defaults/auth.set.email.js",
			auth:true,
			noRoute:true,
		},
		
		{
			name:"auth.set.password",
			controller:"libs/defaults/auth.set.password.js",
			noRoute:true,
			auth:true,
		},
		
		{
			name:"auth.verify.name",
			controller:"libs/defaults/auth.verify.name.js",
		},
		
		{
			name:"auth.verify.password",
			controller:"libs/defaults/auth.verify.password.js",
			noRoute:true,
		},
		
		{
			name:"auth.verify.email",
			controller:"libs/defaults/auth.verify.email.js",
		},

		{
			name:"test.access",
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