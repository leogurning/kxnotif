const express 	= require('express');
const bodyParser  = require('body-parser');
const mongoose    = require('mongoose');
const cors = require('cors');
const jwt    = require('jsonwebtoken'); 
const config = require('./config');
const emailverify = require('./routes/emailverify.js');
var path = require('path');

const app = express();
const port = process.env.PORT || process.env.KXNOTIFP_SERVICE_PORT || config.serverport;

mongoose.connect(config.database, function(err){
	if(err){
		console.log('Error connecting database, please check if MongoDB is running.');
	}else{
		console.log('Connected to database...');
	}
});

// Enable CORS from client-side
app.use(function(req, res, next) {  
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    if ('OPTIONS' === req.method) { res.sendStatus(204); } else { next(); }
  });

  // use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(require('body-parser').json({ type : '*/*' })); --> this can make error in JSON
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// basic routes
app.get('/', function(req, res) {
	res.send('Kaxet notif API is running at apikxnotif:' + port + '/api');
});

app.post('/sendverification',emailverify.sendverification);
app.post('/sendresetpassword',emailverify.sendresetpassword);
app.get('/verify',emailverify.emverification);
app.get('/pgverify',emailverify.pageverification);
app.post('/welcomemail',emailverify.sendwelcomemail);
app.post('/deactivationemail',emailverify.senddeactivationemail);
app.get('/processenv', (req, res) => {
    res.json(process.env);
});

app.get('*', (req, res) => {
    res.send('Kaxet notif API is running at apikxnotif:' + port + '/api');
});

// kick off the server 
app.listen(port);

console.log('Kaxet notif is listening at PORT:' + port);