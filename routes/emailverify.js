var mongoose = require( 'mongoose' );
var User = require('../models/user');
var config = require('../config');
const nodemailer = require('nodemailer');
const fs = require('fs');

var smtpTransport = nodemailer.createTransport({
    service: config.email_service,
    auth: {
        type: 'OAuth2',
        user: config.email_userid,
        clientId: config.email_clientid,
        clientSecret: config.email_clientsecret,
        refreshToken: config.email_refresh_token
        //accessToken: serverConfig.gmail.access_token
    }
});
var mailOptions;

exports.sendverification = function(req, res, next){
    const emailto = req.body.emailto;
    const vlink = req.body.vlink;
    var htmltemplatepath = __dirname.replace('routes','templates-html');
    console.log(htmltemplatepath);
    var oriemailBody = fs.readFileSync(htmltemplatepath+'/email-ver.html').toString();
    var emailBody = oriemailBody.replace('{urlperipikasiimel}',vlink);
    mailOptions={
        from:"admin-kaxet <automail@2261381f16411df59996a331671476320c.mail.id>",
        to : emailto,
        subject : "Please confirm your Email account",
        html : emailBody
    }
    //console.log(mailOptions);
    smtpTransport.sendMail(mailOptions, function(error, response){
        if(error){
            return res.status(201).json({ 
                success: false, 
                message: 'Fatal error, '+error.message
            });
        }else{
            return res.status(201).json({ 
                success: true,
                message: 'Message successfully sent.'
            });
        }
    });
}

exports.emverification = function(req, res, next){

    const hash = req.query.id;
    
    // find the user
    User.findOne({ vhash: hash }, function(err, user) {
        if(err){ res.status(400).json({ success: false, message:'Error processing request '+ err}); }

        if (!user) {
            res.status(201).json({ success: false, message: 'UNAuthorised ! Incorrect hash value provided.' });
        }else if (user) {
            if (user.status == 'STSPEND') {
                // login success update last login
                user.verified_email = 'Y';            
                user.vhash = '';
                user.save(function(err) {
                    if(err){ res.status(400).json({ success: false, message:'Error processing request '+ err}); }

                    res.status(200).json({
                        success: true,
                        message: {'userid': user._id, 'username': user.username, 'name': user.name, 'usertype': user.usertype, 'email': user.email},
                        first: 'Y'
                    });
                });
            } else if (user.status == 'STSACT') {
                // login success update last login
                user.verified_email = 'Y';            
                user.vhash = '';
                user.save(function(err) {
                    if(err){ res.status(400).json({ success: false, message:'Error processing request '+ err}); }

                    res.status(200).json({
                        success: true,
                        message: {'userid': user._id, 'username': user.username, 'name': user.name, 'usertype': user.usertype, 'email': user.email},
                        first: 'N'
                    });
                });
            } else {
                //console.log('This not active condition.');
                res.status(201).json({ success: false, message: 'Incorrect user account status. Please check your account status.' });
            }
        }
    });

}