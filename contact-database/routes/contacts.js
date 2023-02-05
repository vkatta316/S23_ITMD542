var express = require('express');
var router = express.Router();
const contactsRepo = require('../src/contactsRepository');

let data = [{

}];

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('contacts', { heading: 'List Of All Contacts' });
});

/* GET Contact page. */
router.get('/add', function(req, res, next) {
  res.render('contacts_add', { heading: 'Create a New Contact' });
});

/* POST Contact page. */
router.post('/add', function(req, res, next) {
  if(req.body.firstName.trim() === '' || req.body.lastName.trim() === ''){
    res.render('contacts_add' , {heading : 'Create a New Contact' , msg : 'Contact First Name and Last Name are Required Fields'});

  }else{
    // Add data base
    let firstName = req.body.firstName.trim();
    let lastName = req.body.lastName.trim();
    let email = req.body.emailAddress.trim();
    let notes = req.body.notes.trim();
    console.log(firstName + ' ' +lastName +' ' + email + ' ' + notes); 
    contactsRepo.create({text: req.body.firstName.trim()});
    res.redirect("/contacts");
  }
  
});

module.exports = router;
