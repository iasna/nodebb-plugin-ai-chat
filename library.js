'use strict';

const nconf = require.main.require('nconf');
const winston = require.main.require('winston');

const meta = require.main.require('./src/meta');

const controllers = require('./lib/controllers');

const routeHelpers = require.main.require('./src/routes/helpers');
var socketPlugins = require.main.require('./src/socket.io/plugins')

const qs = require('qs')
const axios = require('axios');

const plugin = {};
let _token = "";
let _clientId = ""
let _clientSecret = ""
let _hostURL = ""
let _tokenExpiry ="" 
let _brainURL =""
let tokenFetchPromise = null;
let counter = 0
plugin.init = async (params) => {
	const { router /* , middleware , controllers */ } = params;

	/**
	 * We create two routes for every view. One API call, and the actual route itself.
	 * Use the `setupPageRoute` helper and NodeBB will take care of everything for you.
	 *
	 * Other helpers include `setupAdminPageRoute` and `setupAPIRoute`
	 * */
	

	let settings = await meta.settings.get('ai-chat');
	console.log(settings);

	_token = settings['token'];
	_tokenExpiry = settings['token_expiry'];

	_clientId = settings['client-id'];
	_brainURL = settings['brain-url'];
	_clientSecret = settings['client-secret'];
	_hostURL = (settings['host-url'] ? settings['host-url'] : "");
	socketPlugins.AIChatPlugin = {};
	socketPlugins.AIChatPlugin.getSettings =   function(socket, data, callback) {
		// try {
		// 	// Perform any server-side logic here
		// 	console.log("getSettings from client is called")
		// 	const settings = await meta.settings.get('ai-chat'); // This can be any data you want to pass
		// 	callback(null, {data: settings});
		// } catch (err) {
		// 	callback(err);
		// }
		 meta.settings.get('ai-chat')
        .then(settings => {
			let settings2 = { 
				'brainURL' : settings['brain-url'],
				'token' : settings['token']		}
            callback(null, { data: settings2 });
        })
        .catch(err => {
            callback(err);
        });

		// if (typeof callback === 'function') {
		// 	callback(null, { 'x': 'y' });
		// } else {
		// 	console.error('Callback is not a function:', callback);
		// }

		// callback(null, {'asna' : 'ishrat'});
	};

	routeHelpers.setupPageRoute(router, '/ai-chat', [(req, res, next) => {
		winston.info(`[plugins/ai-chat] In middleware. This argument can be either a single middleware or an array of middlewares`);
		setImmediate(next);
	}], (req, res) => {
		winston.info(`[plugins/ai-chat] Navigated to ${nconf.get('relative_path')}/ai-chat`);
		res.render('ai-chat', {brainURL: _brainURL });
	});

	

	routeHelpers.setupAdminPageRoute(router, '/admin/plugins/ai-chat', controllers.renderAdminPage);

};

/**
 * If you wish to add routes to NodeBB's RESTful API, listen to the `static:api.routes` hook.
 * Define your routes similarly to above, and allow core to handle the response via the
 * built-in helpers.formatApiResponse() method.
 *
 * In this example route, the `ensureLoggedIn` middleware is added, which means a valid login
 * session or bearer token (which you can create via ACP > Settings > API Access) needs to be
 * passed in.
 *
 * To call this example route:
 *   curl -X GET \
 * 		http://example.org/api/v3/plugins/quickstart/test \
 * 		-H "Authorization: Bearer some_valid_bearer_token"
 *
 * Will yield the following response JSON:
 * 	{
 *		"status": {
 *			"code": "ok",
 *			"message": "OK"
 *		},
 *		"response": {
 *			"foobar": "test"
 *		}
 *	}
 */



plugin.loadValues = async (data) => {

	let settings = await meta.settings.get('ai-chat');
	console.log('AI-chat page built called')

	let token = settings['token'];
	let tokenExpiry = settings['token_expiry'];
	console.log(tokenExpiry);

	let clientId = settings['client-id'];
	let brainURL = settings['brain-url'];
	let clientSecret = settings['client-secret'];
	let hostURL = (settings['host-url'] ? settings['host-url'] : "");
	data.templateData.brainURL = brainURL;
	try {
		if(token && Date.now() < tokenExpiry)
		{
			data.templateData.token = token;
			console.log('Token is not expired returning')
			return data;
			
		}
		// if fetch token is in progress
		if(tokenFetchPromise){
			token = await tokenFetchPromise
			data.templateData.token=token;
		//	console.log('in here');
		//	console.log(data.templateData)
			return data;
		}
		
		tokenFetchPromise = await fetchAndCacheToken(hostURL, clientId, clientSecret);
        token =  tokenFetchPromise;
		data.templateData.token=token;
		console.log(data.templateData)

	}
	catch(error)
	{
		console.error('Error in token handling:', error);

	}
	finally {
		tokenFetchPromise = null; // Reset the token request promise
	}
	
	return data;
}

async function fetchAndCacheToken(hostURL, clientId, clientSecret) {

	return axios.post(hostURL, qs.stringify({
		grant_type: "client_credentials",
		client_id: clientId,
		client_secret: clientSecret
	  }), { headers: {"Content-type" : "application/x-www-form-urlencoded"}})
	  .then( async function (response) {
		const data = response.data;
		console.log(JSON.stringify(data));
		
		winston.info(data.access_token)
		await meta.settings.setOne('ai-chat', 'token', data.access_token)
		let myexpiry =Date.now() + (data.expires_in * 1000);
		console.log(myexpiry);
		await meta.settings.setOne('ai-chat', 'token_expiry', myexpiry);
		return data.access_token;
	  })
	  .catch(function (error) {
		winston.info(error);
	  });   
}

plugin.addRoutes = async ({ router, middleware, helpers }) => {
	const middlewares = [
		middleware.ensureLoggedIn,			// use this if you want only registered users to call this route
		// middleware.admin.checkPrivileges,	// use this to restrict the route to administrators
	];
	routeHelpers.setupApiRoute(router, 'get', '/ai-chat/token', middlewares, async (req, res) => {
		
		let token = await meta.settings.get('ai-chat').token;
		if(token == undefined)
		{
			axios.post(hostURL, qs.stringify({
				grant_type: "client_credentials",
				client_id: clientId,
				client_secret: clientSecret
			  }), { headers: {"Content-type" : "application/x-www-form-urlencoded"}})
			  .then( async function (response) {
				const data = response.data;
				console.log(JSON.stringify(data));
				
				winston.info(data.access_token)
				await meta.settings.setOne('ai-chat', 'token', data.access_token)
				await meta.settings.setOne('ai-chat', 'token_expiry', data.expires_in)
			  })
			  .catch(function (error) {
				winston.info(error);
			  });
			
		}
	
		helpers.formatApiResponse(200, res, {
			foobar: req.params.param1,
		});

	});
};

plugin.addAdminNavigation = (header) => {

	header.plugins.push({
		route: '/plugins/ai-chat',
		icon: 'fa-tint',
		name: 'AI Chat',
	});

	return header;
};

module.exports = plugin;
