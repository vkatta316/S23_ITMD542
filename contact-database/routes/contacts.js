var express = require('express');
var router = express.Router();
const contactsRepo = require('../src/contactsRepository');

let data = [
  {text : 'This is a todo 1 test' , id:'e35a1473-de27-44cc-9de7-a6304e78f976'},
   {text : 'This is a todo 2 test' , id:'7eabce2a-bf5e-4586-bcad-d8102efa8f77'}

];

/* GET home page. */
router.get('/', function(req, res, next) {
  const data = contactsRepo.findAll();
  console.log(data);
  res.render('contacts', { heading: 'List Of All Contacts', contacts:data });
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
    contactsRepo.create({text: req.body.firstName.trim()})
    res.redirect("/contacts");
  }
  
});

module.exports = router;
