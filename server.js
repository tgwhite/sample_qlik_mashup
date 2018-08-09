'use strict'; 

// define your express modules
const express = require('express');
const router = express.Router();
const fs = require('fs');
const request = require('request');
const path = require('path'); 
const http = require('http');
const https = require('https');

// set up your express app
const app = express();
const engineUrl = 'usrem-csq.qliktech.com';  

// get the required certs to serve https and to make requests to Qlik
const certPath =  path.join('C:', 'ProgramData', 'Qlik', 'Sense', 'Repository', 'Exported Certificates', 'usrem-csq');
const privateKey  = fs.readFileSync(path.resolve(certPath, 'server_key.pem'), 'utf8');
const certificate  = fs.readFileSync(path.resolve(certPath, 'server.pem'), 'utf8');
const credentials = {key: privateKey, cert: certificate};

app.use(express.static(path.join(__dirname, 'public')));
app.use("/public", express.static(__dirname + "/public"));
app.set('port', process.env.PORT || 3000);

// set up the request object with the client certs
const r = request.defaults({
	rejectUnauthorized: false,
	cert: fs.readFileSync(path.resolve(certPath, 'client.pem')),
	key: fs.readFileSync(path.resolve(certPath, 'client_key.pem'))
})

// define the home route
router.get('/', function(req, res) {
	console.log('in home route!'); 
    res.sendFile(path.join(__dirname + '/index.html'));
});


// define the authentication API. Production versions will include some sort of 
// authentication strategy, like passport.js. 
// Authenticate the user using passport and then pass their Qlik directory and username back to Qlik to obtain a ticket. 

router.get('/authenticate', function(req, res){
	console.log('received an authenticate request!'); 

	// Your login solution will associate a given users credentials with the directory (QTSEL) and username (csq) that is associated with
	// Qlik. Pass those values here. 

	getTicket('QTSEL', 'csq')
	.then(function(x){
		console.log('ticket response is!', x);
		res.send(x); 
	})
	.catch(function(e){
		console.log('error getting ticket!', e);
		res.status(400).send(x); 
	}); 

}); 

function getTicket(dir, user, attr) {

	console.log('getting a ticket!', dir, user); 
	if (!attr) {
		let attr = []; 
	}	

	let b = JSON.stringify({
		"UserDirectory": dir,
		"UserId": user,
		"Attributes": attr
	});

	return new Promise(function(resolve, reject) {
		// ticket_proxy is a prefix for a virtual proxy that was set up in the Qlik Management Console (QMC) before running this code
		// if running on localhost, make sure that localhost has been whitelisted and the Access-Control-Allow-Origin header has been set. 
		
		r.post({
			uri: 'https://' + engineUrl + ':4243/qps/ticket_proxy/ticket?xrfkey=abcdefghijklmnop',
			body: b,
			headers: {				
				'x-qlik-xrfkey': 'abcdefghijklmnop',
				'content-type': 'application/json'
			}
		},
		function(err, res, b) {
			if (err) {
				return reject(err);
			} else if (res.statusCode !== 201) {
				err = new Error("Unexpected status code: " + res.statusCode);
				err.res = res;
				return reject(err);
			}
			resolve(JSON.parse(res.body));
		})
	})
};

app.use('/', router);

// run the http and https servers 
var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(5000);
httpsServer.listen(3000); //https server listens on port 3000
