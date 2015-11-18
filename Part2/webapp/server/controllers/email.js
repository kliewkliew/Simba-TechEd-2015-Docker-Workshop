var Mailgun = require('mailgun').Mailgun;
var mg = new Mailgun('key-abbaf567885767974a142640edc0e715');

mg.sendText('a@bc.ca', ['a@bc.ca'],
    'This is the subject',
    'Hello world!',
    'postmaster@sandbox132d7cb7b0fd428599421cb4d5a1556d.mailgun.org', {},
    function (err) {
        if (err) console.log('Oh noes: ' + err);
        else console.log('Success');
    }
);
